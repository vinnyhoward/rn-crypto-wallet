import { useEffect, useState } from "react";
import { Dimensions, Keyboard } from "react-native";
import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { useSelector, useDispatch } from "react-redux";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ROUTES } from "../../../constants/routes";
import type { ThemeType } from "../../../styles/theme";
import type { RootState } from "../../../store";
import type { AddressState } from "../../../store/walletSlice";
import ClearIcon from "../../../assets/svg/clear.svg";
import CloseIcon from "../../../assets/svg/close.svg";
import SolanaIcon from "../../../assets/svg/solana.svg";
import EthereumPlainIcon from "../../../assets/svg/ethereum_plain.svg";
import { SafeAreaContainer } from "../../../components/Styles/Layout.styles";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.medium};
`;
const SectionTitle = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.fonts.colors.primary};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  margin-bottom: ${(props) => props.theme.spacing.large};
  margin-left: ${(props) => props.theme.spacing.medium};
`;

const AccountDetailsText = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.fonts.colors.primary};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  margin-left: ${(props) => props.theme.spacing.medium};
`;

const AccountSettingsContainer = styled.View<{ theme: ThemeType }>`
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const AccountSection = styled.View<{
  theme: ThemeType;
  isBottom?: boolean;
  isTop?: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.lightDark};
  padding: ${(props) => props.theme.spacing.medium};
  border-bottom-left-radius: ${({ theme, isBottom }) =>
    isBottom ? theme.borderRadius.large : "0px"};
  border-bottom-right-radius: ${({ theme, isBottom }) =>
    isBottom ? theme.borderRadius.large : "0px"};
  border-top-left-radius: ${({ theme, isTop }) =>
    isTop ? theme.borderRadius.large : "0px"};
  border-top-right-radius: ${({ theme, isTop }) =>
    isTop ? theme.borderRadius.large : "0px"};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-left: ${(props) => props.theme.spacing.large};
  border: 1px solid ${(props) => props.theme.colors.dark};
`;

const CryptoSection = styled.View<{
  theme: ThemeType;
  isBottom?: boolean;
  isTop?: boolean;
}>`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.lightDark};
  padding: ${(props) => props.theme.spacing.medium};
  border-bottom-left-radius: ${({ theme, isBottom }) =>
    isBottom ? theme.borderRadius.large : "0px"};
  border-bottom-right-radius: ${({ theme, isBottom }) =>
    isBottom ? theme.borderRadius.large : "0px"};
  border-top-left-radius: ${({ theme, isTop }) =>
    isTop ? theme.borderRadius.large : "0px"};
  border-top-right-radius: ${({ theme, isTop }) =>
    isTop ? theme.borderRadius.large : "0px"};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-left: ${(props) => props.theme.spacing.large};
  border: 1px solid ${(props) => props.theme.colors.dark};
`;

const CryptoName = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  margin-left: ${(props) => props.theme.spacing.medium};
`;

const SectionCaption = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.colors.lightGrey};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  margin-left: ${(props) => props.theme.spacing.medium};
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const AccountInput = styled.TextInput<{ theme: ThemeType }>`
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.medium};
  padding-left: ${(props) => props.theme.spacing.large};
  /* margin: ${(props) => props.theme.spacing.large}; */
  background-color: ${(props) => props.theme.colors.dark};
  border-radius: ${(props) => props.theme.borderRadius.extraLarge};
  width: ${(Dimensions.get("window").width - 80).toFixed(0)}px;
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  /* border: 1px solid ${(props) => props.theme.colors.lightGrey}; */
`;

const SettingsIndex = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { ethAddress, solAddress, balance } = useLocalSearchParams();
  const ethereumAccount = useSelector((state: RootState) =>
    state.wallet.ethereum.inactiveAddresses.find(
      (item) => item.address === ethAddress
    )
  );
  const solanaAccount = useSelector((state: RootState) =>
    state.wallet.solana.inactiveAddresses.find(
      (item) => item.address === solAddress
    )
  );
  const [newAccountName, setNewAccountName] = useState(
    ethereumAccount.accountName
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: ethereumAccount.accountName,
    });
  }, []);

  return (
    <>
      <SafeAreaContainer>
        <ContentContainer>
          <SectionTitle>Settings</SectionTitle>
          <AccountSettingsContainer>
            <AccountSection isTop>
              <SectionCaption>Account Name</SectionCaption>
              <AccountInput
                autoCapitalize="none"
                multiline
                returnKeyType="done"
                value={newAccountName}
                readOnly={false}
                onChangeText={setNewAccountName}
                placeholder="Enter your seed phrase"
                placeholderTextColor={theme.colors.grey}
                blurOnSubmit
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </AccountSection>
            <AccountSection isBottom>
              <SectionCaption>Balance</SectionCaption>
              <AccountDetailsText>{balance}</AccountDetailsText>
            </AccountSection>
          </AccountSettingsContainer>

          <SectionTitle>Advanced Settings</SectionTitle>
          <AccountSettingsContainer>
            <CryptoSection isTop>
              <EthereumPlainIcon width={25} height={25} fill="#14F195" />
              <CryptoName>Ethereum</CryptoName>
            </CryptoSection>
            <AccountSection isBottom>
              <SectionCaption>Derivation Path</SectionCaption>
              <AccountDetailsText>
                {ethereumAccount.derivationPath}
              </AccountDetailsText>
            </AccountSection>
          </AccountSettingsContainer>
          <AccountSettingsContainer>
            <CryptoSection isTop>
              <SolanaIcon width={25} height={25} fill="#14F195" />
              <CryptoName>Solana</CryptoName>
            </CryptoSection>
            <AccountSection isBottom>
              <SectionCaption>Derivation Path</SectionCaption>
              <AccountDetailsText>
                {solanaAccount.derivationPath}
              </AccountDetailsText>
            </AccountSection>
          </AccountSettingsContainer>
        </ContentContainer>
      </SafeAreaContainer>
    </>
  );
};

export default SettingsIndex;
