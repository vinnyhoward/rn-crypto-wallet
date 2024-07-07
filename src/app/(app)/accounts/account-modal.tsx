import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { ROUTES } from "../../../constants/routes";
import type { ThemeType } from "../../../styles/theme";
import type { RootState } from "../../../store";
import type { AddressState } from "../../../store/types";
import EditIcon from "../../../assets/svg/edit.svg";
import SolanaIcon from "../../../assets/svg/solana.svg";
import EthereumPlainIcon from "../../../assets/svg/ethereum_plain.svg";
import CopyIcon from "../../../assets/svg/copy.svg";
import { SafeAreaContainer } from "../../../components/Styles/Layout.styles";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.medium};
`;
const SectionTitle = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.fonts.colors.primary};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  margin-bottom: ${(props) => props.theme.spacing.large};
  margin-top: ${(props) => props.theme.spacing.medium};
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
  margin-left: ${(props) => props.theme.spacing.small};
`;

const SectionCaption = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.colors.lightGrey};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  margin-left: ${(props) => props.theme.spacing.medium};
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const IconContainer = styled.View<{ theme: ThemeType }>`
  margin-left: ${(props) => props.theme.spacing.medium};
`;

const Row = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Col = styled.View`
  display: flex;
  flex-direction: column;
`;

const IconOnPressView = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
`;

const AccountsModalIndex = () => {
  const theme = useTheme();
  const { ethAddress, solAddress, balance } = useLocalSearchParams();
  const ethereumAccount = useSelector((state: RootState) =>
    state.ethereum.addresses.find(
      (item: AddressState) => item.address === ethAddress
    )
  );
  const solanaAccount = useSelector((state: RootState) =>
    state.solana.addresses.find(
      (item: AddressState) => item.address === solAddress
    )
  );

  const handleCopy = async (path: string) => {
    await Clipboard.setStringAsync(path);
    Toast.show({
      type: "success",
      text1: `Copied!`,
    });
  };

  return (
    <>
      <SafeAreaContainer>
        <ContentContainer>
          <SectionTitle>Settings</SectionTitle>
          <AccountSettingsContainer>
            <AccountSection isTop>
              <Row>
                <Col>
                  <SectionCaption>Account Name</SectionCaption>
                  <AccountDetailsText>
                    {ethereumAccount.accountName}
                  </AccountDetailsText>
                </Col>
                <IconOnPressView
                  onPress={() =>
                    router.push({
                      pathname: ROUTES.accountNameModal,
                      params: {
                        ethAddress: ethereumAccount.address,
                        solAddress: solanaAccount.address,
                      },
                    })
                  }
                >
                  <EditIcon width={25} height={25} fill={theme.colors.white} />
                </IconOnPressView>
              </Row>
            </AccountSection>
            <AccountSection isBottom>
              <SectionCaption>Total Balance</SectionCaption>
              <AccountDetailsText>{balance}</AccountDetailsText>
            </AccountSection>
          </AccountSettingsContainer>

          <SectionTitle>Advanced Settings</SectionTitle>
          <AccountSettingsContainer>
            <CryptoSection isTop>
              <IconContainer>
                <EthereumPlainIcon width={25} height={25} />
              </IconContainer>
              <CryptoName>Ethereum</CryptoName>
            </CryptoSection>
            <AccountSection isBottom>
              <Row>
                <Col>
                  <SectionCaption>Derivation Path</SectionCaption>
                  <AccountDetailsText>
                    {ethereumAccount.derivationPath}
                  </AccountDetailsText>
                </Col>
                <IconOnPressView
                  onPress={() => handleCopy(ethereumAccount.derivationPath)}
                >
                  <CopyIcon width={25} height={25} fill={theme.colors.white} />
                </IconOnPressView>
              </Row>
            </AccountSection>
          </AccountSettingsContainer>
          <AccountSettingsContainer>
            <CryptoSection isTop>
              <IconContainer>
                <SolanaIcon width={25} height={25} />
              </IconContainer>
              <CryptoName>Solana</CryptoName>
            </CryptoSection>
            <AccountSection isBottom>
              <Row>
                <Col>
                  <SectionCaption>Derivation Path</SectionCaption>
                  <AccountDetailsText>
                    {solanaAccount.derivationPath}
                  </AccountDetailsText>
                </Col>
                <IconOnPressView
                  onPress={() => handleCopy(solanaAccount.derivationPath)}
                >
                  <CopyIcon width={25} height={25} fill={theme.colors.white} />
                </IconOnPressView>
              </Row>
            </AccountSection>
          </AccountSettingsContainer>
        </ContentContainer>
      </SafeAreaContainer>
    </>
  );
};

export default AccountsModalIndex;
