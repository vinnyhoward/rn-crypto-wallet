import React, { useState } from "react";
import { Dimensions, Keyboard, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import {
  importAllActiveEthAddresses,
  findNextUnusedEthWalletIndex,
} from "../../../utils/etherHelpers";
import {
  importAllActiveSolAddresses,
  findNextUnusedSolWalletIndex,
} from "../../../utils/solanaHelpers";
import { ThemeType } from "../../../styles/theme";
import {
  saveEthereumAccountDetails,
  saveSolanaAccountDetails,
  saveAllEthereumAddresses,
  saveAllSolanaAddresses,
} from "../../../store/walletSlice";
import type { AddressState } from "../../../store/walletSlice";
import Button from "../../../components/Button/Button";
import { ROUTES } from "../../../constants/routes";
import { savePhrase } from "../../../hooks/use-storage-state";
import { Title, Subtitle } from "../../../components/Styles/Text.styles";
import {
  ErrorTextCenter,
  ErrorTextContainer,
} from "../../../components/Styles/Errors.styles";

const isAndroid = Platform.OS === "android";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.lightDark};
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing.medium};
  margin-top: ${(props) => isAndroid && props.theme.spacing.huge};
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  margin-bottom: ${(props) => props.theme.spacing.huge};
`;

const ButtonContainer = styled.View<{ theme: ThemeType }>`
  padding-left: ${(props) => props.theme.spacing.large};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-bottom: ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.small};
  width: 100%;
`;

const SeedTextInput = styled.TextInput<{ theme: ThemeType }>`
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.large};
  margin: ${(props) => props.theme.spacing.large};
  background-color: ${(props) => props.theme.colors.dark};
  border-radius: ${(props) => props.theme.borderRadius.extraLarge};
  width: ${(Dimensions.get("window").width - 80).toFixed(0)}px;
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.fonts.sizes.large};\
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  border: 1px solid ${(props) => props.theme.colors.grey};
`;

const CaptionFeedback = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.large};
  padding-left: ${(props) => props.theme.spacing.tiny};
  padding-right: ${(props) => props.theme.spacing.tiny};
  text-align: center;
`;

const captionsArr: string[] = [
  "Hang tight! We're fetching your wallet details...",
  "This might take a minute. Importing wallet securely...",
  "Almost there! Syncing with the blockchain...",
];

export default function Page() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [textValue, setTextValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [captions, setCaptions] = useState<string>("");

  const setCaptionsInterval = () => {
    setCaptions(captionsArr[0]);
    let interval: NodeJS.Timeout = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * captionsArr.length);
      setCaptions(captionsArr[randomIndex]);
    }, 8000);
    return () => {
      clearInterval(interval);
      setCaptions("");
    };
  };

  const handleVerifySeedPhrase = async () => {
    setLoading(true);
    const errorText =
      "Looks like the seed phrase is incorrect. Please try again.";
    const phraseTextValue = textValue.trimEnd();
    if (phraseTextValue.split(" ").length !== 12) {
      setError(errorText);
      setLoading(false);
      return;
    }

    const captionsInterval = setCaptionsInterval();
    setError("");
    try {
      // Logic is needed to find the crypto currency with the highest amount of accounts created
      // and using that index to create the same amount of addresses via hd wallets
      let highestIndex = 0;
      const unusedEthIndex = await findNextUnusedEthWalletIndex(
        phraseTextValue
      );
      const unusedSolIndex = await findNextUnusedSolWalletIndex(
        phraseTextValue
      );
      highestIndex = Math.max(unusedEthIndex, unusedSolIndex);
      const importedEthWallets = await importAllActiveEthAddresses(
        phraseTextValue
      );

      const importedSolWallets = await importAllActiveSolAddresses(
        phraseTextValue,
        highestIndex
      );

      const transformedActiveEthAddresses: AddressState[] =
        importedEthWallets.map((info, index) => {
          return {
            accountName: `Account ${index + 1}`,
            derivationPath: info.derivationPath,
            address: info.address,
            publicKey: info.publicKey,
            balance: 0,
          };
        });

      const transformedActiveSolAddresses: AddressState[] =
        importedSolWallets.map((info, index) => {
          return {
            accountName: `Account ${index + 1}`,
            derivationPath: info.derivationPath,
            address: info.publicKey,
            publicKey: info.publicKey,
            balance: 0,
          };
        });

      const firstEthWallet = transformedActiveEthAddresses[0];
      const firstSolWallet = transformedActiveSolAddresses[0];

      await savePhrase(JSON.stringify(phraseTextValue));

      dispatch(saveEthereumAccountDetails(firstEthWallet));
      dispatch(saveAllEthereumAddresses(transformedActiveEthAddresses));

      dispatch(saveSolanaAccountDetails(firstSolWallet));
      dispatch(saveAllSolanaAddresses(transformedActiveSolAddresses));

      router.push({
        pathname: ROUTES.walletCreatedSuccessfully,
        params: { successState: "IMPORTED_WALLET" },
      });
    } catch (err) {
      setError("Failed to import wallet");
      console.error("Failed to import wallet", err);
      setLoading(false);
    } finally {
      captionsInterval();
    }
  };

  return (
    <SafeAreaContainer>
      <ScrollView contentContainerStyle={{ paddingVertical: 50 }}>
        <ContentContainer>
          <TextContainer>
            <Title>Secret Recovery Phrase</Title>
            <Subtitle>
              Start the process to restore your wallet by entering your 12 or
              24-word recovery phrase below.
            </Subtitle>
          </TextContainer>
          <SeedTextInput
            autoCapitalize="none"
            multiline
            returnKeyType="done"
            value={textValue}
            readOnly={false}
            onChangeText={setTextValue}
            placeholder="Enter your seed phrase"
            placeholderTextColor={theme.colors.grey}
            blurOnSubmit
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </ContentContainer>
      </ScrollView>
      {error && (
        <ErrorTextContainer>
          <ErrorTextCenter>{error}</ErrorTextCenter>
        </ErrorTextContainer>
      )}
      <ButtonContainer>
        {captions && <CaptionFeedback>{captions}</CaptionFeedback>}
        <Button
          loading={loading}
          disabled={loading}
          color={theme.colors.white}
          backgroundColor={theme.colors.primary}
          onPress={handleVerifySeedPhrase}
          title="Verify seed phrase"
        />
      </ButtonContainer>
    </SafeAreaContainer>
  );
}
