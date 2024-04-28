import { Stack, router } from "expo-router";
import { WalletProvider } from "../providers/wallet-provider";
import { ThemeProvider } from "styled-components/native";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import {
  Roboto_400Regular as RobotoReg,
  Roboto_700Bold as RobotoBld,
} from "@expo-google-fonts/roboto";
import LeftArrow from "../assets/svg/left-arrow.svg";
import { clearStorage } from "../hooks/use-storage-state";
import Theme from "../styles/theme";

export default function Root() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    Roboto_400Regular: RobotoReg,
    Roboto_700Bold: RobotoBld,
  });

  if (!fontsLoaded) {
    return null;
  }

  const goBack = () => {
    clearStorage();
    router.back();
  };

  return (
    <ThemeProvider theme={Theme}>
      <WalletProvider>
        <Stack
          screenOptions={{
            headerShown: true,
            headerTransparent: true,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="wallet-setup" options={{ headerShown: false }} />
          <Stack.Screen
            name="seed-phrase"
            options={{
              title: "Seed Phrase",
              headerLeft: () => (
                <LeftArrow
                  width={25}
                  height={25}
                  fill="#FFF"
                  onPress={goBack}
                />
              ),
            }}
          />
        </Stack>
      </WalletProvider>
    </ThemeProvider>
  );
}
