import { useState } from "react";
import { FlatList } from "react-native";
import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { clearPersistedState } from "../../../store";
import type { RootState, AppDispatch } from "../../../store";
import type { AddressState } from "../../../store/walletSlice";
import { clearStorage } from "../../../hooks/use-storage-state";
import { savePhrase } from "../../../hooks/use-storage-state";
import { createEthWalletByIndex } from "../../../utils/etherHelpers";
import { createSolWalletByIndex } from "../../../utils/solanaHelpers";
import { ROUTES } from "../../../constants/routes";
import { ThemeType } from "../../../styles/theme";
import ClearIcon from "../../../assets/svg/clear.svg";
import CloseIcon from "../../../assets/svg/close.svg";
import RightArrowIcon from "../../../assets/svg/right-arrow.svg";
import PhraseIcon from "../../../assets/svg/phrase.svg";
import { SafeAreaContainer } from "../../../components/Styles/Layout.styles";
import Button from "../../../components/Button/Button";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.medium};
`;

const WalletContainer = styled.View<{ theme: ThemeType; isLast: boolean }>`
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.lightDark};
  padding: ${({ theme }) => theme.spacing.medium};
  border-bottom-left-radius: ${({ theme, isLast }) =>
    isLast ? theme.borderRadius.large : "0px"};
  border-bottom-right-radius: ${({ theme, isLast }) =>
    isLast ? theme.borderRadius.large : "0px"};
  border: 1px solid ${({ theme }) => theme.colors.dark};
`;

const WalletPhraseContainer = styled.TouchableOpacity<{ theme: ThemeType }>`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.primary};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: ${({ theme }) => theme.spacing.medium};
`;

const SectionTitle = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.fonts.colors.primary};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  margin-left: ${({ theme }) => theme.spacing.medium};
  text-align: left;
`;

const AccountTitle = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.fonts.colors.primary};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  margin-left: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.tiny};
  text-align: left;
`;

const PriceText = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.colors.lightGrey};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  margin-left: ${({ theme }) => theme.spacing.medium};
  text-align: left;
`;

const PhraseTextContent = styled.View`
  display: flex;
  flex-direction: row;
`;

interface WalletPairs {
  id: string;
  accountName: string;
  walletDetails: {
    ethereum: AddressState | {};
    solana: AddressState | {};
  };
}

interface WalletPairsFlatList {
  item: WalletPairs;
}

function compileInactiveAddresses(
  ethAcc: AddressState[],
  solAcc: AddressState[]
) {
  const mergedWalletPairs: WalletPairs[] = [];
  const highestAccAmount = Math.max(ethAcc.length, solAcc.length);

  for (let i = 0; i < highestAccAmount; i++) {
    mergedWalletPairs.push({
      id: `${i}-${ethAcc[i].address}`,
      accountName: ethAcc[i]?.accountName || solAcc[i].accountName,
      walletDetails: {
        ethereum: ethAcc[i] ?? {},
        solana: solAcc[i] ?? {},
      },
    });
  }

  return mergedWalletPairs;
}

const AccountsIndex = () => {
  const ethAccounts = useSelector(
    (state: RootState) => state.wallet.ethereum.inactiveAddresses
  );
  const solAccounts = useSelector(
    (state: RootState) => state.wallet.solana.inactiveAddresses
  );

  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [accounts] = useState(
    compileInactiveAddresses(ethAccounts, solAccounts)
  );

  const walletSetup = async () => {
    setLoading(true);
  };

  const renderItem = ({ item, index }) => {
    return (
      <WalletContainer isLast={index === accounts.length - 1}>
        <AccountTitle>{item.accountName}</AccountTitle>
        <PriceText>$0.00</PriceText>
      </WalletContainer>
    );
  };

  return (
    <>
      <SafeAreaContainer>
        <ContentContainer>
          <FlatList
            ListHeaderComponent={
              <WalletPhraseContainer
                onPress={() =>
                  router.push({
                    pathname: ROUTES.seedPhrase,
                    params: { readOnly: "true" },
                  })
                }
              >
                <PhraseTextContent>
                  <PhraseIcon
                    width={25}
                    height={25}
                    fill={theme.colors.white}
                  />
                  <SectionTitle>Secret Recovery Phrase</SectionTitle>
                </PhraseTextContent>
                <RightArrowIcon
                  width={25}
                  height={25}
                  fill={theme.colors.white}
                />
              </WalletPhraseContainer>
            }
            data={accounts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          <Button
            loading={loading}
            onPress={walletSetup}
            title="Create Wallet"
            backgroundColor={theme.colors.primary}
          />
        </ContentContainer>
      </SafeAreaContainer>
    </>
  );
};

export default AccountsIndex;
