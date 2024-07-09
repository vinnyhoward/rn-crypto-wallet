// Inject node globals into React Native global scope.
global.Buffer = require("buffer").Buffer;

// @ts-ignore
global.location = {
  protocol: "file:",
};

import "react-native-reanimated";
import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { Stack, router, useNavigation } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import styled, { ThemeProvider } from "styled-components/native";
import * as SplashScreen from "expo-splash-screen";
import { clearStorage } from "../hooks/useStorageState";
import Theme from "../styles/theme";
import { store, persistor, clearPersistedState } from "../store";
import { resetSolanaState } from "../store/solanaSlice";
import { resetEthereumState } from "../store/ethereumSlice";
import { ROUTES } from "../constants/routes";
import LeftIcon from "../assets/svg/left-arrow.svg";

SplashScreen.preventAutoHideAsync();

const IconTouchContainer = styled.TouchableOpacity`
  padding: 10px;
`;

export default function RootLayout() {
  const navigation = useNavigation();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      resetSolanaState();
      resetEthereumState();
      clearStorage();
      clearPersistedState();
      router.replace(ROUTES.walletSetup);
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={Theme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                headerTransparent: true,
                gestureEnabled: true,
                headerLeft: () => (
                  <IconTouchContainer onPress={goBack}>
                    <LeftIcon width={35} height={35} fill="#FFF" />
                  </IconTouchContainer>
                ),
              }}
            >
              <Stack.Screen
                name={ROUTES.walletSetup}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(wallet)/seed/seed-phrase"
                options={{
                  title: "Seed Phrase",
                  headerShown: true,
                  headerTransparent: true,
                  headerTitleStyle: {
                    color: "transparent",
                  },
                }}
              />
              <Stack.Screen
                name="(wallet)/seed/confirm-seed-phrase"
                options={{
                  title: "Confirm Seed Phrase",
                  headerShown: true,
                  headerTransparent: true,
                  headerTitleStyle: {
                    color: "transparent",
                  },
                  headerLeft: () => (
                    <IconTouchContainer onPress={() => router.back()}>
                      <LeftIcon width={35} height={35} fill="#FFF" />
                    </IconTouchContainer>
                  ),
                }}
              />
              <Stack.Screen
                name="(wallet)/setup/wallet-created-successfully"
                options={{
                  title: "Confirm Seed Phrase",
                  headerShown: false,
                  headerTransparent: true,
                  headerTitleStyle: {
                    color: "transparent",
                  },
                  headerLeft: null,
                }}
              />
              <Stack.Screen
                name="(wallet)/setup/wallet-import-options"
                options={{
                  title: "Confirm Seed Phrase",
                  headerShown: true,
                  headerTransparent: true,
                  headerTitleStyle: {
                    color: "transparent",
                  },
                  headerLeft: () => (
                    <IconTouchContainer onPress={() => router.back()}>
                      <LeftIcon width={35} height={35} fill="#FFF" />
                    </IconTouchContainer>
                  ),
                }}
              />
              <Stack.Screen
                name="(wallet)/seed/wallet-import-seed-phrase"
                options={{
                  title: "Confirm Seed Phrase",
                  headerShown: true,
                  headerTransparent: true,
                  headerTitleStyle: {
                    color: "transparent",
                  },
                  headerLeft: () => (
                    <IconTouchContainer onPress={() => router.back()}>
                      <LeftIcon width={35} height={35} fill="#FFF" />
                    </IconTouchContainer>
                  ),
                }}
              />
            </Stack>
          </GestureHandlerRootView>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
