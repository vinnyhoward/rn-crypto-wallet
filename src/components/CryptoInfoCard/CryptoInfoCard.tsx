import styled from "styled-components/native";
import { ThemeType } from "../../styles/theme";
import React from "react";

interface ButtonTextProps {
  color?: string;
  theme: ThemeType;
  disabled?: boolean;
}

interface ButtonContainerProps {
  backgroundColor?: string;
  theme: ThemeType;
}

interface CircleProps {
  iconBackgroundColor?: string;
  theme: ThemeType;
}

const CryptoInfoCardContainer = styled.TouchableOpacity<ButtonContainerProps>`
  flex-direction: row;
  /* align-items: center; */
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.lightDark};
  border-radius: ${(props) => props.theme.borderRadius.large};
  height: 65px;
  padding: ${(props) => props.theme.spacing.medium};
  padding-left: 15px;
  width: 100%;
`;

const CryptoInfoCardText = styled.Text<ButtonTextProps>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${({ theme }) => theme.colors.white};
`;

const PrimaryTextContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: column;
`;

const Circle = styled.View<CircleProps>`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  margin-right: 5px;
`;

const ChainContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CryptoBalanceText = styled.Text<ButtonTextProps>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  color: ${({ theme }) => theme.colors.lightGrey};
`;

interface ButtonProps {
  onPress: () => void;
  btnText: string;
  disabled?: boolean;
  color?: string;
  backgroundColor?: string;
  icon: React.ReactNode;
  iconBackgroundColor?: string;
  cryptoBalanceAmount: string;
  usdCryptoPrice: string;
}

const CryptoInfoCard: React.FC<ButtonProps> = ({
  onPress,
  btnText,
  backgroundColor,
  disabled = false,
  icon,
  iconBackgroundColor,
  cryptoBalanceAmount,
  usdCryptoPrice,
}) => {
  return (
    <CryptoInfoCardContainer
      disabled={disabled}
      backgroundColor={backgroundColor}
      onPress={disabled ? null : onPress}
    >
      <ChainContainer>
        <Circle iconBackgroundColor={iconBackgroundColor}>{icon}</Circle>
        <PrimaryTextContainer>
          <CryptoInfoCardText>{btnText}</CryptoInfoCardText>
          <CryptoBalanceText>{cryptoBalanceAmount}</CryptoBalanceText>
        </PrimaryTextContainer>
      </ChainContainer>
      <PrimaryTextContainer>
        <CryptoInfoCardText>{usdCryptoPrice}</CryptoInfoCardText>
      </PrimaryTextContainer>
    </CryptoInfoCardContainer>
  );
};

export default CryptoInfoCard;
