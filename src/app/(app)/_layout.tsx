import { Redirect, Stack } from "expo-router";
// import { Text } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { ROUTES } from "../../constants/routes";

export default function AppLayout() {
  const address = useSelector((state: RootState) => state.wallet.address);

  // if (isLoading) {
  //   return <Text>Loading...</Text>;
  // }

  // if (!address) {
  //   return <Redirect href={ROUTES.walletSetup} />;
  // }

  if (true) {
    return <Redirect href={ROUTES.walletSetup} />;
  }

  return <Stack />;
}
