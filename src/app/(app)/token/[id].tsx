import { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { ThemeType } from "../../../styles/theme";
import { ROUTES } from "../../../constants/routes";
import type { RootState } from "../../../store";
import {
  fetchEthereumBalance,
  updateSolanaBalance,
  fetchEthereumTransactions,
} from "../../../store/walletSlice";
import type { AppDispatch } from "../../../store";
import { getSolanaBalance } from "../../../utils/getSolanaBalance";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { formatDollar } from "../../../utils/formatDollars";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import SendIcon from "../../../assets/svg/send.svg";
import ReceiveIcon from "../../../assets/svg/receive.svg";
import TokenInfoCard from "../../../components/TokenInfoCard/TokenInfoCard";
import SolanaIcon from "../../../assets/svg/solana.svg";
import EthereumIcon from "../../../assets/svg/ethereum_plain.svg";
import { AssetTransfer } from "../../../types";
import CryptoInfoCard from "../../../components/CryptoInfoCard/CryptoInfoCard";
import { truncateWalletAddress } from "../../../utils/truncateWalletAddress";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.dark};
  justify-content: flex-end;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.large};
`;

const BalanceContainer = styled.View<{ theme: ThemeType }>`
  margin-top: 10px;
  margin-bottom: ${(props) => props.theme.spacing.huge};
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
  flex: 1;
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

const TransactionTitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.small};
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

enum Chain {
  Ethereum = "ethereum",
  Solana = "solana",
}

const tickers = {
  ethereum: "ETH",
  solana: "SOL",
};

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const tokenAddress = useSelector(
    (state: RootState) => state.wallet[id.toString()].address
  );
  const tokenBalance = useSelector(
    (state: RootState) => state.wallet[id.toString()].balance
  );
  const transactionHistory = useSelector(
    (state: RootState) => state.wallet[id.toString()].transactions
  );

  const [usdBalance, setUsdBalance] = useState(0);
  const [transactions, setTransactions] = useState<AssetTransfer[]>([]);

  // TODO: Find cheap api to find real prices of tokens
  const ethPriceMock = 3006.94;
  const solPriceMock = 127.22;
  const ticker = tickers[id.toString()];
  const isSolana = id.toString() === Chain.Solana;
  const isEthereum = id.toString() === Chain.Ethereum;
  const Icon = isSolana ? SolanaIcon : EthereumIcon;

  const renderItem = ({ item }) => {
    if (
      item.category === "external" &&
      item.from.toLowerCase() === tokenAddress.toLowerCase()
    ) {
      return (
        <CryptoInfoCard
          title="Sent"
          caption={`To ${truncateWalletAddress(item.to)}`}
          details={`- ${item.value} ${item.asset}`}
          icon={<Icon width={35} height={35} fill={theme.colors.white} />}
        />
      );
    }

    if (
      item.category === "external" &&
      item.to.toLowerCase() === tokenAddress.toLowerCase()
    ) {
      return (
        <CryptoInfoCard
          title="Received"
          caption={`From ${truncateWalletAddress(item.from)}`}
          details={`+ ${item.value} ${item.asset}`}
          icon={<Icon width={35} height={35} fill={theme.colors.white} />}
        />
      );
    }
  };

  useEffect(() => {
    if (isSolana && tokenAddress) {
      const fetchSolanaBalance = async () => {
        const currentSolBalance = await getSolanaBalance(tokenAddress);
        dispatch(updateSolanaBalance(currentSolBalance));
      };
      fetchSolanaBalance();
    }

    if (isEthereum && tokenAddress) {
      dispatch(fetchEthereumBalance(tokenAddress));
    }
  }, [tokenAddress, dispatch]);

  useEffect(() => {
    const fetchPrices = async () => {
      if (id.toString() === Chain.Ethereum) {
        dispatch(fetchEthereumTransactions(tokenAddress));
        const usd = ethPriceMock * tokenBalance;
        setUsdBalance(usd);
      }

      if (id.toString() === Chain.Solana) {
        const usd = solPriceMock * tokenBalance;
        setUsdBalance(usd);
      }
    };

    fetchPrices();
  }, [tokenBalance]);

  useEffect(() => {
    if (transactionHistory && isEthereum) {
      const walletTransactions = transactionHistory.transfers.filter(
        (tx: AssetTransfer) => {
          return tx.asset === ticker;
        }
      );
      setTransactions(walletTransactions);
    }
  }, [transactionHistory]);

  console.log("transactions", transactions);
  return (
    <SafeAreaContainer>
      <ContentContainer>
        <FlatList
          ListHeaderComponent={
            <>
              <BalanceContainer>
                <BalanceTokenText>
                  {tokenBalance} {ticker}
                </BalanceTokenText>
                <BalanceUsdText>{formatDollar(usdBalance)}</BalanceUsdText>
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
                  onPress={() => router.push(ROUTES.send)}
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
                  onPress={() => router.push(ROUTES.receive)}
                  btnText="Receive"
                />
              </ActionContainer>
              <SectionTitle>
                About {capitalizeFirstLetter(id.toString())}
              </SectionTitle>
              <CryptoInfoCardContainer>
                <TokenInfoCard
                  tokenName={capitalizeFirstLetter(id.toString())}
                  tokenSymbol={ticker}
                  network={capitalizeFirstLetter(id.toString())}
                />
              </CryptoInfoCardContainer>

              <TransactionTitle>Transaction History</TransactionTitle>
            </>
          }
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.uniqueId}
          contentContainerStyle={{ gap: 10 }}
          ListEmptyComponent={
            <ComingSoonView>
              <ComingSoonText>Coming Soon</ComingSoonText>
            </ComingSoonView>
          }
        />
      </ContentContainer>
    </SafeAreaContainer>
  );
}