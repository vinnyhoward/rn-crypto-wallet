import { Image } from "expo-image";
import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { ThemeType } from "../../../styles/theme";
import { ROUTES } from "../../../constants/routes";
import ImportWalletIcon from "../../../assets/svg/import-wallet.svg";
import { SafeAreaContainer } from "../../../components/Styles/Layout.styles";
import { Subtitle } from "../../../components/Styles/Text.styles";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.large};
`;

const Title = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: 32px;
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.small};
  text-align: center;
`;

const ExpoImage = styled(Image)`
  flex: 1;
  width: 100%;
`;

const ImageContainer = styled.View<{ theme: ThemeType }>`
  width: 100%;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
`;

const ButtonContainer = styled.View<{ theme: ThemeType }>`
  padding-left: ${(props) => props.theme.spacing.large};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-bottom: ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.small};
  width: 100%;
`;

const InfoButtonContainer = styled.TouchableOpacity<{ theme: ThemeType }>`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.lightDark};
  padding: 10px 20px;
  border-radius: 5px;
  height: 70px;
  width: 100%;
  border-radius: ${(props) => props.theme.borderRadius.large};
  padding: ${(props) => props.theme.spacing.large};
`;

const InfoButtonText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${({ theme }) => theme.colors.white};
`;

const InfoText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  color: ${({ theme }) => theme.colors.white};
`;

const InfoTextContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: column;
`;

const Circle = styled.View<{ theme: ThemeType }>`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.grey};
  margin-right: ${(props) => props.theme.spacing.large};
`;

const InfoButton = () => {
  const theme = useTheme();
  return (
    <InfoButtonContainer
      onPress={() => router.push(ROUTES.walletImportSeedPhrase)}
    >
      <Circle>
        <ImportWalletIcon width={25} height={25} fill={theme.colors.white} />
      </Circle>
      <InfoTextContainer>
        <InfoButtonText>Import Secret Recovery Phrase</InfoButtonText>
        <InfoText>Import an existing wallet</InfoText>
      </InfoTextContainer>
    </InfoButtonContainer>
  );
};

export default function WalletSetup() {
  return (
    <SafeAreaContainer>
      <ContentContainer>
        <ImageContainer>
          <ExpoImage
            source={require("../../../assets/images/import_wallet.png")}
            contentFit="cover"
          />
        </ImageContainer>

        <TextContainer>
          <Title>Import a wallet</Title>
          <Subtitle>
            Import an existing wallet with your secret phrase or with your
            private key
          </Subtitle>
        </TextContainer>
        <ButtonContainer>
          <InfoButton />
        </ButtonContainer>
      </ContentContainer>
    </SafeAreaContainer>
  );
}
