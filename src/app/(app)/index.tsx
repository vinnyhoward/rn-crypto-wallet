import { useEffect, useState } from "react";
import { Text, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import styled from "styled-components/native";
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

export const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.dark};
  justify-content: flex-end;
`;

export const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
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
      <ContentContainer></ContentContainer>
      {/* <Text onPress={() => logout()}>logout</Text> */}
    </SafeAreaContainer>
  );
}
