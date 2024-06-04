import React, { useState, useEffect } from "react";
import { Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { router } from "expo-router";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { getPhrase } from "../../hooks/use-storage-state";
import { ThemeType } from "../../styles/theme";
import Button from "../../components/Button/Button";
import Bubble from "../../components/Bubble/Bubble";
import { ROUTES } from "../../constants/routes";
import { Title, Subtitle } from "../../components/Styles/Text.styles";
import {
  ErrorTextCenter,
  ErrorTextContainer,
} from "../../components/Styles/Errors.styles";

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

const SeedPhraseContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.medium};
  margin-left: ${(props) => props.theme.spacing.medium};
  height: 220px;
`;

const ConfirmSeedContainer = styled.View<{ theme: ThemeType }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: ${(props) => props.theme.spacing.small};
  margin: ${(props) => props.theme.spacing.large};
  background-color: ${(props) => props.theme.colors.dark};
  border-radius: ${(props) => props.theme.borderRadius.extraLarge};
  height: 220px;
  width: ${(Dimensions.get("window").width - 80).toFixed(0)}px;
`;

export default function Page() {
  const theme = useTheme();
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const handleSelectedWord = (word: string) => {
    if (selectedWords.length === 12) return;

    setSelectedWords([...selectedWords, word]);
    setSeedPhrase(seedPhrase.filter((w) => w !== word));
  };

  const handleRemoveSelectedWord = (word: string) => {
    setSelectedWords(selectedWords.filter((w) => w !== word));
    setSeedPhrase([...seedPhrase, word]);
  };

  const handleVerifySeedPhrase = async () => {
    if (selectedWords.length !== 12) {
      setError("Please select all the words to verify your seed phrase");
      return;
    }

    const originalSeedPhrase = await getPhrase();

    if (selectedWords.join(" ") === originalSeedPhrase) {
      router.push({
        pathname: ROUTES.walletCreatedSuccessfully,
        params: { successState: "CREATED_WALLET" },
      });
    } else {
      setError("Looks like the seed phrase is incorrect. Please try again.");
    }
  };

  useEffect(() => {
    const fetchSeedPhrase = async () => {
      const storedSeedPhrase: string = await getPhrase();
      if (!storedSeedPhrase) router.replace(ROUTES.walletSetup);
      const randomizedSeedPhrase = storedSeedPhrase
        .split(" ")
        .sort(() => 0.5 - Math.random());
      setSeedPhrase(randomizedSeedPhrase);
    };

    fetchSeedPhrase();
  }, []);

  return (
    <SafeAreaContainer>
      <ScrollView contentContainerStyle={{ paddingVertical: 50 }}>
        <ContentContainer>
          <TextContainer>
            <Title>Verify you saved it correctly</Title>
            <Subtitle>
              Tap the words in the correct numerical order to verify you saved
              your secret recovery phrase.
            </Subtitle>
          </TextContainer>
          <ConfirmSeedContainer>
            {selectedWords.map((word, index) => (
              <Bubble
                smallBubble
                hideDetails
                key={index}
                word={word}
                number={index + 1}
                onPress={() => handleRemoveSelectedWord(word)}
              />
            ))}
          </ConfirmSeedContainer>
          <SeedPhraseContainer>
            {seedPhrase.map((word, index) => (
              <Bubble
                onPress={() => handleSelectedWord(word)}
                smallBubble
                hideDetails
                key={index}
                word={word}
                number={index + 1}
              />
            ))}
          </SeedPhraseContainer>
        </ContentContainer>
      </ScrollView>
      {error && (
        <ErrorTextContainer>
          <ErrorTextCenter>{error}</ErrorTextCenter>
        </ErrorTextContainer>
      )}
      <ButtonContainer>
        <Button
          color={theme.colors.white}
          backgroundColor={theme.colors.primary}
          onPress={handleVerifySeedPhrase}
          title="Verify seed phrase"
        />
      </ButtonContainer>
    </SafeAreaContainer>
  );
}
