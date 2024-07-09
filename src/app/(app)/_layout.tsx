import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { useSelector } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import Toast from "react-native-toast-message";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import {
  Roboto_400Regular as RobotoReg,
  Roboto_700Bold as RobotoBld,
} from "@expo-google-fonts/roboto";
import { LinearGradient } from "expo-linear-gradient";
import type { RootState } from "../../store";
import LeftIcon from "../../assets/svg/left-arrow.svg";
import CloseIcon from "../../assets/svg/close.svg";
import { getPhrase, clearStorage } from "../../hooks/useStorageState";
import { clearPersistedState } from "../../store";
import { toastConfig } from "../../config/toast";
import Header from "../../components/Header/Header";
import SplashScreenOverlay from "../../components/AnimatedSplashScreen/AnimatedSplashScreen";
import { ThemeType } from "../../styles/theme";

const IconTouchContainer = styled.TouchableOpacity`
  padding: 10px;
`;

export const LinearGradientBackground = styled(LinearGradient)<{
  theme: ThemeType;
}>`
  flex: 1;
`;

export default function AppLayout() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    Roboto_400Regular: RobotoReg,
    Roboto_700Bold: RobotoBld,
  });
  const theme = useTheme();
  const ethActiveIndex = useSelector(
    (state: RootState) => state.ethereum.activeIndex ?? 0
  );

  const solActiveIndex = useSelector(
    (state: RootState) => state.solana.activeIndex ?? 0
  );
  const ethWallet = useSelector(
    (state: RootState) =>
      state.ethereum.addresses[ethActiveIndex]?.address ?? ""
  );

  const solWallet = useSelector(
    (state: RootState) => state.solana.addresses[solActiveIndex]?.address ?? ""
  );
  const [appReady, setAppReady] = useState<boolean>(false);
  const [userExists, setUserExists] = useState<boolean>(false);
  const walletsExist = ethWallet !== "" && solWallet !== "";

  useEffect(() => {
    const prepare = async () => {
      try {
        const phrase = await getPhrase();
        if (!phrase || !walletsExist) {
          clearPersistedState();
          clearStorage();
        } else {
          setUserExists(true);
        }
      } catch (err) {
        console.error("error fetching phrase:", err);
      } finally {
        SplashScreen.hideAsync();
        setAppReady(true);
      }
    };
    SystemUI.setBackgroundColorAsync("black");
    prepare();
  }, []);

  return (
    <LinearGradientBackground colors={theme.colors.primaryLinearGradient}>
      <SplashScreenOverlay
        userExists={userExists}
        appReady={appReady && fontsLoaded}
      >
        <Stack
          screenOptions={{
            headerTransparent: true,
            gestureEnabled: true,
            headerTitle: "",
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              gestureEnabled: true,
              header: (props) => <Header {...props} />,
            }}
          />
          <Stack.Screen
            name="token/[id]"
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              gestureEnabled: true,
              headerRight: null,
              headerLeft: () => (
                <IconTouchContainer onPress={() => router.back()}>
                  <LeftIcon
                    width={25}
                    height={25}
                    fill={theme.colors.primary}
                  />
                </IconTouchContainer>
              ),
            }}
          />
          <Stack.Screen
            name="token/send/send-options"
            options={{
              headerShown: true,
              headerTransparent: true,
              gestureEnabled: true,
              presentation: "modal",
              headerRight: null,
              headerLeft: () => (
                <IconTouchContainer onPress={() => router.back()}>
                  <CloseIcon
                    width={25}
                    height={25}
                    fill={theme.colors.primary}
                  />
                </IconTouchContainer>
              ),
            }}
          />
          <Stack.Screen
            name="token/send/[send]"
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              gestureEnabled: true,
              presentation: "modal",
              headerLeft: null,
              headerRight: null,
              header: () => null,
            }}
          />
          <Stack.Screen
            name="token/receive/[receive]"
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              gestureEnabled: true,
              headerTitleStyle: {
                color: theme.colors.white,
              },
              presentation: "modal",
              headerRight: null,
              headerLeft: () => (
                <IconTouchContainer onPress={() => router.back()}>
                  <LeftIcon width={25} height={25} fill={theme.colors.white} />
                </IconTouchContainer>
              ),
            }}
          />
          <Stack.Screen
            name="token/send/send-confirmation"
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              gestureEnabled: true,
              presentation: "modal",
              headerRight: null,
              headerLeft: () => (
                <IconTouchContainer onPress={() => router.back()}>
                  <LeftIcon
                    width={25}
                    height={25}
                    fill={theme.colors.primary}
                  />
                </IconTouchContainer>
              ),
            }}
          />
          <Stack.Screen
            name="token/receive/receive-options"
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              gestureEnabled: true,
              presentation: "modal",
              headerRight: null,
              headerLeft: () => (
                <IconTouchContainer onPress={() => router.back()}>
                  <CloseIcon
                    width={25}
                    height={25}
                    fill={theme.colors.primary}
                  />
                </IconTouchContainer>
              ),
            }}
          />
          <Stack.Screen
            name="camera/index"
            options={{
              headerShown: false,
              headerTransparent: true,
              headerTitle: "",
              gestureEnabled: true,
              headerRight: null,
              headerLeft: () => (
                <IconTouchContainer onPress={() => router.back()}>
                  <CloseIcon width={25} height={25} fill={theme.colors.white} />
                </IconTouchContainer>
              ),
            }}
          />
          <Stack.Screen
            name="settings/settings-modal"
            options={{
              headerShown: false,
              headerTransparent: true,
              gestureEnabled: true,
              presentation: "modal",
              headerLeft: null,
              headerRight: null,
            }}
          />
          <Stack.Screen
            name="accounts/accounts"
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitle: "Manage Wallets",
              headerTitleStyle: {
                color: "white",
                fontSize: 18,
              },
              gestureEnabled: true,
              headerRight: null,
              headerLeft: () => (
                <IconTouchContainer onPress={() => router.back()}>
                  <LeftIcon
                    width={25}
                    height={25}
                    fill={theme.colors.primary}
                  />
                </IconTouchContainer>
              ),
            }}
          />
          <Stack.Screen
            name="accounts/account-modal"
            options={{
              headerShown: true,
              headerTitleStyle: {
                color: theme.colors.white,
              },
              presentation: "modal",
              headerLeft: () => (
                <IconTouchContainer onPress={() => router.back()}>
                  <CloseIcon
                    width={25}
                    height={25}
                    fill={theme.colors.primary}
                  />
                </IconTouchContainer>
              ),
            }}
          />
          <Stack.Screen
            name="accounts/account-name-modal"
            options={{
              headerShown: true,
              headerTitle: "Edit Account Name",
              headerTitleStyle: {
                color: theme.colors.white,
              },
              presentation: "modal",
              headerLeft: () => (
                <IconTouchContainer onPress={() => router.back()}>
                  <CloseIcon
                    width={25}
                    height={25}
                    fill={theme.colors.primary}
                  />
                </IconTouchContainer>
              ),
            }}
          />
        </Stack>
        <Toast position="top" topOffset={75} config={toastConfig} />
      </SplashScreenOverlay>
    </LinearGradientBackground>
  );
}
