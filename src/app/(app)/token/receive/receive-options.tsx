import * as Clipboard from "expo-clipboard";
import { SafeAreaView, Platform } from "react-native";
import { useSelector } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { useRouter } from "expo-router";
import { ThemeType } from "../../../../styles/theme";
import type { RootState } from "../../../../store";
import Ethereum from "../../../../assets/svg/ethereum.svg";
import Solana from "../../../../assets/svg/solana.svg";
import CopyIcon from "../../../../assets/svg/copy.svg";
import QRCodeIcon from "../../../../assets/svg/qr-code.svg";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.dark};
  justify-content: flex-end;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.large};
  margin-top: ${(props) => Platform.OS === "android" && "75px"};
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

const IconView = styled.TouchableOpacity<{ theme: ThemeType }>`
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

const ActionContainer = styled.View<{ theme: ThemeType }>`
  display: flex;
  flex-direction: row;
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
  const router = useRouter();
  const handleCopy = async () => {
    await Clipboard.setStringAsync(address);
  };

  return (
    <ReceiveCardsContainer>
      <TextContainer>
        <IconContainer>{icon}</IconContainer>
        <ReceiveText>{chainName}</ReceiveText>
      </TextContainer>
      <ActionContainer>
        <IconView
          onPress={() =>
            router.replace({
              pathname: "camera",
              params: {
                chain: chainName.toLowerCase(),
              },
            })
          }
        >
          <QRCodeIcon width={20} height={20} fill={theme.colors.white} />
        </IconView>
        <IconView onPress={handleCopy}>
          <CopyIcon width={20} height={20} fill={theme.colors.white} />
        </IconView>
      </ActionContainer>
    </ReceiveCardsContainer>
  );
};

export default function ReceiveOptionsPage() {
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
