import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { ThemeType } from "../../../styles/theme";
import type { AppDispatch, RootState } from "../../../store";
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

const ReceiveCardsContainer = styled.View<{ theme: ThemeType }>`
  height: 75px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.lightDark};
  margin-bottom: ${(props) => props.theme.spacing.medium};
  border-radius: ${(props) => props.theme.borderRadius.large};
  padding: ${(props) => props.theme.spacing.medium};
`;

const ReceiveText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  align-items: center;
`;

const IconContainer = styled.View<{ theme: ThemeType }>`
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  border-radius: 100px;
  margin-right: 5px;
`;

const CopyView = styled.TouchableOpacity<{ theme: ThemeType }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 50px;
  padding: ${(props) => props.theme.spacing.medium};
  height: 45px;
  width: 45px;
  margin-right: ${(props) => props.theme.spacing.small};
`;

interface ReceiveCardsProps {
  chainName: string;
  address: string;
  icon: React.ReactNode;
}

const ReceiveCard: React.FC<ReceiveCardsProps> = ({
  chainName,
  address,
  icon,
}) => {
  const theme = useTheme();
  const handleCopy = async () => {
    await Clipboard.setStringAsync(address);
  };
  return (
    <ReceiveCardsContainer>
      <TextContainer>
        <IconContainer>{icon}</IconContainer>
        <ReceiveText>{chainName}</ReceiveText>
      </TextContainer>
      <CopyView onPress={handleCopy}>
        <CopyIcon width={20} height={20} fill={theme.colors.white} />
      </CopyView>
    </ReceiveCardsContainer>
  );
};

export default function ReceivePage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const ethAddress = useSelector(
    (state: RootState) => state.wallet.ethereum.address
  );
  const solAddress = useSelector(
    (state: RootState) => state.wallet.solana.address
  );

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <ReceiveCard
          chainName="Ethereum"
          address={ethAddress}
          icon={<Ethereum width={35} height={35} />}
        />
        <ReceiveCard
          chainName="Solana"
          address={solAddress}
          icon={<Solana width={25} height={25} />}
        />
      </ContentContainer>
    </SafeAreaContainer>
  );
}
