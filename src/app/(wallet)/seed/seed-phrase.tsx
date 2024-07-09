import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { ThemeType } from "../../../styles/theme";
import CopyIcon from "../../../assets/svg/copy.svg";
import Button from "../../../components/Button/Button";
import Bubble from "../../../components/Bubble/Bubble";
import { ROUTES } from "../../../constants/routes";
import { Title, Subtitle } from "../../../components/Styles/Text.styles";
import { getPhrase } from "../../../hooks/useStorageState";

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
  padding-bottom: ${(props) => props.theme.spacing.medium};
  width: 100%;
`;

const SeedPhraseContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.medium};
  margin-left: ${(props) => props.theme.spacing.medium};
`;

export const SecondaryButtonContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  height: 60px;
  margin-top: ${(props) => props.theme.spacing.medium};
`;

export const SecondaryButtonText = styled.Text<{ theme: ThemeType }>`
  margin-left: ${(props) => props.theme.spacing.small};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

export const BlurContainer = styled(BlurView)<{ theme: ThemeType }>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.medium};
  margin-left: ${(props) => props.theme.spacing.medium};
`;

const LogoContainer = styled.View``;

export default function Page() {
  const theme = useTheme();
  const { phrase, readOnly } = useLocalSearchParams();
  const seedPhraseParams = phrase ? (phrase as string).split(" ") : [];
  const [seedPhrase, setPhrase] = useState(seedPhraseParams);
  const [buttonText, setButtonText] = useState("Copy to clipboard");

  const handleCopy = async () => {
    await Clipboard.setStringAsync(seedPhraseParams.join(" "));
    setButtonText("Copied!");
    setTimeout(() => {
      setButtonText("Copy to clipboard");
    }, 4000);
  };

  useEffect(() => {
    const fetchPhrase = async () => {
      const phraseStorage = await getPhrase();
      setPhrase(phraseStorage.split(" "));
    };
    if (readOnly) {
      fetchPhrase();
    }
  }, [readOnly]);

  return (
    <SafeAreaContainer>
      <ScrollView contentContainerStyle={{ paddingTop: 50 }}>
        <ContentContainer>
          <TextContainer>
            <Title>Secret Recovery Phrase</Title>
            <Subtitle>
              This is the only way you will be able to recover your account.
              Please store it somewhere safe!
            </Subtitle>
          </TextContainer>
          <SeedPhraseContainer>
            {seedPhrase.map((word, index) => (
              <Bubble key={index} word={word} number={index + 1} />
            ))}
          </SeedPhraseContainer>
          <SecondaryButtonContainer onPress={handleCopy}>
            <LogoContainer>
              <CopyIcon fill={theme.colors.white} />
            </LogoContainer>
            <SecondaryButtonText>{buttonText}</SecondaryButtonText>
          </SecondaryButtonContainer>
        </ContentContainer>
      </ScrollView>
      {readOnly ? null : (
        <ButtonContainer>
          <Button
            color={theme.colors.white}
            linearGradient={theme.colors.primaryLinearGradient}
            onPress={() =>
              router.push({
                pathname: ROUTES.confirmSeedPhrase,
                params: { phrase: seedPhrase },
              })
            }
            title="Ok, I saved it"
          />
        </ButtonContainer>
      )}
    </SafeAreaContainer>
  );
}
