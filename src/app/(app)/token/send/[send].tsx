import { useState, ChangeEvent, useRef } from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { Formik, FormikProps } from "formik";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ThemeType } from "../../../../styles/theme";
import { TICKERS } from "../../../../constants/tickers";
import { ROUTES } from "../../../../constants/routes";
import type { RootState } from "../../../../store";
import { Chains } from "../../../../types";
import SolanaIcon from "../../../../assets/svg/solana.svg";
import EthereumIcon from "../../../../assets/svg/ethereum_plain.svg";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { formatDollar } from "../../../../utils/formatDollars";
import ethService from "../../../../services/EthereumService";
import solanaService from "../../../../services/SolanaService";
import Button from "../../../../components/Button/Button";
import { SafeAreaContainer } from "../../../../components/Styles/Layout.styles";

type FormikChangeHandler = {
  (e: ChangeEvent<any>): void;
  <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any>
    ? void
    : (e: string | ChangeEvent<any>) => void;
};

interface TextInputProps {
  isAddressInputFocused?: boolean;
  isAmountInputFocused?: boolean;
  theme: ThemeType;
}

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.medium};
  margin-top: ${(props) =>
    Platform.OS === "android" && props.theme.spacing.huge};
`;

const IconView = styled.View<{ theme: ThemeType }>`
  justify-content: center;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.medium};
  width: 100%;
`;

const IconBackground = styled.View<{ theme: ThemeType }>`
  background-color: ${(props) => props.theme.colors.ethereum};
  border-radius: 100px;
  padding: ${(props) => props.theme.spacing.large};
`;

const AddressTextInput = styled.TextInput<TextInputProps>`
  height: 60px;
  background-color: ${({ theme }) => theme.colors.lightDark};
  padding: ${({ theme }) => theme.spacing.medium};
  border: 1px solid
    ${({ theme, isAddressInputFocused }) =>
      isAddressInputFocused ? theme.colors.primary : theme.colors.grey};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  color: ${({ theme }) => theme.fonts.colors.primary};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  font-family: ${(props) => props.theme.fonts.families.openRegular};
`;

const AmountTextInput = styled.TextInput<TextInputProps>`
  height: 60px;
  color: ${({ theme }) => theme.fonts.colors.primary};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  padding: ${({ theme }) => theme.spacing.medium};
`;

const AmountTextInputContainer = styled.View<TextInputProps>`
  height: 60px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.lightDark};
  border: 1px solid
    ${({ theme, isAmountInputFocused }) =>
      isAmountInputFocused ? theme.colors.primary : theme.colors.grey};
  border-radius: ${({ theme }) => theme.borderRadius.default};
`;

const TextView = styled.View<{ theme: ThemeType }>`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  margin-top: ${(props) => props.theme.spacing.large};
`;

const TransactionDetailsContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  background-color: ${(props) => props.theme.colors.dark};
  justify-content: space-between;
  width: 100%;
`;

const TransactionDetailsText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.colors.lightGrey};
`;

const ErrorText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  color: ${(props) => props.theme.colors.error};
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const MaxButton = styled.TouchableOpacity<{ theme: ThemeType }>`
  background-color: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.medium};
  border-radius: ${(props) => props.theme.borderRadius.default};
  align-items: center;
  justify-content: center;
  margin-right: 2px;
`;

const TickerText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.colors.lightGrey};
  text-align: center;
  margin-right: ${(props) => props.theme.spacing.medium};
`;

const MaxText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.colors.white};
  text-align: center;
  width: 50px;
`;

const AmountDetailsView = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  align-items: center;
`;

const ButtonContainer = styled.View<{ theme: ThemeType }>`
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const ButtonView = styled.View<{ theme: ThemeType }>``;

const FormWrapper = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: space-between;
`;

