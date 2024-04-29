import React from "react";
import styled from "styled-components/native";
import { ThemeType } from "../../styles/theme";

interface ButtonTextProps {
  color?: string;
  theme: ThemeType;
  disabled?: boolean;
}

interface ButtonContainerProps {
  backgroundColor?: string;
  theme: ThemeType;
}

const ButtonContainer = styled.TouchableOpacity<ButtonContainerProps>`
  background-color: ${({ theme, backgroundColor }) =>
    backgroundColor ? backgroundColor : theme.colors.dark};
  padding: 10px 20px;
  border-radius: 5px;
  align-items: center;
  height: 60px;
  justify-content: center;
  width: 100%;
  border-radius: ${(props) => props.theme.borderRadius.large};
`;

const ButtonText = styled.Text<ButtonTextProps>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${({ theme, color }) => (color ? color : theme.fonts.colors.primary)};
`;

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  color?: string;
  backgroundColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  color,
  backgroundColor,
  disabled = false,
}) => {
  return (
    <ButtonContainer
      disabled={disabled}
      backgroundColor={backgroundColor}
      onPress={disabled ? null : onPress}
    >
      <ButtonText color={color}>{title}</ButtonText>
    </ButtonContainer>
  );
};

export default Button;
