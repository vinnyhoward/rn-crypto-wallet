import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { View, ScrollView, RefreshControl, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import * as WebBrowser from "expo-web-browser";
import Toast from "react-native-toast-message";
import type { ThemeType } from "../../../styles/theme";
import type { RootState, AppDispatch } from "../../../store";
import {
  fetchEthereumBalance,
  fetchEthereumTransactions,
  fetchEthereumTransactionsInterval,
  fetchEthereumBalanceInterval,
} from "../../../store/ethereumSlice";
import {
  fetchSolanaBalance,
  fetchSolanaTransactions,
  fetchSolanaTransactionsInterval,
  fetchSolanaBalanceInterval,
} from "../../../store/solanaSlice";
import { useLoadingState } from "../../../hooks/redux";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { formatDollar } from "../../../utils/formatDollars";
import { placeholderArr } from "../../../utils/placeholder";
import { Chains, GenericTransaction } from "../../../types";
import { GeneralStatus } from "../../../store/types";
import { truncateWalletAddress } from "../../../utils/truncateWalletAddress";
// import { isCloseToBottom } from "../../../utils/isCloseToBottom";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import SendIcon from "../../../assets/svg/send.svg";
import ReceiveIcon from "../../../assets/svg/receive.svg";
import SolanaIcon from "../../../assets/svg/solana.svg";
import EthereumIcon from "../../../assets/svg/ethereum_plain.svg";
import TokenInfoCard from "../../../components/TokenInfoCard/TokenInfoCard";
import CryptoInfoCard from "../../../components/CryptoInfoCard/CryptoInfoCard";
import CryptoInfoCardSkeleton from "../../../components/CryptoInfoCard/CryptoInfoCardSkeleton";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import { TICKERS } from "../../../constants/tickers";
import { FETCH_PRICES_INTERVAL } from "../../../constants/price";
import {
  SafeAreaContainer,
  BalanceContainer,
} from "../../../components/Styles/Layout.styles";
import {
  ErrorContainer,
  ErrorText,
} from "../../../components/Styles/Errors.styles";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.medium};
  margin-top: ${(props) => (Platform.OS === "android" ? "40px" : "0px")};
`;

const BalanceTokenText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.huge};
  color: ${(props) => props.theme.fonts.colors.primary};
  text-align: center;
`;

const BalanceUsdText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.title};
  color: ${(props) => props.theme.colors.lightGrey};
  text-align: center;
`;

const ActionContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.huge};
`;

const CryptoInfoCardContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const SectionTitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-left: ${(props) => props.theme.spacing.small};
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const ComingSoonView = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ComingSoonText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.colors.lightGrey};
  margin-top: ${(props) => props.theme.spacing.medium};
`;

const BottomScrollFlatList = styled(BottomSheetFlatList)<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.tiny};
  padding-top: ${(props) => props.theme.spacing.small};
`;

const BottomSectionTitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.medium};
  margin-left: ${(props) => props.theme.spacing.huge};
`;

const SortContainer = styled.View<{ theme: ThemeType }>`
  display: flex;
  flex-direction: row;
  padding-right: ${(props) => props.theme.spacing.medium};
  padding-left: ${(props) => props.theme.spacing.medium};
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const SortButton = styled.TouchableOpacity<{
  theme: ThemeType;
  highlighted: boolean;
}>`
  background-color: ${({ theme, highlighted }) => {
    return highlighted ? theme.colors.primary : theme.colors.dark;
  }};
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 35px;
  border-radius: 8px;
  margin-right: 5px;
  padding: 0 20px;
`;

const SortText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  color: ${(props) => props.theme.colors.white};
  text-align: center;
