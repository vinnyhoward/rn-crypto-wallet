export interface Routes {
  home: string;
  walletSetup: string;
  wallet: string;
  seedPhrase: string;
  confirmSeedPhrase: string;
  restoreSeedPhrase: string;
  restoreWallet: string;
  walletCreatedSuccessfully: string;
  walletImportOptions: string;
  walletImportSeedPhrase: string;
  sendOptions: string;
  send: string;
  receive: string;
  tokenDetails: string;
  settings: string;
}

export const ROUTES: Routes = {
  home: "/",
  walletSetup: "(wallet)/wallet-setup",
  wallet: "(wallet)/wallet",
  seedPhrase: "(wallet)/seed-phrase",
  confirmSeedPhrase: "(wallet)/confirm-seed-phrase",
  restoreSeedPhrase: "(wallet)/restore-seed-phrase",
  restoreWallet: "(wallet)/restore-wallet",
  walletCreatedSuccessfully: "(wallet)/wallet-created-successfully",
  walletImportOptions: "(wallet)/wallet-import-options",
  walletImportSeedPhrase: "(wallet)/wallet-import-seed-phrase",
  sendOptions: "token/send-options",
  send: "token/send",
  receive: "token/receive",
  tokenDetails: "token/ethereum",
  settings: "(app)/settings/settings-modal",
};
