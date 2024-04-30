global.Buffer = require("buffer").Buffer;

import { Redirect, Stack } from "expo-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { ROUTES } from "../../constants/routes";

export default function AppLayout() {
  const ethWallet = useSelector((state: RootState) => state.wallet.ethereum);
  const solWallet = useSelector((state: RootState) => state.wallet.solana);

  if (!ethWallet.address || !solWallet.address) {
    return <Redirect href={ROUTES.walletSetup} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        gestureEnabled: true,
      }}
    />
  );
}
