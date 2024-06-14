import styled from "styled-components/native";
import type { ThemeType } from "../../styles/theme";

export const ErrorContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: rgba(255, 0, 0, 0.3);
  border: 2px solid rgba(255, 0, 0, 0.4);
  border-radius: ${(props) => props.theme.borderRadius.large};
  height: 85px;
  padding: ${(props) => props.theme.spacing.medium};
`;

export const ErrorText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  color: ${(props) => props.theme.colors.error};
`;

export const ErrorTextContainer = styled.View<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.medium};
`;

export const ErrorTextCenter = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.colors.error};
  text-align: center;
`;
