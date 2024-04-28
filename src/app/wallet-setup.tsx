import { router } from "expo-router";
import styled from "styled-components/native";
import { useSession } from "../providers/wallet-provider";

const Container = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

const StyledText = styled.Text`
  font-family: ${(props) => props.theme.fonts.families.robotoRegular};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
`;

const BoldText = styled.Text`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
`;

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <Container>
      <BoldText
        onPress={() => {
          signIn();
          router.replace("/");
        }}
      >
        Create New Wallet
      </BoldText>
      <StyledText
        onPress={() => {
          signIn();
          router.replace("/");
        }}
      >
        Import Wallet
      </StyledText>
    </Container>
  );
}
