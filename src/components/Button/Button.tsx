import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeType } from "../../styles/theme";
import PulseDotLoader from "../Loader/DotLoader";

interface ButtonTextProps {
  color?: string;
  theme: ThemeType;
  disabled?: boolean;
}

interface ButtonContainerProps {
  backgroundColor?: string;
  theme: ThemeType;
}

export const LinearGradientBackground = styled(LinearGradient)`
  padding: 10px 20px;
  border-radius: 5px;
  align-items: center;
  height: 60px;
  justify-content: center;
  width: 100%;
  border-radius: ${(props) => props.theme.borderRadius.large};
`;

const ButtonContainer = styled.TouchableOpacity<ButtonContainerProps>`
  background-color: ${({ theme, backgroundColor }) =>
    backgroundColor ? backgroundColor : theme.colors.dark};
  /* padding: 10px 20px; */
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

const Row = styled.View<{ theme: ThemeType }>`
  display: flex;
  flex-direction: row;
`;

const IconContainer = styled.View<{ theme: ThemeType }>`
  margin-right: ${(props) => props.theme.spacing.small};
`;

interface ButtonProps {
  icon?: React.ReactNode;
  onPress: () => void;
  title: string;
  disabled?: boolean;
  color?: string;
  backgroundColor?: string;
  loading?: boolean;
  linearGradient?: string[];
}

const Button: React.FC<ButtonProps> = ({
  icon,
  onPress,
  title,
  color,
  backgroundColor,
  disabled = false,
  loading = false,
  linearGradient,
}) => {
  if (linearGradient) {
    return (
      <ButtonContainer
        disabled={disabled}
        backgroundColor={backgroundColor}
        onPress={disabled ? null : onPress}
      >
        <LinearGradientBackground
          start={{ x: 0.5, y: 0.2 }}
          colors={linearGradient}
        >
          {!loading ? (
            <Row>
              {icon && <IconContainer>{icon}</IconContainer>}
              <ButtonText color={color}>{title}</ButtonText>
            </Row>
          ) : (
            <PulseDotLoader size={50} color="#fff" />
          )}
        </LinearGradientBackground>
      </ButtonContainer>
    );
  }
  return (
    <ButtonContainer
      disabled={disabled}
      backgroundColor={backgroundColor}
      onPress={disabled ? null : onPress}
    >
      {!loading ? (
        <Row>
          {icon && <IconContainer>{icon}</IconContainer>}
          <ButtonText color={color}>{title}</ButtonText>
        </Row>
      ) : (
        <PulseDotLoader size={50} color="#fff" />
      )}
    </ButtonContainer>
  );
};

export default Button;
