import React, { useState } from "react";
import { Dimensions, Keyboard, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import ethService from "../../../services/EthereumService";
import solanaService from "../../../services/SolanaService";
import { ThemeType } from "../../../styles/theme";
import {
  saveSolanaAddresses,
  fetchSolanaBalance,
  fetchSolanaTransactions,
} from "../../../store/solanaSlice";
import {
  saveEthereumAddresses,
  fetchEthereumBalance,
  fetchEthereumTransactions,
} from "../../../store/ethereumSlice";
import { GeneralStatus } from "../../../store/types";
import type { AddressState } from "../../../store/types";
import type { AppDispatch } from "../../../store";
import Button from "../../../components/Button/Button";
import { ROUTES } from "../../../constants/routes";
import { savePhrase } from "../../../hooks/useStorageState";
import { Title, Subtitle } from "../../../components/Styles/Text.styles";
import {
  ErrorTextCenter,
  ErrorTextContainer,
} from "../../../components/Styles/Errors.styles";

interface SeedTextInputProps {
  theme: ThemeType;
  isInputFocused: boolean;
}

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

const SeedTextInput = styled.TextInput<SeedTextInputProps>`
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.large};
  margin: ${(props) => props.theme.spacing.large};
  background-color: ${(props) => props.theme.colors.dark};
  border-radius: ${(props) => props.theme.borderRadius.extraLarge};
  width: ${(Dimensions.get("window").width - 80).toFixed(0)}px;
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.fonts.sizes.large};\
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  border: 1px solid
    ${({ theme, isInputFocused }) =>
      isInputFocused ? theme.colors.primary : theme.colors.grey};
`;

const InfoContainer = styled.View<{ theme: ThemeType }>`
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: rgba(136, 120, 244, 0.3);
  border: 2px solid rgba(136, 120, 244, 0.6);
  border-radius: ${(props) => props.theme.borderRadius.large};
  padding: ${(props) => props.theme.spacing.large};
  margin-bottom: ${(props) => props.theme.spacing.large};
`;

const InfoTitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.colors.white};
  margin-bottom: 5px;
`;

const InfoText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  color: ${(props) => props.theme.colors.white};
`;

const captionsArr: string[] = [
  "We're fetching your wallet details...",
  "Importing wallet securely...",
  "Syncing with the blockchain...",
];

const titleArr: string[] = [
  "Hang tight!",
  "This might take a minute.",
  "Almost there!",
];

export default function Page() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [textValue, setTextValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [captions, setCaptions] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isInputFocused, setInputFocused] = useState(false);

  const setCaptionsInterval = () => {
    setTitle(titleArr[0]);
    setCaptions(captionsArr[0]);
    let interval: NodeJS.Timeout = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * captionsArr.length);
      setTitle(titleArr[randomIndex]);
      setCaptions(captionsArr[randomIndex]);
    }, 8000);
    return () => {
      clearInterval(interval);
      setTitle("");
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
      const unusedEthIndex = await ethService.findNextUnusedWalletIndex(
        phraseTextValue
      );

      const unusedSolIndex = await solanaService.findNextUnusedWalletIndex(
        phraseTextValue
      );

      highestIndex = Math.max(unusedEthIndex, unusedSolIndex);
      const importedEthWallets = await ethService.importAllActiveAddresses(
        phraseTextValue
      );

      const importedSolWallets = await solanaService.importAllActiveAddresses(
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
            transactionMetadata: {
              paginationKey: undefined,
              transactions: [],
            },
            failedNetworkRequest: false,
            status: GeneralStatus.Idle,
            transactionConfirmations: [],
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
            transactionMetadata: {
              paginationKey: undefined,
              transactions: [],
            },
            failedNetworkRequest: false,
            status: GeneralStatus.Idle,
            transactionConfirmations: [],
          };
        });
      await savePhrase(JSON.stringify(phraseTextValue));

      dispatch(saveEthereumAddresses(transformedActiveEthAddresses));
      dispatch(fetchEthereumBalance(transformedActiveEthAddresses[0].address));
      dispatch(
        fetchEthereumTransactions({
          address: transformedActiveEthAddresses[0].address,
        })
      );

      dispatch(saveSolanaAddresses(transformedActiveSolAddresses));
      dispatch(fetchSolanaBalance(transformedActiveSolAddresses[0].address));
      dispatch(
        fetchSolanaTransactions(transformedActiveSolAddresses[0].address)
      );

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
            isInputFocused={isInputFocused}
            autoCapitalize="none"
            multiline
            returnKeyType="done"
            value={textValue}
            readOnly={false}
            onChangeText={setTextValue}
            placeholder="Enter your seed phrase"
            placeholderTextColor={theme.colors.grey}
            onFocus={() => setInputFocused(true)}
            onEndEditing={() => setInputFocused(false)}
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
        {title !== "" && captions !== "" && (
          <InfoContainer>
            <InfoTitle>{title}</InfoTitle>
            <InfoText>{captions}</InfoText>
          </InfoContainer>
        )}
        <Button
          linearGradient={theme.colors.primaryLinearGradient}
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
