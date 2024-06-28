// Inject node globals into React Native global scope.

global.Buffer = require("buffer").Buffer;

// @ts-ignore
global.location = {
  protocol: "file:",
};

import { useState, useEffect } from "react";
import { Stack, router } from "expo-router";
import { useSelector } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import type { RootState } from "../../store";
import { ROUTES } from "../../constants/routes";
import LeftIcon from "../../assets/svg/left-arrow.svg";
import CloseIcon from "../../assets/svg/close.svg";
import { getPhrase, clearStorage } from "../../hooks/use-storage-state";
import { clearPersistedState } from "../../store";
import { toastConfig } from "../../config/toast";
import Header from "../../components/Header/Header";

const IconTouchContainer = styled.TouchableOpacity`
  padding: 10px;
`;

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const theme = useTheme();
  const ethWallet = useSelector((state: RootState) => state.wallet.ethereum);
  const solWallet = useSelector((state: RootState) => state.wallet.solana);
  const [loading, setLoading] = useState<boolean>(true);

  const walletsExist =
    ethWallet.activeAddress.address !== "" &&
    solWallet.activeAddress.address !== "";

  useEffect(() => {
    const loadSeedPhraseConfirmation = async () => {
      const phrase = await getPhrase();

      if (!phrase || !walletsExist) {
        clearPersistedState();
        clearStorage();
        router.replace(ROUTES.walletSetup);
      }
    };

    loadSeedPhraseConfirmation();
    setLoading(false);
  }, []);

  if (!loading) {
    SplashScreen.hideAsync();
  }

  return (
    <>
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
                <LeftIcon width={25} height={25} fill={theme.colors.primary} />
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
                <CloseIcon width={25} height={25} fill={theme.colors.primary} />
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
                <LeftIcon width={25} height={25} fill={theme.colors.primary} />
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
                <CloseIcon width={25} height={25} fill={theme.colors.primary} />
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
                <LeftIcon width={25} height={25} fill={theme.colors.primary} />
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
                <CloseIcon width={25} height={25} fill={theme.colors.primary} />
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
                <CloseIcon width={25} height={25} fill={theme.colors.primary} />
              </IconTouchContainer>
            ),
          }}
        />
      </Stack>
      <Toast position="top" topOffset={75} config={toastConfig} />
    </>
  );
}
