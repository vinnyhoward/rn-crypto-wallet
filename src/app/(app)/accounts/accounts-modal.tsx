import { useState } from "react";
import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { clearPersistedState } from "../../../store";
import { clearStorage } from "../../../hooks/use-storage-state";
import { savePhrase } from "../../../hooks/use-storage-state";
import { createWallet } from "../../../utils/etherHelpers";
import { ROUTES } from "../../../constants/routes";
import { ThemeType } from "../../../styles/theme";
import ClearIcon from "../../../assets/svg/clear.svg";
import CloseIcon from "../../../assets/svg/close.svg";
import { SafeAreaContainer } from "../../../components/Styles/Layout.styles";
import Button from "../../../components/Button/Button";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.medium};
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  align-items: center;
  padding: ${(props) => props.theme.spacing.large};
  background-color: ${(props) => props.theme.colors.lightDark};
  border-radius: ${(props) => props.theme.spacing.medium};
`;

const TextTouchContainer = styled.TouchableHighlight``;

const Text = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.fonts.colors.primary};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
`;

const IconContainer = styled.View<{ theme: ThemeType }>`
  background-color: ${(props) => props.theme.colors.lightDark};
  border-radius: ${(props) => props.theme.spacing.medium};
  margin-right: ${(props) => props.theme.spacing.medium};
`;

const SectionTitle = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.fonts.colors.primary};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.title};
  margin-bottom: ${(props) => props.theme.spacing.large};
  text-align: center;
`;

const TopBar = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.lightDark};
`;

const IconTouch = styled.TouchableHighlight`
  padding: 20px;
`;

const AccountsIndex = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const walletSetup = async () => {
    setLoading(true);
    // const wallets = await createWallet();

    // if (Object.keys(wallets).length > 0) {
    // setLoading(false);
    // const masterMnemonicPhrase = wallets.ethereumWallet.mnemonic.phrase;

    // const etherAddress = wallets.ethereumWallet.address;
    // const etherPublicKey = wallets.ethereumWallet.publicKey;

    // const solanaAddress = wallets.solanaWallet.publicKey.toBase58();
    // const solanaPublicKey = wallets.solanaWallet.publicKey.toBase58();

    // try {
    //   await savePhrase(masterMnemonicPhrase);
    // } catch (e) {
    //   console.error("Failed to save private key", e);
    //   throw e;
    // }

    // dispatch(saveEthereumAddress(etherAddress));
    // dispatch(saveEthereumPublicKey(etherPublicKey));

    // dispatch(saveSolanaAddress(solanaAddress));
    // dispatch(saveSolanaPublicKey(solanaPublicKey));

    // router.push({
    //   pathname: ROUTES.seedPhrase,
    //   params: { phrase: masterMnemonicPhrase },
    // });
    // }
  };

  return (
    <>
      <TopBar>
        <IconTouch onPress={() => router.back()}>
          <CloseIcon width={25} height={25} fill={theme.colors.white} />
        </IconTouch>
      </TopBar>
      <SafeAreaContainer>
        <ContentContainer>
          <SectionTitle>Wallets</SectionTitle>
          <Button
            loading={loading}
            onPress={walletSetup}
            title="Create Wallet"
            backgroundColor={theme.colors.primary}
          />
        </ContentContainer>
      </SafeAreaContainer>
    </>
  );
};

export default AccountsIndex;
