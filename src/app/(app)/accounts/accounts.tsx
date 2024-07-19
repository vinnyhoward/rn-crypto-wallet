import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { FlatList, Dimensions, Platform } from "react-native";
import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { useSelector, useDispatch } from "react-redux";
import * as ethers from "ethers";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { debounce } from "lodash";
import { formatDollar } from "../../../utils/formatDollars";
import ethService from "../../../services/EthereumService";
import solanaService from "../../../services/SolanaService";
import { getPhrase } from "../../../hooks/useStorageState";
import type { RootState } from "../../../store";
import type { AddressState } from "../../../store/types";
import type { ThemeType } from "../../../styles/theme";
import { GeneralStatus } from "../../../store/types";
import {
  setActiveEthereumAccount,
  updateEthereumAddresses,
} from "../../../store/ethereumSlice";
import {
  setActiveSolanaAccount,
  updateSolanaAddresses,
} from "../../../store/solanaSlice";
import { ROUTES } from "../../../constants/routes";
import RightArrowIcon from "../../../assets/svg/right-arrow.svg";
import PhraseIcon from "../../../assets/svg/phrase.svg";
import EditIcon from "../../../assets/svg/edit.svg";
import { SafeAreaContainer } from "../../../components/Styles/Layout.styles";
import Button from "../../../components/Button/Button";
import { placeholderArr } from "../../../utils/placeholder";

interface WalletContainerProps {
  theme: ThemeType;
  isLast: boolean;
  isActiveAccount: boolean;
}

interface WalletSkeletonContainerProps {
  theme: ThemeType;
  isLast: boolean;
  isActiveAccount: boolean;
}

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.medium};
  margin-top: ${(props) => (Platform.OS === "android" ? "80px" : "0px")};
`;

const WalletContainer = styled.TouchableOpacity<WalletContainerProps>`
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

