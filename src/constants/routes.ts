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
  receiveOptions: string;
  ethDetails: string;
  solDetails: string;
  sendEth: string;
  sendSol: string;
  sendConfirmation: string;
  settings: string;
  camera: string;
  accounts: string;
  accountModal: string;
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
  sendOptions: "/token/send/send-options",
  send: "/token/send",
  receiveOptions: "/token/receive/receive-options",
  ethDetails: "/token/ethereum",
  solDetails: "/token/solana",
  sendEth: "/token/send/ethereum",
  sendSol: "/token/send/solana",
  sendConfirmation: "/token/send/send-confirmation",
  settings: "/(app)/settings/settings-modal",
  camera: "/(app)/camera",
  accounts: "/(app)/accounts/accounts",
  accountModal: "/(app)/accounts/account-modal",
};
