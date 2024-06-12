import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { View, RefreshControl, FlatList } from "react-native";
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
  updateSolanaBalance,
  fetchEthereumTransactions,
  fetchSolanaTransactions,
} from "../../store/walletSlice";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { truncateWalletAddress } from "../../utils/truncateWalletAddress";
import { formatDollar, formatDollarRaw } from "../../utils/formatDollars";
import { getSolanaBalance } from "../../utils/solanaHelpers";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import SendIcon from "../../assets/svg/send.svg";
import ReceiveIcon from "../../assets/svg/receive.svg";
import CryptoInfoCard from "../../components/CryptoInfoCard/CryptoInfoCard";
import SolanaIcon from "../../assets/svg/solana.svg";
import EthereumPlainIcon from "../../assets/svg/ethereum_plain.svg";
import EthereumIcon from "../../assets/svg/ethereum.svg";
import { FETCH_PRICES_INTERVAL } from "../../constants/price";
import { TICKERS } from "../../constants/tickers";
import { SafeAreaContainer } from "../../components/Styles/Layout.styles";
import InfoBanner from "../../components/InfoBanner/InfoBanner";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.medium};
  margin-top: ${(props) => props.theme.spacing.huge};
`;

const BalanceContainer = styled.View<{ theme: ThemeType }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 7.5px;
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
  const walletState = useSelector((state: RootState) => state.wallet);
  const ethWalletAddress = useSelector(
    (state: RootState) => state.wallet.ethereum.activeAddress.address
  );
  const ethBalance = useSelector(
    (state: RootState) => state.wallet.ethereum.activeAddress.balance
  );
  const solWalletAddress = useSelector(
    (state: RootState) => state.wallet.solana.activeAddress.address
  );
  const solBalance = useSelector(
    (state: RootState) => state.wallet.solana.activeAddress.balance
  );
  const solTransactions = useSelector(
    (state: RootState) =>
      state.wallet.solana.activeAddress.transactionMetadata.transactions
  );
  const ethTransactions = useSelector(
    (state: RootState) =>
      state.wallet.ethereum.activeAddress.transactionMetadata.transactions
  );
  const failedEthStatus = useSelector(
    (state: RootState) => state.wallet.ethereum.status === "failed"
  );
  const failedSolStatus = useSelector(
    (state: RootState) => state.wallet.solana.status === "failed"
  );

  const snapPoints = useMemo(() => ["10%", "33%", "68%", "90%"], []);

  const prices = useSelector((state: RootState) => state.price.data);
  const solPrice = prices?.solana?.usd;
  const ethPrice = prices?.ethereum?.usd;

  const [refreshing, setRefreshing] = useState(false);
  const [usdBalance, setUsdBalance] = useState(0);
  const [solUsd, setSolUsd] = useState(0);
  const [ethUsd, setEthUsd] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(fetchPrices());
    fetchTokenBalances();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [dispatch]);

  const fetchSolanaBalance = async () => {
    const currentSolBalance = await getSolanaBalance(solWalletAddress);
    dispatch(updateSolanaBalance(currentSolBalance));
  };

  const fetchTokenBalances = useCallback(async () => {
    if (ethWalletAddress) {
      dispatch(fetchEthereumBalance(ethWalletAddress));
    }

    if (solWalletAddress) {
      await fetchSolanaBalance();
    }
  }, [ethBalance, solBalance, dispatch]);

  const updatePrices = () => {
    const ethUsd = ethPrice * ethBalance;
    const solUsd = solPrice * solBalance;

    setUsdBalance(ethUsd + solUsd);
    setEthUsd(ethUsd);
    setSolUsd(solUsd);
  };

  const _handlePressButtonAsync = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const urlBuilder = (hash: string, asset: string) => {
    let url: string;
    if (asset.toLowerCase() === TICKERS.ethereum.toLowerCase()) {
      url = `https://sepolia.etherscan.io/tx/${hash}`;
    } else {
      url = `https://explorer.solana.com/tx/${hash}`;
    }
    return url;
  };

  const renderItem = ({ item }) => {
    const isSolana = item.asset.toLowerCase() === TICKERS.solana.toLowerCase();
    const isEthereum =
      item.asset.toLowerCase() === TICKERS.ethereum.toLowerCase();
    const Icon = isSolana ? SolanaIcon : EthereumPlainIcon;
    const sign = item.direction === "received" ? "+" : "-";
    if (isSolana) {
      return (
        <CryptoInfoCard
          onPress={() =>
            _handlePressButtonAsync(urlBuilder(item.hash, item.asset))
          }
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
          onPress={() =>
            _handlePressButtonAsync(urlBuilder(item.hash, item.asset))
          }
          title={capitalizeFirstLetter(item.direction)}
          caption={`To ${truncateWalletAddress(item.to)}`}
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

  const fetchAndUpdatePrices = async () => {
    await dispatch(fetchPrices());
    await fetchTokenBalances();
    await fetchTransactions();
  };

  useEffect(() => {
    fetchAndUpdatePrices();
    const interval = setInterval(fetchAndUpdatePrices, FETCH_PRICES_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch, ethWalletAddress, solWalletAddress]);

  useEffect(() => {
    updatePrices();
  }, [ethBalance, solBalance, ethWalletAddress, solWalletAddress]);

  useEffect(() => {
    const mergedAndSortedTransactions = [
      ...solTransactions,
      ...ethTransactions,
    ].sort((a, b) => b.blockTime - a.blockTime);
    setTransactions(mergedAndSortedTransactions);
  }, [solTransactions, ethTransactions, ethWalletAddress, solWalletAddress]);

  console.log("accounts:", walletState);
  return (
    <SafeAreaContainer>
      <ContentContainer>
        <FlatList
          contentContainerStyle={{ gap: 10 }}
          data={failedEthStatus && failedSolStatus ? [] : transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.uniqueId}
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
              {failedEthStatus || failedSolStatus ? (
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
      <BottomSheet
        ref={sheetRef}
        index={1}
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
    </SafeAreaContainer>
  );
}
