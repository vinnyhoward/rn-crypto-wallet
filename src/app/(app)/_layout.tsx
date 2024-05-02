global.Buffer = require("buffer").Buffer;

import { useState, useEffect } from "react";
import { Redirect, Stack, router } from "expo-router";
import { useSelector } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { Link } from "expo-router";
import type { RootState } from "../../store";
import { ROUTES } from "../../constants/routes";
import SettingsIcon from "../../assets/svg/settings.svg";
import LeftIcon from "../../assets/svg/left-arrow.svg";
import CloseIcon from "../../assets/svg/close.svg";
import { getSeedPhraseConfirmation } from "../../hooks/use-storage-state";

const IconTouchContainer = styled.TouchableOpacity`
  padding: 10px;
`;

export default function AppLayout() {
  const theme = useTheme();
  const ethWallet = useSelector((state: RootState) => state.wallet.ethereum);
  const solWallet = useSelector((state: RootState) => state.wallet.solana);
  const [seedPhraseConfirmed, setSeedPhraseConfirmed] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const loadSeedPhraseConfirmation = async () => {
      const confirmation = await getSeedPhraseConfirmation();
      setSeedPhraseConfirmed(confirmation);
    };

    loadSeedPhraseConfirmation();
  }, []);

  if (seedPhraseConfirmed === null) {
    return null;
  }

  if (!seedPhraseConfirmed) {
    return <Redirect href={ROUTES.seedPhrase} />;
  }

  if (!ethWallet.address || !solWallet.address) {
    return <Redirect href={ROUTES.walletSetup} />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerTransparent: true,
          gestureEnabled: true,
          headerLeft: () => (
            <Link href={ROUTES.settings}>
              <SettingsIcon
                width={25}
                height={25}
                fill={theme.colors.primary}
              />
            </Link>
          ),
        }}
      >
        <Stack.Screen
          name="token/[id]"
          options={{
            headerShown: true,
            headerTransparent: true,
            gestureEnabled: true,
            headerLeft: () => (
              <IconTouchContainer onPress={() => router.back()}>
                <LeftIcon width={25} height={25} fill={theme.colors.primary} />
              </IconTouchContainer>
            ),
          }}
        />
        <Stack.Screen
          name="token/send-options"
          options={{
            headerShown: true,
            headerTransparent: true,
            gestureEnabled: true,
            presentation: "modal",
            headerLeft: () => (
              <IconTouchContainer onPress={() => router.back()}>
                <CloseIcon width={25} height={25} fill={theme.colors.primary} />
              </IconTouchContainer>
            ),
          }}
        />
        <Stack.Screen
          name="token/send/[send]"
          options={{
            headerShown: true,
            headerTransparent: true,
            gestureEnabled: true,
            presentation: "modal",
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="token/send/send-confirmation"
          options={{
            headerShown: true,
            headerTransparent: true,
            gestureEnabled: true,
            presentation: "modal",
            headerLeft: () => (
              <IconTouchContainer onPress={() => router.back()}>
                <LeftIcon width={25} height={25} fill={theme.colors.primary} />
              </IconTouchContainer>
            ),
          }}
        />
        <Stack.Screen
          name="token/receive"
          options={{
            headerShown: true,
            headerTransparent: true,
            gestureEnabled: true,
            presentation: "modal",
            headerLeft: () => (
              <IconTouchContainer onPress={() => router.back()}>
                <CloseIcon width={25} height={25} fill={theme.colors.primary} />
              </IconTouchContainer>
            ),
          }}
        />
        <Stack.Screen
          name="settings/settings-modal"
          options={{
            headerShown: false,
            headerTransparent: true,
            gestureEnabled: true,
            presentation: "modal",
            headerLeft: null,
          }}
        />
      </Stack>
    </>
  );
}
