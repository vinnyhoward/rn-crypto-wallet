import { FC, ReactNode } from "react";
import styled from "styled-components/native";
import { Redirect } from "expo-router";
import { ThemeType } from "../../styles/theme";

interface StyledComponentThemeProps {
  theme: ThemeType;
}

const AppContainer = styled.View<StyledComponentThemeProps>`
  flex: 1;
`;

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
  if (!userExists && appReady) {
    return <Redirect href="/(wallet)/setup/wallet-setup" />;
  }

  return <AppContainer>{children}</AppContainer>;
};

export default AnimatedSplashScreen;
