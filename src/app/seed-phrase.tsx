import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import styled from "styled-components/native";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "styled-components";
import { ThemeType } from "../styles/theme";
import Button from "../components/Button/Button";
import Copy from "../assets/svg/copy.svg";

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

const Title = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: 28px;
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.medium};
  text-align: center;
`;

const Subtitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.fonts.colors.primary};
  text-align: center;
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

const LogoContainer = styled.View``;

const mockSeedPhrase =
  "client prize meat select during awkward idle install road situate have answer";

export default function Page() {
  const theme = useTheme();
  const seedPhrase = mockSeedPhrase.split(" ");
  const [buttonText, setButtonText] = useState("Copy to clipboard");

  const handleCopy = async () => {
    await Clipboard.setStringAsync(mockSeedPhrase);
    setButtonText("Copied!");
    setTimeout(() => {
      setButtonText("Copy to clipboard");
    }, 4000);
  };

  return (
    <SafeAreaContainer>
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
            <Copy fill={theme.colors.white} />
          </LogoContainer>
          <SecondaryButtonText>{buttonText}</SecondaryButtonText>
        </SecondaryButtonContainer>
      </ContentContainer>

      <ButtonContainer>
        <Button
          color={theme.colors.white}
          backgroundColor={theme.colors.primary}
          onPress={() => console.log("proud")}
          title="Ok, I saved it"
        />
      </ButtonContainer>
    </SafeAreaContainer>
  );
}

const BubbleContainer = styled.View<{ theme: ThemeType }>`
  background-color: ${(props) => props.theme.colors.dark};
  padding: ${(props) => props.theme.spacing.small};
  border-radius: ${(props) => props.theme.borderRadius.extraLarge};
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.grey};
  margin: 5px;
  height: 55px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 45%;
`;

const BubbleText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

const Line = styled.Text`
  background-color: ${({ theme }) => theme.colors.white};
`;

const Bubble = ({ word, number }: { word: string; number: number }) => {
  const num = number.toString();
  return (
    <BubbleContainer>
      <BubbleText>{num}</BubbleText>
      <Line></Line>
      <BubbleText>{word}</BubbleText>
    </BubbleContainer>
  );
};
