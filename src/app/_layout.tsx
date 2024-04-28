import { Slot } from "expo-router";
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

  return (
    <ThemeProvider theme={Theme}>
      <WalletProvider>
        <Slot />
      </WalletProvider>
    </ThemeProvider>
  );
}
