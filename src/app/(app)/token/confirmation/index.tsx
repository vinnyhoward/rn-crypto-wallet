import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { Image } from "expo-image";
import styled, { useTheme } from "styled-components/native";
import { useSelector } from "react-redux";
import { View } from "moti";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { ThemeType } from "../../../../styles/theme";
import { LinearGradientBackground } from "../../../../components/Styles/Gradient";
import Loader from "../../../../components/Loader/CleanArcSpinner";
import { confirmEthereumTransaction } from "../../../../store/ethereumSlice";
import { confirmSolanaTransaction } from "../../../../store/solanaSlice";
import { ConfirmationState } from "../../../../store/types";
import { RootState } from "../../../../store";
import { Chains } from "../../../../types";
import Button from "../../../../components/Button/Button";
import WalletIcon from "../../../../assets/svg/wallet.svg";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-end;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.large};
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const Title = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: 32px;
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.small};
  text-align: center;
`;

const Subtitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

const ButtonContainer = styled.View<{ theme: ThemeType }>`
  padding-left: ${(props) => props.theme.spacing.large};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-bottom: ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.small};
`;

const ExpoImage = styled(Image)`
  flex: 1;
  width: 100%;
`;

const ImageContainer = styled(View)<{ theme: ThemeType }>`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const LoaderContainer = styled.View<{ theme: ThemeType }>`
  margin-top: ${(props) => props.theme.spacing.large};
`;

export default function Confirmation() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { txHash, blockchain } = useLocalSearchParams();

  const chain = blockchain as string;
  const activeIndex = useSelector(
    (state: RootState) => state[chain].activeIndex
  );

  const transactionConfirmation = useSelector((state: RootState) =>
    state[chain].addresses[activeIndex].transactionConfirmations.find(
      (tx) => tx.txHash === txHash
    )
  );

  useEffect(() => {
    if (txHash && blockchain) {
      if (blockchain === Chains.Ethereum) {
        dispatch(
          confirmEthereumTransaction({
            txHash: txHash as string,
          })
        );
      }

      if (blockchain === Chains.Solana) {
        dispatch(
          confirmSolanaTransaction({
            txHash: txHash as string,
          })
        );
      }
    }
  }, [txHash, blockchain, dispatch]);

  const getStatusContent = (status: ConfirmationState) => {
    switch (status) {
      case ConfirmationState.Pending:
        return (
          <>
            <Title>Confirming your transaction...</Title>
            <LoaderContainer>
              <Loader size={50} color={theme.colors.white} />
            </LoaderContainer>
          </>
        );
      case ConfirmationState.Confirmed:
        return (
          <>
            <Title>Transaction Complete!</Title>
            <Subtitle>
              Woohoo! Your digital assets just took a successful journey through
              the blockchain.
            </Subtitle>
          </>
        );
      case ConfirmationState.Failed:
        return (
          <>
            <Title>Transaction Error</Title>
            <Subtitle>
              Looks like something went wrong. Please try again
            </Subtitle>
          </>
        );
      default:
        return (
          <>
            <Title>Preparing for Liftoff</Title>
            <Subtitle>
              Initializing blockchain communication... Standby for crypto magic!
            </Subtitle>
          </>
        );
    }
  };

  return (
    <LinearGradientBackground colors={theme.colors.primaryLinearGradient}>
      <SafeAreaContainer>
        <ContentContainer>
          <ImageContainer>
            <ExpoImage
              source={require("../../../../assets/images/wallet.png")}
              contentFit="cover"
            />
          </ImageContainer>
          <TextContainer>
            {getStatusContent(transactionConfirmation.status)}
          </TextContainer>
        </ContentContainer>
        <ButtonContainer>
          <Button
            linearGradient={theme.colors.secondaryLinearGradient}
            onPress={() => router.replace("/")}
            title="Back to Wallet"
            icon={
              <WalletIcon width={25} height={25} fill={theme.colors.white} />
            }
          />
        </ButtonContainer>
      </SafeAreaContainer>
    </LinearGradientBackground>
  );
}
