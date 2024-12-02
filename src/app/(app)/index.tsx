import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { View, RefreshControl, FlatList, Platform } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import styled, { useTheme } from "styled-components/native";
import { ROUTES } from "../../constants/routes";
import type { ThemeType } from "../../styles/theme";
import type { RootState, AppDispatch } from "../../store";
import { fetchPrices } from "../../store/priceSlice";
import {
  fetchEthereumBalance,
  fetchEthereumTransactions,
  fetchEthereumTransactionsInterval,
  fetchEthereumBalanceInterval,
} from "../../store/ethereumSlice";
import {
  fetchSolanaBalance,
  fetchSolanaTransactions,
  fetchSolanaTransactionsInterval,
  fetchSolanaBalanceInterval,
} from "../../store/solanaSlice";
import { useLoadingState } from "../../hooks/redux";
import { GeneralStatus } from "../../store/types";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { truncateWalletAddress } from "../../utils/truncateWalletAddress";
import { formatDollar, formatDollarRaw } from "../../utils/formatDollars";
import { placeholderArr } from "../../utils/placeholder";
import { useStorage } from "../../hooks/useStorageState";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import SendIcon from "../../assets/svg/send.svg";
import ReceiveIcon from "../../assets/svg/receive.svg";
import CryptoInfoCard from "../../components/CryptoInfoCard/CryptoInfoCard";
import CryptoInfoCardSkeleton from "../../components/CryptoInfoCard/CryptoInfoCardSkeleton";
import SolanaIcon from "../../assets/svg/solana.svg";
import EthereumPlainIcon from "../../assets/svg/ethereum_plain.svg";
import EthereumIcon from "../../assets/svg/ethereum.svg";
import { FETCH_PRICES_INTERVAL } from "../../constants/price";
import { TICKERS } from "../../constants/tickers";
import { SafeAreaContainer } from "../../components/Styles/Layout.styles";
import InfoBanner from "../../components/InfoBanner/InfoBanner";
import { SNAP_POINTS } from "../../constants/storage";
import Didcomm from "../../../native-modules/didcomm";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.medium};
  margin-top: ${(props) =>
    Platform.OS === "android" ? "40px" : props.theme.spacing.huge};
`;
const BalanceContainer = styled.View<{ theme: ThemeType }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.huge};
`;

const BalanceText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.uberHuge};
  color: ${(props) => props.theme.fonts.colors.primary};
  text-align: center;
`;

const ActionContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const CryptoInfoCardContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  flex-direction: column;
  width: 100%;
`;

const CardView = styled.View<{ theme: ThemeType }>`
  margin-bottom: ${(props) => props.theme.spacing.medium};
  width: 100%;
`;

const SectionTitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.medium};
  margin-left: ${(props) => props.theme.spacing.small};
`;

const BottomSectionTitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.title};
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.medium};
  margin-left: ${(props) => props.theme.spacing.huge};
`;

const DollarSign = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.colors.lightGrey};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.uberHuge};
  text-align: center;
`;

const BottomScrollView = styled(BottomSheetScrollView)<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.tiny};
  padding-top: ${(props) => props.theme.spacing.small};
`;