const WalletSkeletonContainer = styled(MotiView)<WalletSkeletonContainerProps>`
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
    const balance = await ethService.getBalance(account.address);
    return {
      ...account,
      balance: parseFloat(ethers.formatEther(balance)),
    };
  });

  const solanaBalancePromise = solAcc.map(async (account: AddressState) => {
    const balance = await solanaService.getBalance(account.address);
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
  const activeEthIndex = useSelector(
    (state: RootState) => state.ethereum.activeIndex
  );
  const activeSolIndex = useSelector(
    (state: RootState) => state.solana.activeIndex
  );
  const activeEthAddress = useSelector(
    (state: RootState) => state.ethereum.addresses[activeEthIndex]
  );
  const activeSolAddress = useSelector(
    (state: RootState) => state.solana.addresses[activeSolIndex]
  );
  const ethAccounts = useSelector(
    (state: RootState) => state.ethereum.addresses
  );
  const solAccounts = useSelector((state: RootState) => state.solana.addresses);
  const prices = useSelector((state: RootState) => state.price.data);

  const theme = useTheme();
  const dispatch = useDispatch();
  const [walletCreationLoading, setWalletCreationLoading] = useState(false);
  const [priceAndBalanceLoading, setPriceAndBalanceLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);

  const createNewWalletPair = useCallback(async () => {
    setWalletCreationLoading(true);
    try {
      const nextEthIndex = ethAccounts.length;
      const nextSolIndex = solAccounts.length;
      const phrase = await getPhrase();
      const newEthWallet = await ethService.createWalletByIndex(
        phrase,
        nextEthIndex
      );
      const newSolWallet = await solanaService.createWalletByIndex(
        phrase,
        nextSolIndex
      );

      const transformedEthWallet: AddressState = {
        accountName: `Account ${nextEthIndex + 1}`,
        derivationPath: newEthWallet.derivationPath,
        address: newEthWallet.address,
        publicKey: newEthWallet.publicKey,
        balance: 0,
        transactionMetadata: {
          paginationKey: undefined,
          transactions: [],
        },
        failedNetworkRequest: false,
        status: GeneralStatus.Idle,
        transactionConfirmations: [],
      };
      const transformedSolWallet: AddressState = {
        accountName: `Account ${nextSolIndex + 1}`,
        derivationPath: newSolWallet.derivationPath,
        address: newSolWallet.address,
        publicKey: newSolWallet.publicKey,
        balance: 0,
        transactionMetadata: {
          paginationKey: undefined,
          transactions: [],
        },
        failedNetworkRequest: false,
        status: GeneralStatus.Idle,
        transactionConfirmations: [],
      };

      dispatch(updateEthereumAddresses(transformedEthWallet));
      dispatch(updateSolanaAddresses(transformedSolWallet));
    } catch (err) {
      console.error("Failed to create new wallet pair:", err);
    } finally {
      setWalletCreationLoading(false);
    }
  }, [dispatch]);

  const setNextActiveAccounts = useCallback(
    (index: number) => {
      dispatch(setActiveEthereumAccount(index));
      dispatch(setActiveSolanaAccount(index));
    },
    [dispatch]
  );

  const calculateTotalPrice = useCallback(
    (ethBalance: number, solBalance: number) => {
      const ethUsd = prices.ethereum.usd * ethBalance;
      const solUsd = prices.solana.usd * solBalance;
      return formatDollar(ethUsd + solUsd);
    },
    [prices]
  );

  const width = Dimensions.get("window").width * 0.6;
  const renderItem = useCallback(
    ({ item, index }) => {
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
          onPress={() => {
            setNextActiveAccounts(index);
            router.back();
          }}
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
    },
    [
      calculateTotalPrice,
      setNextActiveAccounts,
      priceAndBalanceLoading,
      accounts.length,
      theme,
    ]
  );

  const fetchBalances = useCallback(async () => {
    // TODO: Need to rethink how to calculate this. Possibly
    // Have a price and wallet section in redux. Currently
    // this causes too many re-renders
    try {
      const { ethereum, solana } = await compileAddressesConcurrently(
        ethAccounts,
        solAccounts
      );
      if (ethereum && solana) {
        setAccounts(
          compileInactiveAddresses(
            ethereum,
            solana,
            activeEthAddress.address,
            activeSolAddress.address
          )
        );
      }
    } catch (err) {
      console.error("Failed fetching balance:", err);
    } finally {
      setPriceAndBalanceLoading(false);
    }
  }, [
    ethAccounts,
    solAccounts,
    activeEthAddress,
    activeSolAddress,
    activeEthIndex,
    activeSolIndex,
  ]);

  const debouncedFetchBalances = useMemo(() => {
    return debounce(fetchBalances, 300);
  }, [fetchBalances]);

  useEffect(() => {
    debouncedFetchBalances();
    return () => debouncedFetchBalances.cancel();
  }, [debouncedFetchBalances]);

  const memoizedAccounts = useMemo(
    () =>
      priceAndBalanceLoading ? placeholderArr(ethAccounts.length) : accounts,
    [priceAndBalanceLoading, ethAccounts.length, accounts]
  );
  return (
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
                <PhraseIcon width={25} height={25} fill={theme.colors.white} />
                <SectionTitle>Secret Recovery Phrase</SectionTitle>
              </PhraseTextContent>
              <RightArrowIcon
                width={25}
                height={25}
                fill={theme.colors.white}
              />
            </WalletPhraseContainer>
          }
          data={memoizedAccounts}
          renderItem={renderItem}
          keyExtractor={(item) =>
            priceAndBalanceLoading ? item.uniqueId : item.id
          }
        />
        <Button
          linearGradient={theme.colors.primaryLinearGradient}
          loading={walletCreationLoading}
          onPress={createNewWalletPair}
          title="Create Wallet"
          backgroundColor={theme.colors.primary}
        />
      </ContentContainer>
    </SafeAreaContainer>
  );
};

export default memo(AccountsIndex);
