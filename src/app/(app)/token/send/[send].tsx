import "react-native-get-random-values";
import "@ethersproject/shims";

import { useEffect, useState, ChangeEvent } from "react";
import { SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { JsonRpcProvider, formatEther, parseEther } from "ethers";
import { Formik } from "formik";
import { ThemeType } from "../../../../styles/theme";
import { TICKERS } from "../../../../constants/tickers";
import { ROUTES } from "../../../../constants/routes";
import type { AppDispatch, RootState } from "../../../../store";
import SolanaIcon from "../../../../assets/svg/solana.svg";
import EthereumIcon from "../../../../assets/svg/ethereum_plain.svg";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { formatDollar } from "../../../../utils/formatDollars";
import { isAddressValid } from "../../../../utils/etherHelpers";
import Button from "../../../../components/Button/Button";

const { EXPO_PUBLIC_ALCHEMY_KEY, EXPO_PUBLIC_ALCHEMY_URL } = process.env;
const ethereumUrl = EXPO_PUBLIC_ALCHEMY_URL + EXPO_PUBLIC_ALCHEMY_KEY;

const provider = new JsonRpcProvider(ethereumUrl);

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

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.dark};
  justify-content: flex-end;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.large};
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
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const ButtonView = styled.View<{ theme: ThemeType }>``;

const FormWrapper = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: space-between;
`;

export default function SendPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { send } = useLocalSearchParams();
  const theme = useTheme();

  const chainName = send as string;
  const ticker = TICKERS[chainName];

  const tokenAddress = useSelector(
    (state: RootState) => state.wallet[chainName].address
  );
  const tokenBalance = useSelector(
    (state: RootState) => state.wallet[chainName].balance
  );

  const [isAddressInputFocused, setIsAddressInputFocused] = useState(false);
  const [isAmountInputFocused, setIsAmountInputFocused] = useState(false);
  const [gasPrice, setGasPrice] = useState(0);

  const renderIcons = () => {
    switch (chainName) {
      case "solana":
        return <SolanaIcon width={45} height={45} />;
      case "ethereum":
        return <EthereumIcon width={45} height={45} />;
      default:
        return null;
    }
  };

  const renderDollarAmount = (amountValue: string) => {
    if (amountValue === "") return formatDollar(0);
    // TODO: Use api for actual eth price
    const ethPriceMock = 3006.94;
    const USDAmount = ethPriceMock * parseFloat(amountValue);
    const currentUSDBalance = USDAmount * tokenBalance;
    return formatDollar(currentUSDBalance);
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

  const validateFields = async (values: {
    address: string;
    amount: string;
  }) => {
    const errors: Record<string, string> = {};
    if (!values.address) {
      errors.address = "This field is required";
    }
    if (!values.amount) {
      errors.amount = "This field is required";
    }

    if (
      values.amount > tokenBalance &&
      values.amount !== "" &&
      tokenBalance !== 0
    ) {
      errors.amount = "Insufficient funds";
    } else {
      const amountInWei = parseEther(values.amount);
      const transaction = {
        to: values.address,
        value: amountInWei,
      };
      const gasEstimate = await provider.estimateGas(transaction);
      const intGasEstimate = BigInt(gasEstimate);
      const gasPrice = (await provider.getFeeData()).gasPrice;
      const intGasPrice = BigInt(gasPrice);
      const totalGasCost = intGasEstimate * intGasPrice;
      const totalCost = formatEther(totalGasCost + amountInWei);

      if (totalCost > tokenBalance) {
        errors.amount = "Insufficient funds for amount plus gas costs";
      }
    }

    if (!isAddressValid(values.address)) {
      errors.address = "Recipient address is invalid";
    }

    return errors;
  };

  const calculateMaxAmount = async (
    setFieldValue: (field: string, value: any) => void,
    tokenBalance: string,
    address: string
  ) => {
    try {
      const dummyTransaction = {
        to: address,
        value: parseEther(tokenBalance.toString()),
      };

      const gasLimit = await provider.estimateGas(dummyTransaction);
      const gasPrice = (await provider.getFeeData()).gasPrice;
      const intGasLimit = BigInt(gasLimit);
      const intGasPrice = BigInt(gasPrice);
      const gasCost = intGasLimit * intGasPrice;
      const tokenBalanceInWei = parseEther(tokenBalance.toString());

      const maxAmountWei = tokenBalanceInWei - gasCost;
      const maxAmountEther = formatEther(maxAmountWei);

      setFieldValue("amount", maxAmountEther);
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

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <IconView>
          <IconBackground>{renderIcons()}</IconBackground>
        </IconView>
        <Formik
          initialValues={{ address: "", amount: "" }}
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
