import { SafeAreaView } from "react-native";
import { Link } from "expo-router";
import styled from "styled-components/native";
import { ThemeType } from "../styles/theme";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.lightDark};
  justify-content: flex-end;
`;

const Title = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: 32px;
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const Subtitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

export default function Page() {
  return (
    <SafeAreaContainer>
      <Title>Seed Phrase</Title>
      <Subtitle>
        Your seed phrase is the key to your wallet. Keep it safe and secure.
      </Subtitle>
    </SafeAreaContainer>
  );
}
