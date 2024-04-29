import { SafeAreaView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Image } from "expo-image";
import { router } from "expo-router";
import styled from "styled-components/native";
import { createWallet } from "../../utils/createWallet";
import { savePrivateKey, savePhrase } from "../../hooks/use-storage-state";
import Button from "../../components/Button/Button";
import { ThemeType } from "../../styles/theme";
import type { RootState } from "../../store";
import { saveAddress, savePublicKey } from "../../store/walletSlice";
import { ROUTES } from "../../constants/routes";

export const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
  justify-content: flex-end;
`;

export const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const TextContainer = styled.View<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.large};
`;

export const Title = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: 32px;
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

export const Subtitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

export const ButtonContainer = styled.View<{ theme: ThemeType }>`
  padding-left: ${(props) => props.theme.spacing.large};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-bottom: ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.small};
`;

export const ExpoImage = styled(Image)`
  flex: 1;
  width: 100%;
`;

export const ImageContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const SecondaryButtonContainer = styled.TouchableOpacity`
  padding: 10px 20px;
  border-radius: 5px;
  align-items: center;
  height: 60px;
  justify-content: center;
  width: 100%;
  border-radius: ${(props) => props.theme.borderRadius.large};
`;

export const SecondaryButtonText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

export default function WalletSetup() {
  const balance = useSelector((state: RootState) => state.wallet.balance);
  const dispatch = useDispatch();

  const walletSetup = () => {
    const wallet = createWallet();

    if (Object.keys(wallet).length > 0) {
      const address = wallet.address;
      const mnemonicPhrase = wallet.mnemonic.phrase;
      const publicKey = wallet.publicKey;
      const privateKey = wallet.privateKey;

      savePhrase(mnemonicPhrase);
      savePrivateKey(privateKey);
      dispatch(saveAddress(address));
      dispatch(savePublicKey(publicKey));

      router.push(ROUTES.seedPhrase);
    }
  };

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <ImageContainer>
          <ExpoImage
            source={require("../../assets/images/wallet_alt.png")}
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
        <SecondaryButtonContainer
          onPress={() => router.push(ROUTES.walletImportOptions)}
        >
          <SecondaryButtonText>
            Got a wallet? Let's import it
          </SecondaryButtonText>
        </SecondaryButtonContainer>
      </ButtonContainer>
    </SafeAreaContainer>
  );
}
