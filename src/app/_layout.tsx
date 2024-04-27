import { Slot } from "expo-router";
import { WalletProvider } from "../providers/wallet-provider";

export default function Root() {
  return (
    <WalletProvider>
      <Slot />
    </WalletProvider>
  );
}
