import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { StackActions } from "@react-navigation/native";
import styled, { useTheme } from "styled-components/native";
import {
  useLocalSearchParams,
  useNavigationContainerRef,
  router,
} from "expo-router";
import { useSelector } from "react-redux";
import type { ThemeType } from "../../../../styles/theme";
import ConfirmSend from "../../../../assets/svg/confirm-send.svg";
import { formatDollar } from "../../../../utils/formatDollars";
import { TICKERS } from "../../../../constants/tickers";
import { truncateWalletAddress } from "../../../../utils/truncateWalletAddress";
import SendConfCard from "../../../../components/SendConfCard/SendConfCard";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import Button from "../../../../components/Button/Button";
import {
  calculateGasAndAmounts,
  sendTransaction,
} from "../../../../utils/etherHelpers";
import { getPrivateKey } from "../../../../hooks/use-storage-state";
import type { RootState } from "../../../../store";

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

const IconBackground = styled.View<{ theme: ThemeType }>`
  background-color: ${(props) => props.theme.colors.ethereum};
  border-radius: 100px;
  padding: ${(props) => props.theme.spacing.large};
`;

const IconView = styled.View<{ theme: ThemeType }>`
  justify-content: center;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.medium};
  width: 100%;
`;

const BalanceContainer = styled.View<{ theme: ThemeType }>`
  margin-top: 10px;
  margin-bottom: ${(props) => props.theme.spacing.huge};
`;

const CryptoBalanceText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.huge};
  color: ${(props) => props.theme.fonts.colors.primary};
  text-align: center;
`;

const UsdBalanceText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.title};
  color: ${(props) => props.theme.colors.lightGrey};
  text-align: center;
`;

const CryptoInfoCardContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const ButtonContainer = styled.View<{ theme: ThemeType }>`
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const ErrorView = styled.View<{ theme: ThemeType }>`
  margin-top: ${(props) => props.theme.spacing.medium};
`;

const ErrorText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.title};
  color: ${(props) => props.theme.colors.error};
  text-align: center;
`;

const ButtonView = styled.View<{ theme: ThemeType }>``;

export default function SendConfirmationPage() {
  const rootNavigation = useNavigationContainerRef();
  const theme = useTheme();
  const {
    address: toAddress,
    amount: tokenAmount,
    chainName: chain,
  } = useLocalSearchParams();

  const prices = useSelector((state: RootState) => state.price.data);
  const solPrice = prices.solana.usd;
  const ethPrice = prices.ethereum.usd;

  const [gasEstimate, setGasEstimate] = useState("0.00");
  const [totalCost, setTotalCost] = useState("0.00");
  const [error, setError] = useState<string | null>(null);
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const chainName = chain as string;
  const ticker = TICKERS[chainName];
  const amount = tokenAmount as string;
  const address = toAddress as string;

  const chainBalance = `${amount} ${ticker}`;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setIsBtnDisabled(true);
      const privateKey = await getPrivateKey();
      const response = await sendTransaction(address, privateKey, amount);

      if (response) {
        rootNavigation.dispatch(StackActions.popToTop());
        const dynamicUrl = `/token/${chainName}`;
        router.navigate(dynamicUrl);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to send transaction:", error);
      setError("Failed to send transaction. Please try again later.");
      setLoading(false);
      setIsBtnDisabled(false);
    }
  };

  const calculateTransactionCosts = async () => {
    const chainPrice = chainName === "ethereum" ? ethPrice : solPrice;
    try {
      const { gasEstimate, totalCost, totalCostMinusGas } =
        await calculateGasAndAmounts(address, amount);

      const gasEstimateUsd = formatDollar(parseFloat(gasEstimate) * chainPrice);

      const totalCostPlusGasUsd = formatDollar(
        parseFloat(totalCost) * chainPrice
      );
      setGasEstimate(gasEstimateUsd);
      setTotalCost(totalCostPlusGasUsd);

      if (totalCostMinusGas > amount) {
        setError("Not enough funds to send transaction.");
        setIsBtnDisabled(true);
      } else {
        setError("");
        setIsBtnDisabled(false);
      }
    } catch (error) {
      console.error("Failed to fetch transaction costs:", error);
    }
  };

  useEffect(() => {
    calculateTransactionCosts();

    const intervalId = setInterval(async () => {
      await calculateTransactionCosts();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [address, amount]);

  const networkName =
    process.env.EXPO_PUBLIC_ENVIRONMENT === "production"
      ? "Mainnet"
      : "Sepolia";

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <IconView>
          <IconBackground>
            <ConfirmSend width={45} height={45} fill={theme.colors.primary} />
          </IconBackground>
        </IconView>
        <BalanceContainer>
          <CryptoBalanceText>{chainBalance}</CryptoBalanceText>
          <UsdBalanceText>{totalCost}</UsdBalanceText>
        </BalanceContainer>
        <CryptoInfoCardContainer>
          <SendConfCard
            toAddress={truncateWalletAddress(address)}
            network={`${capitalizeFirstLetter(chainName)} ${networkName}`}
            networkFee={`Up to ${gasEstimate}`}
          />
          {error && (
            <ErrorView>
              <ErrorText>{error}</ErrorText>
            </ErrorView>
          )}
        </CryptoInfoCardContainer>
        <ButtonView>
          <ButtonContainer>
            <Button
              loading={loading}
              disabled={isBtnDisabled}
              backgroundColor={theme.colors.primary}
              onPress={handleSubmit}
              title="Send"
            />
          </ButtonContainer>
        </ButtonView>
      </ContentContainer>
    </SafeAreaContainer>
  );
}
