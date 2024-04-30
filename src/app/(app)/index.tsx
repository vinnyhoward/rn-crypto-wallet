import { Text, View } from "react-native";
import { router } from "expo-router";
import { clearPersistedState } from "../../store";

export default function Index() {
  const logout = () => {
    clearPersistedState();
    router.replace("/(wallet)/wallet-setup");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text onPress={() => logout()}>logout</Text>
    </View>
  );
}