const ErrorContainer = styled.View<{ theme: ThemeType }>`
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

const ErrorText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  color: ${(props) => props.theme.colors.white};
`;

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const sheetRef = useRef<BottomSheet>(null);
  const theme = useTheme();
  const isLoading = useLoadingState();

  const activeEthIndex = useSelector(
    (state: RootState) => state.ethereum.activeIndex
  );
  const ethWalletAddress = useSelector(
    (state: RootState) => state.ethereum.addresses[activeEthIndex].address
  );
  const ethBalance = useSelector(
    (state: RootState) => state.ethereum.addresses[activeEthIndex].balance
  );
  const ethTransactions = useSelector(
    (state: RootState) =>
      state.ethereum.addresses[activeEthIndex].transactionMetadata.transactions
  );
  const failedEthStatus = useSelector(
    (state: RootState) =>
      state.ethereum.addresses[activeEthIndex].status === GeneralStatus.Failed
  );
  const activeSolIndex = useSelector(
    (state: RootState) => state.solana.activeIndex
  );
  const solWalletAddress = useSelector(
    (state: RootState) => state.solana.addresses[activeSolIndex].address
  );
  const solBalance = useSelector(
    (state: RootState) => state.solana.addresses[activeSolIndex].balance
  );

  const solTransactions = useSelector(
    (state: RootState) =>
      state.solana.addresses[activeSolIndex].transactionMetadata.transactions
  );
  const failedSolStatus = useSelector(
    (state: RootState) =>
      state.solana.addresses[activeSolIndex].status === GeneralStatus.Failed
  );

  const snapPoints = useMemo(() => ["10%", "33%", "69%", "88%"], []);

  const prices = useSelector((state: RootState) => state.price.data);
  const solPrice = prices?.solana?.usd;
  const ethPrice = prices?.ethereum?.usd;

  const [refreshing, setRefreshing] = useState(false);
  const [usdBalance, setUsdBalance] = useState(0);
  const [solUsd, setSolUsd] = useState(0);
  const [ethUsd, setEthUsd] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [bottomSheetIndex, setBottomSheetIndex, bottomSheetIndexLoading] =
    useStorage(SNAP_POINTS);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(fetchPrices());
    fetchTokenBalances();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [dispatch, solWalletAddress, ethWalletAddress]);

  const fetchTokenBalances = useCallback(async () => {
    if (ethWalletAddress) {
      dispatch(fetchEthereumBalance(ethWalletAddress));
    }

    if (solWalletAddress) {
      dispatch(fetchSolanaBalance(solWalletAddress));
    }
  }, [ethBalance, solBalance, dispatch]);

  const fetchTokenBalancesInterval = useCallback(async () => {
    if (ethWalletAddress) {
      dispatch(fetchEthereumBalanceInterval(ethWalletAddress));
    }

    if (solWalletAddress) {
      dispatch(fetchSolanaBalanceInterval(solWalletAddress));
    }
  }, [ethBalance, solBalance, dispatch]);

  const updatePrices = () => {
    if (ethWalletAddress && solWalletAddress) {
      const ethUsd = ethPrice * ethBalance;
      const solUsd = solPrice * solBalance;

      setUsdBalance(ethUsd + solUsd);
      setEthUsd(ethUsd);
      setSolUsd(solUsd);
    }
  };

  const _handlePressButtonAsync = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const urlBuilder = (hash: string, asset: string) => {
    let url: string;
    if (asset.toLowerCase() === TICKERS.ethereum.toLowerCase()) {
      url = `https://sepolia.etherscan.io/tx/${hash}`;
    } else {
      url = `https://explorer.solana.com/?cluster=testnet/tx/${hash}`;
    }
    return url;
  };

  const renderItem = ({ item }) => {
    if (isLoading) {
      return <CryptoInfoCardSkeleton />;
    }
    const isSolana = item.asset.toLowerCase() === TICKERS.solana.toLowerCase();
    const isEthereum =
      item.asset.toLowerCase() === TICKERS.ethereum.toLowerCase();
    const Icon = isSolana ? SolanaIcon : EthereumPlainIcon;
    const sign = item.direction === "received" ? "+" : "-";
    if (isSolana) {
      const caption =
        item.direction === "received"
          ? `from ${truncateWalletAddress(item.from)}`
          : `To ${truncateWalletAddress(item.to)}`;
      return (
        <CryptoInfoCard
          onPress={() =>
            _handlePressButtonAsync(urlBuilder(item.hash, item.asset))
          }
          title={capitalizeFirstLetter(item.direction)}
          caption={caption}
          details={`${sign} ${item.value} ${item.asset}`}
          icon={<Icon width={35} height={35} fill={theme.colors.white} />}
        />
      );
    }

    if (isEthereum) {
      const caption =
        item.direction === "received"
          ? `from ${truncateWalletAddress(item.from)}`
          : `To ${truncateWalletAddress(item.to)}`;
      return (
        <CryptoInfoCard
          onPress={() =>
            _handlePressButtonAsync(urlBuilder(item.hash, item.asset))
          }
          title={capitalizeFirstLetter(item.direction)}
          caption={caption}
          details={`${sign} ${item.value} ${item.asset}`}
          icon={<Icon width={35} height={35} fill={theme.colors.white} />}
        />
      );
    }
  };

  const fetchTransactions = async () => {
    dispatch(fetchEthereumTransactions({ address: ethWalletAddress }));
    dispatch(fetchSolanaTransactions(solWalletAddress));
  };

  const fetchTransactionsInterval = async () => {
    dispatch(fetchEthereumTransactionsInterval({ address: ethWalletAddress }));
    dispatch(fetchSolanaTransactionsInterval(solWalletAddress));
  };

  const fetchBalanceAndPrice = async () => {
    await dispatch(fetchPrices());
    await fetchTokenBalances();
  };

  const fetchBalanceAndPriceInterval = async () => {
    await dispatch(fetchPrices());
    await fetchTokenBalancesInterval();
  };

  const fetchAndUpdatePrices = async () => {
    if (ethWalletAddress && solWalletAddress) {
      await fetchBalanceAndPrice();
      await fetchTransactions();
    }
  };

  const fetchAndUpdatePricesInternal = async () => {
    if (solBalance && ethBalance) {
      await fetchBalanceAndPriceInterval();
      await fetchTransactionsInterval();
    }
  };

  const handleSheetChange = (index: number) => {
    setBottomSheetIndex(JSON.stringify(index));
  };

  useEffect(() => {
    fetchAndUpdatePrices();
  }, [dispatch, ethWalletAddress, solWalletAddress]);

  useEffect(() => {
    const interval = setInterval(
      fetchAndUpdatePricesInternal,
      FETCH_PRICES_INTERVAL
    );

    return () => clearInterval(interval);
  }, [dispatch, ethWalletAddress, solWalletAddress]);

  useEffect(() => {
    updatePrices();
  }, [ethBalance, solBalance, ethWalletAddress, solWalletAddress]);

  useEffect(() => {
    // TODO: Sort these somewhere else
    const mergedAndSortedTransactions = [
      ...solTransactions,
      ...ethTransactions,
    ].sort((a, b) => b.blockTime - a.blockTime);
    setTransactions(mergedAndSortedTransactions);
  }, [solTransactions, ethTransactions, ethWalletAddress, solWalletAddress]);

  useEffect(() => {
    const initDidcomm = async () => {
      try {
        const result = await Didcomm.helloWorld();
        console.log("result:", result);
      } catch (err) {
        console.error(err);
      }
    };

    initDidcomm();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <FlatList
          contentContainerStyle={{ gap: 10 }}
          data={isLoading ? placeholderArr(8) : transactions}
          renderItem={renderItem}
          keyExtractor={(item) => {
            return item.uniqueId;
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          refreshControl={
            <RefreshControl
              tintColor="#fff"
              titleColor="#fff"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListHeaderComponent={
            <>
              <BalanceContainer>
                <DollarSign>$</DollarSign>
                <BalanceText>{formatDollarRaw(usdBalance)}</BalanceText>
              </BalanceContainer>
              <ActionContainer>
                <PrimaryButton
                  icon={
                    <SendIcon
                      width={25}
                      height={25}
                      fill={theme.colors.primary}
                    />
                  }
                  onPress={() => router.push(ROUTES.sendOptions)}
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
                  onPress={() => router.push(ROUTES.receiveOptions)}
                  btnText="Receive"
                />
              </ActionContainer>
              <SectionTitle>Recent Activity</SectionTitle>
            </>
          }
          ListEmptyComponent={
            <>
              {failedEthStatus && failedSolStatus ? (
                <ErrorContainer>
                  <ErrorText>
                    There seems to be a network error, please try again later
                  </ErrorText>
                </ErrorContainer>
              ) : (
                <InfoBanner />
              )}
            </>
          }
        />
      </ContentContainer>
      {!bottomSheetIndexLoading && (
        <BottomSheet
          ref={sheetRef}
          index={bottomSheetIndex !== null ? parseInt(bottomSheetIndex) : 1}
          onChange={handleSheetChange}
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
          <BottomScrollView>
            <BottomSectionTitle>Assets</BottomSectionTitle>
            <CryptoInfoCardContainer>
              <CardView>
                <CryptoInfoCard
                  onPress={() => router.push(ROUTES.ethDetails)}
                  title="Ethereum"
                  caption={`${ethBalance} ETH`}
                  details={formatDollar(ethUsd)}
                  icon={
                    <EthereumIcon
                      width={35}
                      height={35}
                      fill={theme.colors.white}
                    />
                  }
                  hideBackground
                />
              </CardView>
              <CardView>
                <CryptoInfoCard
                  onPress={() => router.push(ROUTES.solDetails)}
                  title="Solana"
                  caption={`${solBalance} SOL`}
                  details={formatDollar(solUsd)}
                  icon={<SolanaIcon width={25} height={25} fill="#14F195" />}
                  hideBackground
                />
              </CardView>
            </CryptoInfoCardContainer>
          </BottomScrollView>
        </BottomSheet>
      )}
    </SafeAreaContainer>
  );
}
