import { FC, ReactNode } from "react";
import Constants from "expo-constants";
import styled, { useTheme } from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Redirect, router } from "expo-router";
import { ThemeType } from "../../styles/theme";

interface StyledComponentThemeProps {
  theme: ThemeType;
}

const AppContainer = styled.View<StyledComponentThemeProps>`
  flex: 1;
`;

export const LinearGradientBackground = styled(LinearGradient)<{
  theme: ThemeType;
}>`
  width: 100%;
  height: 100%;
`;

const ExpoImage = styled(Image)<StyledComponentThemeProps>``;

interface AnimatedSplashScreenProps {
  children: ReactNode;
  appReady: boolean;
  userExists: boolean;
}

const ImageContainer = styled.View<{ theme: ThemeType }>`
  width: 100%;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
`;

const AnimatedSplashScreen: FC<AnimatedSplashScreenProps> = ({
  children,
  appReady,
  userExists,
}) => {
  const theme = useTheme();

  if (!appReady) {
    return (
      <LinearGradientBackground colors={theme.colors.primaryLinearGradient}>
        <ImageContainer>
          <ExpoImage
            source={require("../../assets/images/mascot_head.png")}
            contentFit="cover"
          />
        </ImageContainer>
      </LinearGradientBackground>
    );
  }

  if (!userExists && appReady) {
    return <Redirect href="/(wallet)/setup/wallet-setup" />;
  }

  return <AppContainer>{children}</AppContainer>;
};

export default AnimatedSplashScreen;
