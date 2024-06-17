import { useState, useEffect } from "react";
import { FlatList, Dimensions } from "react-native";
import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { useSelector, useDispatch } from "react-redux";
import * as ethers from "ethers";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { formatDollar } from "../../../utils/formatDollars";
import {
  ethProvider,
  createEthWalletByIndex,
} from "../../../utils/etherHelpers";
import {
  getSolanaBalance,
  createSolWalletByIndex,
} from "../../../utils/solanaHelpers";
import { getPhrase } from "../../../hooks/use-storage-state";
import type { RootState } from "../../../store";
import type { AddressState } from "../../../store/walletSlice";
import type { ThemeType } from "../../../styles/theme";
import {
  setActiveAccount,
  updateSolanaInactiveAddresses,
  updateEthereumInactiveAddresses,
} from "../../../store/walletSlice";
import { ROUTES } from "../../../constants/routes";
import RightArrowIcon from "../../../assets/svg/right-arrow.svg";
import PhraseIcon from "../../../assets/svg/phrase.svg";
import EditIcon from "../../../assets/svg/edit.svg";
import { SafeAreaContainer } from "../../../components/Styles/Layout.styles";
import Button from "../../../components/Button/Button";
import { placeholderArr } from "../../../utils/placeholder";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.medium};
`;

const WalletContainer = styled.TouchableOpacity<{
  theme: ThemeType;
  isLast: boolean;
  isActiveAccount: boolean;
}>`
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme, isActiveAccount }) =>
    isActiveAccount ? "rgba(136, 120, 244, 0.3)" : theme.colors.lightDark};
  padding: ${({ theme }) => theme.spacing.medium};
  border-bottom-left-radius: ${({ theme, isLast }) =>
    isLast ? theme.borderRadius.large : "0px"};
  border-bottom-right-radius: ${({ theme, isLast }) =>
    isLast ? theme.borderRadius.large : "0px"};
  border: 1px solid
    ${({ theme, isActiveAccount }) =>
      isActiveAccount ? "rgba(136, 120, 244, 0.6)" : theme.colors.dark};
`;

const WalletSkeletonContainer = styled(MotiView)<{
  theme: ThemeType;
  isLast: boolean;
  isActiveAccount: boolean;
}>`
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme, isActiveAccount }) =>
    isActiveAccount ? "rgba(136, 120, 244, 0.3)" : theme.colors.lightDark};
  padding: ${({ theme }) => theme.spacing.large};
  border-bottom-left-radius: ${({ theme, isLast }) =>
    isLast ? theme.borderRadius.large : "0px"};
  border-bottom-right-radius: ${({ theme, isLast }) =>
    isLast ? theme.borderRadius.large : "0px"};
  border: 1px solid
    ${({ theme, isActiveAccount }) =>
      isActiveAccount ? "rgba(136, 120, 244, 0.6)" : theme.colors.dark};
