import { FC } from "react";
import * as WebBrowser from "expo-web-browser";
import styled from "styled-components/native";
import type { ThemeType } from "../../styles/theme";

export const InfoContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  background-color: rgba(136, 120, 244, 0.3);
  border: 2px solid rgba(136, 120, 244, 0.6);
  border-radius: ${(props) => props.theme.borderRadius.large};
  padding: ${(props) => props.theme.spacing.large};
`;

export const InfoTitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.colors.white};
  margin-bottom: 5px;
`;

export const InfoText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  color: ${(props) => props.theme.colors.white};
`;

export const TextContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const HighlightText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  color: ${(props) => props.theme.colors.primary};
`;

const ethFaucet = "https://www.infura.io/faucet/sepolia";
const solFaucet = "https://faucet.solana.com/";
const InfoBanner: FC<{}> = () => {
  const handlePressButtonAsync = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };
  return (
    <InfoContainer>
      <TextContainer>
        <InfoTitle>No activity yet</InfoTitle>
        <InfoText>
          Don't have any assets yet?{" "}
          <HighlightText onPress={() => handlePressButtonAsync(ethFaucet)}>
            Click here
          </HighlightText>{" "}
          for some free testnet Ethereum or{" "}
          <HighlightText onPress={() => handlePressButtonAsync(solFaucet)}>
            Click here
          </HighlightText>{" "}
          for free devnet Solana
        </InfoText>
      </TextContainer>
    </InfoContainer>
  );
};

export default InfoBanner;
