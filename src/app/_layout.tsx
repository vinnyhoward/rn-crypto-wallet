import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { Stack, router, useNavigation } from "expo-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import styled, { ThemeProvider } from "styled-components/native";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import {
  Roboto_400Regular as RobotoReg,
  Roboto_700Bold as RobotoBld,
} from "@expo-google-fonts/roboto";
import { clearStorage } from "../hooks/use-storage-state";
import Theme from "../styles/theme";
import { store, persistor, clearPersistedState } from "../store";
import { ROUTES } from "../constants/routes";
import LeftIcon from "../assets/svg/left-arrow.svg";
import Toast from "react-native-toast-message";

const IconTouchContainer = styled.TouchableOpacity`
  padding: 10px;
`;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    Roboto_400Regular: RobotoReg,
    Roboto_700Bold: RobotoBld,
  });
  const navigation = useNavigation();

  if (!fontsLoaded) {
    return null;
  }

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      clearStorage();
      clearPersistedState();
      router.replace(ROUTES.walletSetup);
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={Theme}>
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
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(wallet)/seed-phrase"
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
              name="(wallet)/confirm-seed-phrase"
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
              name="(wallet)/wallet-created-successfully"
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
              name="(wallet)/wallet-import-options"
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
              name="(wallet)/wallet-import-seed-phrase"
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
          <Toast position="bottom" bottomOffset={20} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
