import { SafeAreaView } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import styled from "styled-components/native";
import Button from "../../components/Button/Button";
import { ThemeType } from "../../styles/theme";
import { ROUTES } from "../../constants/routes";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
  justify-content: flex-end;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.large};
`;

const Title = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: 32px;
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const Subtitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

const ButtonContainer = styled.View<{ theme: ThemeType }>`
  padding-left: ${(props) => props.theme.spacing.large};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-bottom: ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.small};
`;

const ExpoImage = styled(Image)`
  flex: 1;
  width: 100%;
`;

const ImageContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export default function WalletCreationSuccessPage() {
  return (
    <SafeAreaContainer>
      <ContentContainer>
        <ImageContainer>
          <ExpoImage
            source={require("../../assets/images/wallet_success.png")}
            contentFit="cover"
          />
        </ImageContainer>

        <TextContainer>
          <Title>Welcome Aboard!</Title>
          <Subtitle>
            Your new digital wallet is ready! Dive into securing and exploring
            your financial future. Your crypto journey starts now.
          </Subtitle>
        </TextContainer>
      </ContentContainer>
      <ButtonContainer>
        <Button
          onPress={() => router.push(ROUTES.home)}
          title="Continue to wallet"
        />
      </ButtonContainer>
    </SafeAreaContainer>
  );
}