`;

enum FilterTypes {
  ALL,
  RECEIVE,
  SENT,
}

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const sheetRef = useRef<BottomSheet>(null);
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const isStateLoading = useLoadingState();
  const chainName = id as string;

  const activeIndex = useSelector(
    (state: RootState) => state.ethereum.activeIndex
  );
  const tokenAddress = useSelector(
    (state: RootState) => state[chainName].addresses[activeIndex].address
  );
  const tokenBalance = useSelector(
    (state: RootState) => state[chainName].addresses[activeIndex].balance
  );
  const transactionHistory = useSelector(
    (state: RootState) =>
      state[chainName].addresses[activeIndex].transactionMetadata.transactions
  );

  const failedNetworkRequest = useSelector(
    (state: RootState) =>
      state[chainName].addresses[activeIndex].failedNetworkRequest
  );

  const failedStatus = useSelector(
    (state: RootState) =>
      state[chainName].addresses[activeIndex].status === GeneralStatus.Failed
  );

  // const loadingStatus = useSelector(
  //   (state: RootState) => state.wallet[chainName].status === GeneralStatus.Loading
  // );

  // const paginationKey: string[] | string = useSelector(
  //   (state: RootState) =>
  //     state.wallet[chainName].transactionMetadata.paginationKey
  // );

  const prices = useSelector((state: RootState) => state.price.data);
  const solPrice = prices.solana.usd;
  const ethPrice = prices.ethereum.usd;

  const [usdBalance, setUsdBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState(transactionHistory);
  const [filter, setFilter] = useState(FilterTypes.ALL);

  const ticker = TICKERS[chainName];
  const isSolana = chainName === Chains.Solana;
  const isEthereum = chainName === Chains.Ethereum;
  const Icon = isSolana ? SolanaIcon : EthereumIcon;

  const fetchAndUpdatePrices = async () => {
    await fetchTokenBalance();
    await fetchPrices(tokenBalance);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAndUpdatePrices();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [dispatch]);

  const _handlePressButtonAsync = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const urlBuilder = (hash: string) => {
    let url: string;

    if (chainName === Chains.Ethereum) {
      url = `https://sepolia.etherscan.io/tx/${hash}`;
    } else {
      url = `https://explorer.solana.com/tx/${hash}`;
    }
    return url;
  };

  const renderItem = ({ item }) => {
    if (isStateLoading) {
      return <CryptoInfoCardSkeleton hideBackground={true} />;
    }
    if (failedStatus) {
      return (
        <ErrorContainer>
          <ErrorText>
            There seems to be a network error, please try again later
          </ErrorText>
        </ErrorContainer>
      );
    }

    const sign = item.direction === "received" ? "+" : "-";
    if (isSolana) {
      return (
        <CryptoInfoCard
          onPress={() => _handlePressButtonAsync(urlBuilder(item.hash))}
          title={capitalizeFirstLetter(item.direction)}
          caption={`To ${truncateWalletAddress(item.to)}`}
          details={`${sign} ${item.value} ${item.asset}`}
          icon={<Icon width={35} height={35} fill={theme.colors.white} />}
        />
      );
    }

    if (isEthereum) {
      return (
        <CryptoInfoCard
          onPress={() => _handlePressButtonAsync(urlBuilder(item.hash))}
          title={capitalizeFirstLetter(item.direction)}
          caption={`To ${truncateWalletAddress(item.to)}`}
          details={`${sign} ${item.value} ${item.asset}`}
          icon={<Icon width={35} height={35} fill={theme.colors.white} />}
        />
      );
    }
  };

  const fetchPrices = async (currentTokenBalance: number) => {
    if (chainName === Chains.Ethereum) {
      dispatch(fetchEthereumTransactions({ address: tokenAddress }));
      const usd = ethPrice * currentTokenBalance;
      setUsdBalance(usd);
    }

    if (chainName === Chains.Solana) {
      dispatch(fetchSolanaTransactions(tokenAddress));
      const usd = solPrice * currentTokenBalance;
      setUsdBalance(usd);
    }
  };

  const fetchPricesInterval = async (currentTokenBalance: number) => {
    if (chainName === Chains.Ethereum) {
      dispatch(fetchEthereumTransactionsInterval({ address: tokenAddress }));
      const usd = ethPrice * currentTokenBalance;
      setUsdBalance(usd);
    }

    if (chainName === Chains.Solana) {
      dispatch(fetchSolanaTransactionsInterval(tokenAddress));
      const usd = solPrice * currentTokenBalance;
      setUsdBalance(usd);
    }
  };

  const fetchTokenBalance = async () => {
    if (isSolana && tokenAddress) {
      dispatch(fetchSolanaBalance(tokenAddress));
    }

    if (isEthereum && tokenAddress) {
      dispatch(fetchEthereumBalance(tokenAddress));
    }
  };

  const fetchTokenBalanceInterval = async () => {
    if (isSolana && tokenAddress) {
      dispatch(fetchSolanaBalanceInterval(tokenAddress));
    }

    if (isEthereum && tokenAddress) {
      dispatch(fetchEthereumBalanceInterval(tokenAddress));
    }
  };

  const fetchAndUpdatePricesInterval = async () => {
    await fetchTokenBalanceInterval();
    await fetchPricesInterval(tokenBalance);
  };

  const snapPoints = useMemo(() => ["38%", "66%", "90%"], []);

  const filterTransactions = () => {
    switch (filter) {
      case FilterTypes.RECEIVE:
        return setTransactions(
          transactionHistory.filter(
            (item: GenericTransaction) => item.direction === "received"
          )
        );
      case FilterTypes.SENT:
        return setTransactions(
          transactionHistory.filter(
            (item: GenericTransaction) => item.direction === "sent"
          )
        );
      default:
        return setTransactions(transactionHistory);
    }
  };

  useEffect(() => {
    fetchAndUpdatePrices();
    const intervalId = setInterval(
      fetchAndUpdatePricesInterval,
      FETCH_PRICES_INTERVAL
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, tokenBalance, ethPrice, solPrice, chainName, tokenAddress]);

  useEffect(() => {
    if (failedNetworkRequest) {
      setTimeout(() => {
        Toast.show({
          type: "success",
          text1: `We are facing ${capitalizeFirstLetter(
            chainName
          )} network issues`,
          text2: "Please try again later",
        });
      }, 2500);
    }
  }, [failedNetworkRequest]);

  useEffect(() => {
    filterTransactions();
  }, [transactionHistory, filter]);

  return (
    <SafeAreaContainer>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.white}
          />
        }
      >
        <ContentContainer>
          <BalanceContainer>
            <BalanceTokenText>
              {tokenBalance} {ticker}
            </BalanceTokenText>
            <BalanceUsdText>{formatDollar(usdBalance)}</BalanceUsdText>
          </BalanceContainer>
          <ActionContainer>
            <PrimaryButton
              icon={
                <SendIcon width={25} height={25} fill={theme.colors.primary} />
              }
              onPress={() => router.push(`token/send/${chainName}`)}
              btnText="Send"
            />
            <View style={{ width: 15 }} />
            <PrimaryButton
              icon={
                <ReceiveIcon
                  width={25}
                  height={25}
                  fill={theme.colors.primary}
                />
              }
              onPress={() => router.push(`token/receive/${chainName}`)}
              btnText="Receive"
            />
          </ActionContainer>
          <SectionTitle>About {capitalizeFirstLetter(chainName)}</SectionTitle>
          <CryptoInfoCardContainer>
            <TokenInfoCard
              tokenName={capitalizeFirstLetter(chainName)}
              tokenSymbol={ticker}
              network={capitalizeFirstLetter(chainName)}
            />
          </CryptoInfoCardContainer>
        </ContentContainer>
      </ScrollView>
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: theme.colors.lightDark,
          opacity: 0.98,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,

          elevation: 24,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.white,
        }}
        handleStyle={{
          marginTop: 6,
        }}
      >
        <BottomScrollFlatList
          ListHeaderComponent={
            <>
              <BottomSectionTitle>Transaction History</BottomSectionTitle>
              <SortContainer>
                <SortButton
                  onPress={() => !isStateLoading && setFilter(FilterTypes.ALL)}
                  highlighted={filter === FilterTypes.ALL}
                >
                  <SortText>All</SortText>
                </SortButton>
                <SortButton
                  onPress={() =>
                    !isStateLoading && setFilter(FilterTypes.RECEIVE)
                  }
                  highlighted={filter === FilterTypes.RECEIVE}
                >
                  <SortText>Received</SortText>
                </SortButton>
                <SortButton
                  onPress={() => !isStateLoading && setFilter(FilterTypes.SENT)}
                  highlighted={filter === FilterTypes.SENT}
                >
                  <SortText>Sent</SortText>
                </SortButton>
              </SortContainer>
            </>
          }
          data={isStateLoading ? placeholderArr(8) : transactions}
          renderItem={renderItem}
          keyExtractor={(item: GenericTransaction) => item.uniqueId}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListEmptyComponent={() => {
            if (failedStatus) {
              return (
                <ErrorContainer>
                  <ErrorText>
                    There seems to be a network error, please try again later
                  </ErrorText>
                </ErrorContainer>
              );
            } else {
              return (
                <ComingSoonView>
                  <ComingSoonText>
                    Add some {ticker} to your wallet
                  </ComingSoonText>
                </ComingSoonView>
              );
            }
          }}
        ></BottomScrollFlatList>
      </BottomSheet>
    </SafeAreaContainer>
  );
}
