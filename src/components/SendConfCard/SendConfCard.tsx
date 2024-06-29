import React from "react";
import styled from "styled-components/native";
import { ThemeType } from "../../styles/theme";

interface ButtonContainerProps {
  backgroundColor?: string;
  theme: ThemeType;
}

const SendConfCardContainer = styled.View<ButtonContainerProps>`
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

interface SendConfCardProps {
  toAddress: string;
  network: string;
  networkFee: string;
}

const SendConfCard: React.FC<SendConfCardProps> = ({
  toAddress,
  network,
  networkFee = "0.00",
}) => {
  return (
    <SendConfCardContainer>
      <TokenSectionViewTop>
        <TokenNameLabel>Address</TokenNameLabel>
        <TokenNameText>{toAddress}</TokenNameText>
      </TokenSectionViewTop>
      <TokenSectionViewMid>
        <TokenNameLabel>Network</TokenNameLabel>
        <TokenNameText>{network}</TokenNameText>
      </TokenSectionViewMid>
      <TokenSectionViewBot>
        <TokenNameLabel>Network Fee</TokenNameLabel>
        <TokenNameText>{networkFee}</TokenNameText>
      </TokenSectionViewBot>
    </SendConfCardContainer>
  );
};

export default SendConfCard;
