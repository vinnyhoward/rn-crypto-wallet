import { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { ThemeType } from "../../../styles/theme";
import { ROUTES } from "../../../constants/routes";
import type { RootState } from "../../../store";
import {
  fetchEthereumBalance,
  updateSolanaBalance,
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
import EthereumIcon from "../../../assets/svg/ethereum.svg";

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
  font-size: ${(props) => props.theme.fonts.sizes.uberHuge};
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
`;

// const CardView = styled.View<{ theme: ThemeType }>`
//   padding-left: ${(props) => props.theme.spacing.large};
//   padding-right: ${(props) => props.theme.spacing.large};
//   padding-bottom: ${(props) => props.theme.spacing.medium};
//   width: 100%;
// `;

const SectionTitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.title};
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.medium};
  margin-left: ${(props) => props.theme.spacing.small};
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
  const [usdBalance, setUsdBalance] = useState(0);

  // TODO: Find cheap api to find real prices of tokens
  const ethPriceMock = 3006.94;
  const solPriceMock = 127.22;
  const ticker = tickers[id.toString()];

  useEffect(() => {
    if (Chain[id.toString()] === Chain.Solana && tokenAddress) {
      const fetchSolanaBalance = async () => {
        const currentSolBalance = await getSolanaBalance(tokenAddress);
        dispatch(updateSolanaBalance(currentSolBalance));
      };
      fetchSolanaBalance();
    }

    if (Chain[id.toString()] === Chain.Ethereum && tokenAddress) {
      dispatch(fetchEthereumBalance(tokenAddress));
    }
  }, [tokenAddress, dispatch]);

  useEffect(() => {
    const fetchPrices = async () => {
      if (id.toString() === Chain.Ethereum) {
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

  console.log("address", tokenAddress);
  console.log("balance", tokenBalance);
  console.log("usd balance", usdBalance);
  return (
    <SafeAreaContainer>
      <ScrollView>
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
              onPress={() => router.push(ROUTES.sendCrypto)}
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
              onPress={() => router.push(ROUTES.receiveCrypto)}
              btnText="Receive"
            />
          </ActionContainer>
          <SectionTitle>
            About {capitalizeFirstLetter(id.toString())}
          </SectionTitle>
          <CryptoInfoCardContainer>
            {/* <CardView>
              <CryptoInfoCard
                usdCryptoPrice={`$${ethUsd.toFixed(2)}`}
                cryptoBalanceAmount={`${tokenBalance} ETH`}
                icon={
                  <EthereumIcon
                    width={35}
                    height={35}
                    fill={theme.colors.white}
                  />
                }
                btnText="Ethereum"
              />
            </CardView>
            <CardView>
              <CryptoInfoCard
                usdCryptoPrice={`$${solUsd.toFixed(2)}`}
                cryptoBalanceAmount={`${solBalance} SOL`}
                icon={<SolanaIcon width={25} height={25} fill="#14F195" />}
                btnText="Solana"
              />
            </CardView> */}
            <TokenInfoCard
              tokenName={capitalizeFirstLetter(id.toString())}
              tokenSymbol={ticker}
              network={capitalizeFirstLetter(id.toString())}
            />
          </CryptoInfoCardContainer>
        </ContentContainer>
      </ScrollView>
    </SafeAreaContainer>
  );
}
