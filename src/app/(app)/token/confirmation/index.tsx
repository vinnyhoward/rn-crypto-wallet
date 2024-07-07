import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { Image } from "expo-image";
import styled from "styled-components/native";
import { View } from "moti";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { ThemeType } from "../../../../styles/theme";
import { confirmEthereumTransaction } from "../../../../store/ethereumSlice";
import { confirmSolanaTransaction } from "../../../../store/solanaSlice";
import { ConfirmationState } from "../../../../store/types";
import { Chains } from "../../../../types";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
  justify-content: flex-end;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.large};
`;

const Title = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: 32px;
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.small};
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
const SecondaryButtonContainer = styled.TouchableOpacity`
  padding: 10px 20px;
  border-radius: 5px;
  align-items: center;
  height: 60px;
  justify-content: center;
  width: 100%;
  border-radius: ${(props) => props.theme.borderRadius.large};
`;

const SecondaryButtonText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

export default function Confirmation() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { txHash, blockchain } = useLocalSearchParams();

  const transactionConfirmation = {
    status: ConfirmationState.Pending,
    error: "Poop",
  };

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

  useEffect(() => {
    if (
      transactionConfirmation?.status === ConfirmationState.Confirmed ||
      transactionConfirmation?.status === ConfirmationState.Failed
    ) {
      setTimeout(() => router.replace("/"), 3000);
    }
  }, [transactionConfirmation, router]);

  const getStatusMessage = () => {
    switch (transactionConfirmation?.status) {
      case ConfirmationState.Pending:
        return "Transaction is being confirmed...";
      case ConfirmationState.Confirmed:
        return "Transaction confirmed successfully!";
      case ConfirmationState.Failed:
        return `Transaction failed: ${
          transactionConfirmation.error || "Unknown error"
        }`;
      default:
        return "Waiting for transaction...";
    }
  };

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <ImageContainer>
          <ExpoImage
            source={require("../../../../assets/images/confirmation.png")}
            contentFit="cover"
          />
        </ImageContainer>
        <TextContainer>
          <Title>Transaction Status</Title>
          <Subtitle>{getStatusMessage()}</Subtitle>
        </TextContainer>
      </ContentContainer>
      <ButtonContainer>
        <SecondaryButtonContainer onPress={() => router.replace("/")}>
          <SecondaryButtonText>Back to Wallet</SecondaryButtonText>
        </SecondaryButtonContainer>
      </ButtonContainer>
    </SafeAreaContainer>
  );
}
