import { SafeAreaView } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import styled from "styled-components/native";
import { useSession } from "../providers/wallet-provider";
import Button from "../components/Button/Button";
import { createWallet } from "../utils/createWallet";
import { ThemeType } from "../styles/theme";
import { setStorageItemAsync } from "../hooks/use-storage-state";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
  justify-content: flex-end;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.large};
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

const ButtonContainer = styled.View<{ theme: ThemeType }>`
  padding-left: ${(props) => props.theme.spacing.large};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-bottom: ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.small};
`;

const ExpoImage = styled(Image)`
  flex: 1;
  width: 100%;
`;

const ImageContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const SecondaryButtonContainer = styled.TouchableOpacity`
  padding: 10px 20px;
  border-radius: 5px;
  align-items: center;
  height: 60px;
  justify-content: center;
  width: 100%;
  border-radius: ${(props) => props.theme.borderRadius.large};
`;

const SecondaryButtonText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

export default function SignIn() {
  const { signIn } = useSession();

  const walletSetup = () => {
    const wallet = createWallet();

    if (Object.keys(wallet).length > 0) {
      const address = wallet.address;
      const mnemonicPhrase = wallet.mnemonic.phrase;
      const publicKey = wallet.publicKey;
      const privateKey = wallet.privateKey;

      // TODO: This is temporary and should be done in a
      // more secure way using the secure store

      // setStorageItemAsync("address", address);
      // setStorageItemAsync("mnemonicPhrase", mnemonicPhrase);
      // setStorageItemAsync("publicKey", publicKey);
      // setStorageItemAsync("privateKey", privateKey);

      router.push("/seed-phrase");
    }
  };

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <ImageContainer>
          <ExpoImage
            source={require("../assets/images/wallet.png")}
            contentFit="cover"
          />
        </ImageContainer>

        <TextContainer>
          <Title>Get Started with Ease</Title>
          <Subtitle>
            Secure your financial future with a few easy steps. Your
            decentralized wallet awaits.
          </Subtitle>
        </TextContainer>
      </ContentContainer>
      <ButtonContainer>
        <Button onPress={walletSetup} title="Create Wallet" />
        <SecondaryButtonContainer onPress={() => console.log("importing...")}>
          <SecondaryButtonText>
            Got a wallet? Let's import it
          </SecondaryButtonText>
        </SecondaryButtonContainer>
      </ButtonContainer>
    </SafeAreaContainer>
  );
}
