import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { ThemeType } from "../../../../styles/theme";
import type { RootState } from "../../../../store";
import { formatDollar } from "../../../../utils/formatDollars";
import CryptoInfoCard from "../../../../components/CryptoInfoCard/CryptoInfoCard";
import SolanaIcon from "../../../../assets/svg/solana.svg";
import EthereumIcon from "../../../../assets/svg/ethereum.svg";
import { SafeAreaContainer } from "../../../../components/Styles/Layout.styles";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.medium};
  margin-top: ${Platform.OS === "android" ? "75px" : "0"};
`;

const CardView = styled.View<{ theme: ThemeType }>`
  margin-bottom: ${(props) => props.theme.spacing.medium};
  width: 100%;
`;

export default function SendOptions() {
  const theme = useTheme();
  const router = useRouter();
  const activeEthIndex = useSelector(
    (state: RootState) => state.ethereum.activeIndex
  );
  const activeSolIndex = useSelector(
    (state: RootState) => state.solana.activeIndex
  );
  const ethBalance = useSelector(
    (state: RootState) => state.ethereum.addresses[activeEthIndex].balance
  );
  const solBalance = useSelector(
    (state: RootState) => state.solana.addresses[activeSolIndex].balance
  );
  const prices = useSelector((state: RootState) => state.price.data);
  const solPrice = prices.solana.usd;
  const ethPrice = prices.ethereum.usd;

  const [solUsd, setSolUsd] = useState(0);
  const [ethUsd, setEthUsd] = useState(0);

  useEffect(() => {
    const fetchPrices = async () => {
      const ethUsd = ethPrice * ethBalance;
      const solUsd = solPrice * solBalance;

      setEthUsd(ethUsd);
      setSolUsd(solUsd);
    };
    fetchPrices();
  }, [ethBalance, solBalance]);

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <CardView>
          <CryptoInfoCard
            onPress={() => router.push("/token/send/ethereum")}
            title="Ethereum"
            caption={`${ethBalance} ETH`}
            details={formatDollar(ethUsd)}
            icon={
              <EthereumIcon width={35} height={35} fill={theme.colors.white} />
            }
          />
        </CardView>
        <CardView>
          <CryptoInfoCard
            onPress={() => router.push("/token/send/solana")}
            title="Solana"
            caption={`${solBalance} SOL`}
            details={formatDollar(solUsd)}
            icon={<SolanaIcon width={25} height={25} fill="#14F195" />}
          />
        </CardView>
      </ContentContainer>
    </SafeAreaContainer>
  );
}
