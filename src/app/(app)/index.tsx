import { useEffect } from "react";
import { Text, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import styled from "styled-components/native";
import { clearPersistedState } from "../../store";
import { ROUTES } from "../../constants/routes";
import { ThemeType } from "../../styles/theme";
import type { RootState } from "../../store";
import { fetchEthereumBalance } from "../../store/walletSlice";
import type { AppDispatch } from "../../store";

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
  const logout = () => {
    clearPersistedState();
    router.replace("/(wallet)/wallet-setup");
  };

  useEffect(() => {
    if (ethWalletAddress) {
      dispatch(fetchEthereumBalance(ethWalletAddress));
    }
  }, [ethWalletAddress, dispatch]);

  console.log(ethWalletAddress);
  console.log(ethBalance);
  return (
    <SafeAreaContainer>
      <ContentContainer></ContentContainer>
      <Text onPress={() => logout()}>logout</Text>
    </SafeAreaContainer>
  );
}