interface FormValues {
  address: string;
  amount: string;
}
export default function SendPage() {
  const { send, toAddress } = useLocalSearchParams();
  const theme = useTheme();
  const formRef = useRef<FormikProps<FormValues>>(null);

  const chainName = send as string;
  const toWalletAddress = toAddress as string;
  const ticker = TICKERS[chainName];

  const activeEthIndex = useSelector(
    (state: RootState) => state.ethereum.activeIndex
  );
  const activeSolIndex = useSelector(
    (state: RootState) => state.solana.activeIndex
  );
  const tokenBalance = useSelector(
    (state: RootState) => state[chainName].addresses[activeEthIndex].balance
  );
  const address = useSelector(
    (state: RootState) => state[chainName].addresses[activeSolIndex].address
  );
  const prices = useSelector((state: RootState) => state.price.data);
  const solPrice = prices.solana.usd;
  const ethPrice = prices.ethereum.usd;

  const [isAddressInputFocused, setIsAddressInputFocused] = useState(false);
  const [isAmountInputFocused, setIsAmountInputFocused] = useState(false);

  const renderIcons = () => {
    switch (chainName) {
      case Chains.Solana:
        return <SolanaIcon width={45} height={45} />;
      case Chains.Ethereum:
        return <EthereumIcon width={45} height={45} />;
      default:
        return null;
    }
  };

  const renderDollarAmount = (amountValue: string) => {
    if (amountValue === "") return formatDollar(0);
    const chainPrice = chainName === Chains.Ethereum ? ethPrice : solPrice;
    const USDAmount = chainPrice * parseFloat(amountValue);
    return formatDollar(USDAmount);
  };

  const handleNumericChange =
    (handleChange: FormikChangeHandler) => (field: string) => {
      return (value: string | ChangeEvent<any>) => {
        const finalValue =
          typeof value === "object" && value.target
            ? value.target.value
            : value;
        const numericValue = finalValue
          .replace(/[^0-9.]/g, "")
          .replace(/(\..*)\./g, "$1");
        handleChange(field)(numericValue);
      };
    };

  const validateFields = async (values: FormValues) => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = "This field is required";
    }
    if (!values.amount) {
      errors.amount = "This field is required";
    }

    const isAddressValid = await validateAddress(values.address);
    if (!isAddressValid) {
      errors.address = "Recipient address is invalid";
    }

    if (values.amount && parseFloat(values.amount) > 0) {
      await validateFunds(values, errors);
    }

    return errors;
  };

  const validateAddress = async (address: string): Promise<boolean> => {
    return chainName === Chains.Ethereum
      ? ethService.validateAddress(address)
      : await solanaService.validateAddress(address);
  };

  const validateFunds = async (
    values: FormValues,
    errors: Record<string, string>
  ) => {
    const amount = parseFloat(values.amount);
    if (amount > tokenBalance) {
      errors.amount = "Insufficient funds";
    } else {
      await calculateCostsAndValidate(amount, values.address, errors);
    }
  };

  const calculateCostsAndValidate = async (
    amount: number,
    toAddress: string,
    errors: Record<string, string>
  ) => {
    if (chainName === Chains.Ethereum) {
      const { totalCostMinusGas } = await ethService.calculateGasAndAmounts(
        toAddress,
        amount.toString()
      );
      if (totalCostMinusGas > tokenBalance) {
        errors.amount = "Insufficient funds for amount plus gas costs";
      }
    } else if (chainName === Chains.Solana) {
      const transactionFeeLamports =
        await solanaService.calculateTransactionFee(address, toAddress, amount);

      const tokenBalanceLamports = amount * LAMPORTS_PER_SOL;
      const maxAmountLamports = tokenBalanceLamports - transactionFeeLamports;
      const maxAmount = maxAmountLamports / LAMPORTS_PER_SOL;
      if (maxAmount > amount) {
        errors.amount = "Insufficient funds for amount plus transaction fees";
      }
    }
  };

  const calculateMaxAmount = async (
    setFieldValue: (field: string, value: any) => void,
    tokenBalance: string,
    address: string
  ) => {
    const toAddress = formRef.current?.values?.address || "";

    const isAddressValid =
      chainName === Chains.Ethereum
        ? ethService.validateAddress(toAddress)
        : await solanaService.validateAddress(toAddress);

    if (!isAddressValid) {
      formRef.current?.setFieldError(
        "address",
        "A valid address is required to calculate max amount"
      );
      return;
    }

    try {
      if (chainName === Chains.Ethereum) {
        const { totalCostMinusGas } = await ethService.calculateGasAndAmounts(
          address,
          tokenBalance
        );
        setFieldValue("amount", totalCostMinusGas);
      } else if (chainName === Chains.Solana) {
        const totalBalanceLamports =
          parseFloat(tokenBalance) * LAMPORTS_PER_SOL;
        const transactionFeeLamports =
          await solanaService.calculateTransactionFee(
            address,
            toAddress,
            totalBalanceLamports
          );
        const maxAmountLamports = totalBalanceLamports - transactionFeeLamports;
        const maxAmount = maxAmountLamports / LAMPORTS_PER_SOL;
        if (maxAmountLamports > 0) {
          setFieldValue("amount", maxAmount.toString());
        } else {
          setFieldValue("amount", "0");
          console.error("Insufficient funds for transaction fee.");
        }
      }
    } catch (error) {
      console.error("Failed to calculate max amount:", error);
      setFieldValue("amount", "0");
    }
  };

  const handleSubmit = async (values: { address: string; amount: string }) => {
    router.push({
      pathname: ROUTES.sendConfirmation,
      params: {
        address: values.address,
        amount: values.amount,
        chainName: chainName,
      },
    });
  };

  const initialValues = { address: toWalletAddress, amount: "" };

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <IconView>
          <IconBackground>{renderIcons()}</IconBackground>
        </IconView>
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          validate={validateFields}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            setFieldValue,
          }) => (
            <FormWrapper>
              <TextContainer>
                <TextView>
                  <AddressTextInput
                    isAddressInputFocused={isAddressInputFocused}
                    placeholder={`Recipient's ${capitalizeFirstLetter(
                      chainName
                    )} address`}
                    value={values.address}
                    onChangeText={handleChange("address")}
                    onFocus={() => setIsAddressInputFocused(true)}
                    onBlur={handleBlur("email")}
                    onEndEditing={() => setIsAddressInputFocused(false)}
                    placeholderTextColor={theme.colors.lightGrey}
                  />
                </TextView>
                {errors.address && <ErrorText>{errors.address}</ErrorText>}
                <TextView>
                  <AmountTextInputContainer>
                    <AmountTextInput
                      returnKeyType="done"
                      isAmountInputFocused={isAmountInputFocused}
                      placeholder="Amount"
                      value={values.amount}
                      onChangeText={handleNumericChange(handleChange)("amount")}
                      onFocus={() => setIsAmountInputFocused(true)}
                      onBlur={handleBlur("email")}
                      onEndEditing={() => setIsAmountInputFocused(false)}
                      placeholderTextColor={theme.colors.lightGrey}
                      keyboardType="numeric"
                    />
                    <AmountDetailsView>
                      <TickerText>{ticker}</TickerText>
                      <MaxButton
                        onPress={() =>
                          calculateMaxAmount(
                            setFieldValue,
                            tokenBalance,
                            values.address
                          )
                        }
                      >
                        <MaxText>Max</MaxText>
                      </MaxButton>
                    </AmountDetailsView>
                  </AmountTextInputContainer>
                </TextView>
                {errors.amount && <ErrorText>{errors.amount}</ErrorText>}
                <TransactionDetailsContainer>
                  <TransactionDetailsText>
                    {renderDollarAmount(values.amount)}
                  </TransactionDetailsText>
                  <TransactionDetailsText>
                    Available {tokenBalance} {ticker}
                  </TransactionDetailsText>
                </TransactionDetailsContainer>
              </TextContainer>
              <ButtonView>
                <ButtonContainer>
                  <Button
                    backgroundColor={theme.colors.lightDark}
                    color={theme.colors.white}
                    onPress={() => router.back()}
                    title="Cancel"
                  />
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                    backgroundColor={theme.colors.primary}
                    onPress={handleSubmit}
                    title="Next"
                  />
                </ButtonContainer>
              </ButtonView>
            </FormWrapper>
          )}
        </Formik>
      </ContentContainer>
    </SafeAreaContainer>
  );
}
