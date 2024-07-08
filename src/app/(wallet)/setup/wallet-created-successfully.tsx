import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "moti";
import styled, { useTheme } from "styled-components/native";
import Button from "../../../components/Button/Button";
import { LinearGradientBackground } from "../../../components/Styles/Gradient";
import { ThemeType } from "../../../styles/theme";
import { ROUTES } from "../../../constants/routes";
import CheckMark from "../../../assets/svg/check-mark.svg";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
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

const ImageContainer = styled(View)<{ theme: ThemeType }>`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export default function WalletCreationSuccessPage() {
  const { successState } = useLocalSearchParams();
  const theme = useTheme();
  const [title, setTitle] = useState("Welcome Aboard!");
  const [subtitle, setSubtitle] = useState(
    "Your new digital wallet is ready! Dive into securing and exploring your financial future. Your crypto journey starts now."
  );

  useEffect(() => {
    if (successState === "import") {
      setTitle("Wallet Imported Successfully");
      setSubtitle(
        "Your imported wallet is ready! Dive into securing and exploring your financial future. Your crypto journey starts now."
      );
    }
  }, [successState]);

  return (
    <LinearGradientBackground colors={theme.colors.primaryLinearGradient}>
      <SafeAreaContainer>
        <ContentContainer>
          <ImageContainer
            from={{
              translateY: -25,
            }}
            animate={{
              translateY: 50,
            }}
            transition={{
              loop: true,
              type: "timing",
              duration: 3000,
              delay: 100,
            }}
          >
            <ExpoImage
              source={require("../../../assets/images/wallet_success.png")}
              contentFit="cover"
            />
          </ImageContainer>

          <TextContainer>
            <Title>{title}</Title>
            <Subtitle>{subtitle}</Subtitle>
          </TextContainer>
        </ContentContainer>
        <ButtonContainer>
          <Button
            linearGradient={theme.colors.secondaryLinearGradient}
            onPress={() => router.replace(ROUTES.home)}
            title="Continue to wallet"
            icon={
              <CheckMark width={25} height={25} fill={theme.colors.white} />
            }
          />
        </ButtonContainer>
      </SafeAreaContainer>
    </LinearGradientBackground>
  );
}
