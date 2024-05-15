import { useState } from "react";
import { SafeAreaView } from "react-native";
import { Image } from "expo-image";
import styled from "styled-components/native";
import { ThemeType } from "../../../../styles/theme";

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

export default function Confirmation() {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <ImageContainer></ImageContainer>

        <TextContainer>
          <Title></Title>
          <Subtitle></Subtitle>
        </TextContainer>
      </ContentContainer>
      <ButtonContainer></ButtonContainer>
    </SafeAreaContainer>
  );
}
