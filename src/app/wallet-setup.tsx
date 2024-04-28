import { router } from "expo-router";
import styled from "styled-components/native";
import { useSession } from "../providers/wallet-provider";

const Container = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
`;
const Caption = styled.Text`
  font-size: 18px;
  color: blue;
  font-weight: 500;
`;

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <Container>
      <Caption
        onPress={() => {
          signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace("/");
        }}
      >
        Create Wallet
      </Caption>
    </Container>
  );
}
