import { FC, ReactNode } from "react";
import styled, { useTheme } from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { ThemeType } from "../../styles/theme";

interface StyledComponentThemeProps {
  theme: ThemeType;
}

const AppContainer = styled.View<StyledComponentThemeProps>`
  flex: 1;
`;

export const LinearGradientBackground = styled(
  LinearGradient
)<StyledComponentThemeProps>`
  width: 100%;
  height: 100%;
`;

const ExpoImage = styled(Image)<StyledComponentThemeProps>``;

interface AnimatedSplashScreenProps {
  children: ReactNode;
  appReady: boolean;
  userExists: boolean;
}

const AnimatedSplashScreen: FC<AnimatedSplashScreenProps> = ({
  children,
  appReady,
  userExists,
}) => {
  const theme = useTheme();

  if (!userExists) {
    return <Redirect href="/(wallet)/setup/wallet-setup" />;
  }

  if (!appReady) {
    return (
      <LinearGradientBackground colors={theme.colors.primaryLinearGradient}>
        <ExpoImage />
      </LinearGradientBackground>
    );
  }

  return <AppContainer>{children}</AppContainer>;
};

export default AnimatedSplashScreen;
