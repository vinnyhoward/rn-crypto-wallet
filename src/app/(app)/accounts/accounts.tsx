import { useState } from "react";
import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { clearPersistedState } from "../../../store";
import type { RootState, AppDispatch } from "../../../store";
import { clearStorage } from "../../../hooks/use-storage-state";
import { savePhrase } from "../../../hooks/use-storage-state";
import { createEthWalletByIndex } from "../../../utils/etherHelpers";
import { createSolWalletByIndex } from "../../../utils/solanaHelpers";
import { ROUTES } from "../../../constants/routes";
import { ThemeType } from "../../../styles/theme";
import ClearIcon from "../../../assets/svg/clear.svg";
import CloseIcon from "../../../assets/svg/close.svg";
import { SafeAreaContainer } from "../../../components/Styles/Layout.styles";
import Button from "../../../components/Button/Button";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.medium};
`;

const SectionTitle = styled.Text<{ theme: ThemeType }>`
  color: ${(props) => props.theme.fonts.colors.primary};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.title};
  margin-bottom: ${(props) => props.theme.spacing.large};
  text-align: center;
`;

const AccountsIndex = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const ethAccounts = useSelector(
    (state: RootState) => state.wallet.ethereum.inactiveAddresses
  );
  const solAccounts = useSelector(
    (state: RootState) => state.wallet.solana.inactiveAddresses
  );

  const walletSetup = async () => {
    setLoading(true);
  };

  return (
    <>
      <SafeAreaContainer>
        <ContentContainer>
          <SectionTitle></SectionTitle>
          <Button
            loading={loading}
            onPress={walletSetup}
            title="Create Wallet"
            backgroundColor={theme.colors.primary}
          />
        </ContentContainer>
      </SafeAreaContainer>
    </>
  );
};

export default AccountsIndex;
