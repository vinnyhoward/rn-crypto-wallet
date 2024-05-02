import { SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { useLocalSearchParams } from "expo-router";
import type { ThemeType } from "../../../../styles/theme";
import type { AppDispatch, RootState } from "../../../../store";
import Ethereum from "../../../assets/svg/ethereum.svg";
import Solana from "../../../assets/svg/solana.svg";
import CopyIcon from "../../../assets/svg/copy.svg";

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

const SectionTitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.title};
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.medium};
  margin-left: ${(props) => props.theme.spacing.small};
  text-align: center;
`;

export default function SendConfirmationPage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { address, amount, chainName } = useLocalSearchParams();

  const ethAddress = useSelector(
    (state: RootState) => state.wallet.ethereum.address
  );
  const solAddress = useSelector(
    (state: RootState) => state.wallet.solana.address
  );
  console.log("params:", {
    address,
    amount,
    chainName,
  });
  return (
    <SafeAreaContainer>
      <ContentContainer>
        <SectionTitle>Confirm Send</SectionTitle>
      </ContentContainer>
    </SafeAreaContainer>
  );
}
