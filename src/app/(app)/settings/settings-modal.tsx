import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { clearPersistedState } from "../../../store";
import { clearStorage } from "../../../hooks/useStorageState";
import { ROUTES } from "../../../constants/routes";
import { ThemeType } from "../../../styles/theme";
import ClearIcon from "../../../assets/svg/clear.svg";
import CloseIcon from "../../../assets/svg/close.svg";
import { SafeAreaContainer } from "../../../components/Styles/Layout.styles";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.medium};
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  align-items: center;
  padding: ${(props) => props.theme.spacing.large};
  background-color: ${(props) => props.theme.colors.lightDark};
  border-radius: ${(props) => props.theme.spacing.medium};
`;

const TextTouchContainer = styled.TouchableHighlight``;

const Text = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.fonts.colors.primary};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
`;

const IconContainer = styled.View<{ theme: ThemeType }>`
  background-color: ${(props) => props.theme.colors.lightDark};
  border-radius: ${(props) => props.theme.spacing.medium};
  margin-right: ${(props) => props.theme.spacing.medium};
`;

const SectionTitle = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.fonts.colors.primary};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.title};
  margin-bottom: ${(props) => props.theme.spacing.large};
  margin-left: ${(props) => props.theme.spacing.medium};
`;

const TopBar = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.lightDark};
`;

const IconTouch = styled.TouchableHighlight`
  padding: 20px;
`;

const SettingsIndex = () => {
  const theme = useTheme();
  // TODO: This is for quickly resetting the wallet state
  // This is not a real production wallet and should be removed if ever in production
  // It is here for easy development and testing for myself lol
  const clearWallets = () => {
    clearPersistedState();
    clearStorage();
    router.replace(ROUTES.walletSetup);
  };
  return (
    <>
      <TopBar>
        <IconTouch onPress={() => router.back()}>
          <CloseIcon width={25} height={25} fill={theme.colors.white} />
        </IconTouch>
      </TopBar>
      <SafeAreaContainer>
        <ContentContainer>
          <SectionTitle>Settings</SectionTitle>
          <TextTouchContainer onPress={clearWallets}>
            <TextContainer>
              <IconContainer>
                <ClearIcon width={25} height={25} fill={theme.colors.primary} />
              </IconContainer>
              <Text>Clear Wallets</Text>
            </TextContainer>
          </TextTouchContainer>
        </ContentContainer>
      </SafeAreaContainer>
    </>
  );
};

export default SettingsIndex;
