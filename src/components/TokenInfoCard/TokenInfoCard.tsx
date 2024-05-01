import React, { useState } from "react";
import styled from "styled-components/native";
import { ThemeType } from "../../styles/theme";
import { formatDollar } from "../../utils/formatDollars";

interface ButtonContainerProps {
  backgroundColor?: string;
  theme: ThemeType;
}

const TokenInfoCardContainer = styled.View<ButtonContainerProps>`
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const TokenSectionViewTop = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;

  background-color: ${({ theme }) => theme.colors.lightDark};
  border: 1px solid ${({ theme }) => theme.colors.dark};
  border-top-left-radius: ${(props) => props.theme.borderRadius.large};
  border-top-right-radius: ${(props) => props.theme.borderRadius.large};
`;

const TokenSectionViewMid = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  background-color: ${({ theme }) => theme.colors.lightDark};

  border: 1px solid ${({ theme }) => theme.colors.dark};
`;

const TokenSectionViewBot = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;

  background-color: ${({ theme }) => theme.colors.lightDark};
  border: 1px solid ${({ theme }) => theme.colors.dark};
  border-bottom-left-radius: ${(props) => props.theme.borderRadius.large};
  border-bottom-right-radius: ${(props) => props.theme.borderRadius.large};
`;

const TokenNameLabel = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${({ theme }) => theme.colors.lightGrey};
`;

const TokenNameText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${({ theme }) => theme.colors.white};
`;

function findTokenPrice(tokenSymbol: string) {
  const ethPriceMock = 3006.94;
  const solPriceMock = 127.22;

  if (tokenSymbol === "ETH") {
    return ethPriceMock;
  } else if (tokenSymbol === "SOL") {
    return solPriceMock;
  } else {
    return 0;
  }
}

interface TokenInfoCardProps {
  tokenName: string;
  tokenSymbol: string;
  network: string;
}

const TokenInfoCard: React.FC<TokenInfoCardProps> = ({
  tokenName,
  tokenSymbol,
  network,
}) => {
  // TODO: Find cheap api to find real prices of tokens
  const [currentTokenPrice, setCurrentTokenPrice] = useState<number>(
    findTokenPrice(tokenSymbol)
  );

  return (
    <TokenInfoCardContainer>
      <TokenSectionViewTop>
        <TokenNameLabel>Token Name</TokenNameLabel>
        <TokenNameText>
          {tokenName} ({tokenSymbol})
        </TokenNameText>
      </TokenSectionViewTop>
      <TokenSectionViewMid>
        <TokenNameLabel>Network</TokenNameLabel>
        <TokenNameText>{network}</TokenNameText>
      </TokenSectionViewMid>
      <TokenSectionViewBot>
        <TokenNameLabel>Price</TokenNameLabel>
        <TokenNameText>{formatDollar(currentTokenPrice)}</TokenNameText>
      </TokenSectionViewBot>
    </TokenInfoCardContainer>
  );
};

export default TokenInfoCard;