`;

const AccountDetails = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const EditIconContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
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
  isActiveAccount: boolean;
  walletDetails: {
    ethereum: AddressState | {};
    solana: AddressState | {};
  };
}

async function compileAddressesConcurrently(
  ethAcc: AddressState[],
  solAcc: AddressState[]
) {
  const ethereumBalancePromise = ethAcc.map(async (account: AddressState) => {
    const balance = await ethProvider.getBalance(account.address);
    return {
      ...account,
      balance: parseFloat(ethers.formatEther(balance)),
    };
  });

  const solanaBalancePromise = solAcc.map(async (account: AddressState) => {
    const balance = await getSolanaBalance(account.address);
    return {
      ...account,
      balance: balance,
    };
  });

  const ethereum = await Promise.all(ethereumBalancePromise);
  const solana = await Promise.all(solanaBalancePromise);

  return {
    ethereum,
    solana,
  };
}

function compileInactiveAddresses(
  ethAcc: AddressState[],
  solAcc: AddressState[],
  activeEthAddress: string,
  activeSolAddress: string
) {
  const mergedWalletPairs: WalletPairs[] = [];
  const highestAccAmount = Math.max(ethAcc.length, solAcc.length);

  for (let i = 0; i < highestAccAmount; i++) {
    const isActiveAccount =
      ethAcc[i].address === activeEthAddress &&
      solAcc[i].address === activeSolAddress;
    mergedWalletPairs.push({
      id: `${i}-${ethAcc[i].address}`,
      accountName: ethAcc[i]?.accountName || solAcc[i].accountName,
      isActiveAccount,
      walletDetails: {
        ethereum: ethAcc[i] ?? {},
        solana: solAcc[i] ?? {},
      },
    });
  }

  return mergedWalletPairs;
}

const AccountsIndex = () => {
  const activeEthAddress = useSelector(
    (state: RootState) => state.wallet.ethereum.activeAddress.address
  );
  const activeSolAddress = useSelector(
    (state: RootState) => state.wallet.solana.activeAddress.address
  );
  const inactiveEthAccounts = useSelector(
    (state: RootState) => state.wallet.ethereum.inactiveAddresses
  );
  const inactiveSolAccounts = useSelector(
    (state: RootState) => state.wallet.solana.inactiveAddresses
  );

  const prices = useSelector((state: RootState) => state.price.data);
  const solPrice = prices?.solana?.usd;
  const ethPrice = prices?.ethereum?.usd;

  const theme = useTheme();
  const dispatch = useDispatch();
  const [walletCreationLoading, setWalletCreationLoading] = useState(false);
  const [priceAndBalanceLoading, setPriceAndBalanceLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const createNewWalletPair = async () => {
    setWalletCreationLoading(true);
    try {
      const nextEthIndex = inactiveEthAccounts.length;
      const nextSolIndex = inactiveSolAccounts.length;
      const phrase = await getPhrase();
      const newEthWallet = await createEthWalletByIndex(phrase, nextEthIndex);
      const newSolWallet = await createSolWalletByIndex(phrase, nextSolIndex);
      const transformedEthWallet: AddressState = {
        accountName: `Account ${nextEthIndex + 1}`,
        derivationPath: newEthWallet.derivationPath,
        address: newEthWallet.address,
        publicKey: newEthWallet.publicKey,
        balance: 0,
      };
      const transformedSolWallet: AddressState = {
        accountName: `Account ${nextSolIndex + 1}`,
        derivationPath: newSolWallet.derivationPath,
        address: newSolWallet.address,
        publicKey: newSolWallet.publicKey,
        balance: 0,
      };
      dispatch(updateEthereumInactiveAddresses(transformedEthWallet));
      dispatch(updateSolanaInactiveAddresses(transformedSolWallet));
    } catch (err) {
      console.error("Failed to create new wallet pair:", err);
    } finally {
      setWalletCreationLoading(false);
    }
  };

  const setNextActiveAccounts = (
    ethereum: AddressState,
    solana: AddressState
  ) => {
    const nextActiveAddress = {
      solana,
      ethereum,
    };

    dispatch(setActiveAccount(nextActiveAddress));
  };

  const calculateTotalPrice = (ethBalance: number, solBalance: number) => {
    const ethUsd = ethPrice * ethBalance;
    const solUsd = solPrice * solBalance;
    return formatDollar(ethUsd + solUsd);
  };

  const width = Dimensions.get("window").width * 0.6;
  const renderItem = ({ item, index }) => {
    if (priceAndBalanceLoading) {
      return (
        <WalletSkeletonContainer
          isActiveAccount={false}
          isLast={index === accounts.length - 1}
        >
          <Skeleton
            height={35}
            colors={[
              theme.colors.grey,
              theme.colors.dark,
              theme.colors.dark,
              theme.colors.grey,
            ]}
            width={width}
          />
          <Skeleton
            height={35}
            colors={[
              theme.colors.grey,
              theme.colors.dark,
              theme.colors.dark,
              theme.colors.grey,
            ]}
            width={50}
          />
        </WalletSkeletonContainer>
      );
    }

    const balance = calculateTotalPrice(
      item.walletDetails.ethereum.balance,
      item.walletDetails.solana.balance
    );
    return (
      <WalletContainer
        onPress={() =>
          setNextActiveAccounts(
            item.walletDetails.ethereum,
            item.walletDetails.solana
          )
        }
        isActiveAccount={item.isActiveAccount}
        isLast={index === accounts.length - 1}
      >
        <AccountDetails>
          <AccountTitle>{item.accountName}</AccountTitle>
          <PriceText>{balance}</PriceText>
        </AccountDetails>
        <EditIconContainer
          onPress={() => {
            router.push({
              pathname: ROUTES.accountModal,
              params: {
                ethAddress: item.walletDetails.ethereum.address,
                solAddress: item.walletDetails.solana.address,
                balance,
              },
            });
          }}
        >
          <EditIcon width={20} height={20} fill={theme.colors.white} />
        </EditIconContainer>
      </WalletContainer>
    );
  };

  useEffect(() => {
    const fetchBalances = async () => {
      setPriceAndBalanceLoading(true);
      try {
        const { ethereum, solana } = await compileAddressesConcurrently(
          inactiveEthAccounts,
          inactiveSolAccounts
        );
        if (ethereum && solana) {
          setAccounts(
            compileInactiveAddresses(
              ethereum,
              solana,
              activeEthAddress,
              activeSolAddress
            )
          );
        }
      } catch (err) {
        console.error("Failed fetching balance:", err);
      } finally {
        setPriceAndBalanceLoading(false);
      }
    };
    fetchBalances();
  }, [
    activeEthAddress,
    activeSolAddress,
    inactiveEthAccounts,
    inactiveSolAccounts,
  ]);

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
            data={priceAndBalanceLoading ? placeholderArr(3) : accounts}
            renderItem={renderItem}
            keyExtractor={(item) =>
              priceAndBalanceLoading ? item.uniqueId : item.id
            }
          />
          <Button
            loading={walletCreationLoading}
            onPress={createNewWalletPair}
            title="Create Wallet"
            backgroundColor={theme.colors.primary}
          />
        </ContentContainer>
      </SafeAreaContainer>
    </>
  );
};

export default AccountsIndex;
