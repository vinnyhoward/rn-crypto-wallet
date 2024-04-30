import { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { clearPersistedState } from "../../store";
import { ROUTES } from "../../constants/routes";
import { ThemeType } from "../../styles/theme";
import type { RootState } from "../../store";
import {
  fetchEthereumBalance,
  updateSolanaBalance,
} from "../../store/walletSlice";
import type { AppDispatch } from "../../store";
import { fetchCryptoPrices } from "../../utils/fetchCryptoPrices";
import { getSolanaBalance } from "../../utils/getSolanaBalance";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import SendIcon from "../../assets/svg/send.svg";
import ReceiveIcon from "../../assets/svg/receive.svg";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.dark};
  justify-content: flex-end;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
`;

const BalanceContainer = styled.View<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.large};
  margin-top: 25px;
`;

const BalanceText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.uberHuge};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

const ActionContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing.large};
  width: 100%;
`;

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const ethWalletAddress = useSelector(
    (state: RootState) => state.wallet.ethereum.address
  );
  const ethBalance = useSelector(
    (state: RootState) => state.wallet.ethereum.balance
  );
  const solWalletAddress = useSelector(
    (state: RootState) => state.wallet.solana.address
  );
  const solBalance = useSelector(
    (state: RootState) => state.wallet.solana.balance
  );
  const [usdBalance, setUsdBalance] = useState(0);

  const logout = () => {
    clearPersistedState();
    router.replace("/(wallet)/wallet-setup");
  };

  useEffect(() => {
    const fetchSolanaBalance = async () => {
      const currentSolBalance = await getSolanaBalance(solWalletAddress);
      dispatch(updateSolanaBalance(currentSolBalance));
    };

    if (ethWalletAddress) {
      dispatch(fetchEthereumBalance(ethWalletAddress));
    }

    if (solWalletAddress) {
      fetchSolanaBalance();
    }
  }, [ethWalletAddress, dispatch]);

  useEffect(() => {
    const fetchPrices = async () => {
      // const prices = await fetchCryptoPrices();
      // setUsdBalance(prices.ethereum.usd * ethBalance);
      const mockUsd = 3199.99;
      const ethUsd = mockUsd * ethBalance;
      const solUsd = mockUsd * solBalance;
      setUsdBalance(ethUsd + solUsd);
    };

    fetchPrices();
  }, [ethBalance, solBalance]);

  console.log("eth address", ethWalletAddress);
  console.log("eth balance", ethBalance);
  console.log("usd balance", usdBalance);
  return (
    <SafeAreaContainer>
      <ScrollView>
        <ContentContainer>
          <BalanceContainer>
            <BalanceText>${usdBalance.toFixed(2)}</BalanceText>
          </BalanceContainer>
          <ActionContainer>
            <PrimaryButton
              icon={
                <SendIcon width={25} height={25} fill={theme.colors.primary} />
              }
              onPress={() => router.push(ROUTES.sendCrypto)}
              btnText="Send"
            />
            <View style={{ width: 15 }} />
            <PrimaryButton
              icon={
                <ReceiveIcon
                  width={25}
                  height={25}
                  fill={theme.colors.primary}
                />
              }
              onPress={() => router.push(ROUTES.receiveCrypto)}
              btnText="Receive"
            />
          </ActionContainer>
        </ContentContainer>
        {/* <Text onPress={() => logout()}>logout</Text> */}
      </ScrollView>
    </SafeAreaContainer>
  );
}
