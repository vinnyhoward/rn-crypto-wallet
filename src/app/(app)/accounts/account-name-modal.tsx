import { useState } from "react";
import { Keyboard } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useSelector, useDispatch } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import type { ThemeType } from "../../../styles/theme";
import type { RootState } from "../../../store";
import type { AddressState } from "../../../store/types";
import { updateAccountName } from "../../../store/ethereumSlice";
import { updateSolanaAccountName } from "../../../store/solanaSlice";
import { SafeAreaContainer } from "../../../components/Styles/Layout.styles";
import {
  ErrorText,
  ErrorTextContainer,
} from "../../../components/Styles/Errors.styles";

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.medium};
`;

const AccountInput = styled.TextInput<{
  theme: ThemeType;
  isWalletNameFocused: boolean;
}>`
  height: 60px;
  background-color: ${({ theme }) => theme.colors.lightDark};
  padding: ${({ theme }) => theme.spacing.medium};
  border: 1px solid
    ${({ theme, isWalletNameFocused }) =>
      isWalletNameFocused ? theme.colors.primary : theme.colors.grey};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  color: ${({ theme }) => theme.fonts.colors.primary};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  font-family: ${(props) => props.theme.fonts.families.openRegular};
`;

const AccountsNameModal = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { ethAddress, solAddress } = useLocalSearchParams();

  const ethereumAccount = useSelector((state: RootState) =>
    state.ethereum.addresses.find(
      (item: AddressState) => item.address === ethAddress
    )
  );
  const solanaAccount = useSelector((state: RootState) =>
    state.solana.addresses.find(
      (item: AddressState) => item.address === solAddress
    )
  );
  const name = ethereumAccount.accountName ?? solanaAccount.accountName;
  const [accountNameValue, setAccountNameValue] = useState(name);
  const [isWalletNameFocused, setWalletNameFocused] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleNameChange = () => {
    Keyboard.dismiss();
    setErrorText("");
    if (accountNameValue.length >= 27) {
      return setErrorText("Wallet name is too long");
    }
    dispatch(
      updateSolanaAccountName({
        accountName: accountNameValue,
        solAddress: solanaAccount.address,
      })
    );
    dispatch(
      updateAccountName({
        accountName: accountNameValue,
        ethAddress: ethereumAccount.address,
      })
    );
  };

  return (
    <>
      <SafeAreaContainer>
        <ContentContainer>
          <AccountInput
            isWalletNameFocused={isWalletNameFocused}
            autoCapitalize="none"
            multiline
            returnKeyType="done"
            value={accountNameValue}
            readOnly={false}
            onChangeText={setAccountNameValue}
            placeholderTextColor={theme.colors.grey}
            blurOnSubmit
            onFocus={() => setWalletNameFocused(true)}
            onEndEditing={() => setWalletNameFocused(false)}
            onSubmitEditing={() => handleNameChange()}
          />
          {errorText && (
            <ErrorTextContainer>
              <ErrorText>{errorText}</ErrorText>
            </ErrorTextContainer>
          )}
        </ContentContainer>
      </SafeAreaContainer>
    </>
  );
};

export default AccountsNameModal;
