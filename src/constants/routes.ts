export interface Routes {
  home: string;
  walletSetup: string;
  walletCreatedSuccessfully: string;
  walletImportOptions: string;
  seedPhrase: string;
  confirmSeedPhrase: string;
  restoreSeedPhrase: string;
  walletImportSeedPhrase: string;
  biometrics: string;
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
  accountNameModal: string;
  confirmation: string;
}

export const ROUTES: Routes = {
  home: "/",
  walletSetup: "(wallet)/setup/wallet-setup",
  walletCreatedSuccessfully: "(wallet)/setup/wallet-created-successfully",
  walletImportOptions: "(wallet)/setup/wallet-import-options",
  seedPhrase: "(wallet)/seed/seed-phrase",
  confirmSeedPhrase: "(wallet)/seed/confirm-seed-phrase",
  restoreSeedPhrase: "(wallet)/seed/restore-seed-phrase",
  walletImportSeedPhrase: "(wallet)/seed/wallet-import-seed-phrase",
  biometrics: "(wallet)/biometrics",
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
  accountNameModal: "/(app)/accounts/account-name-modal",
  confirmation: "/(app)/token/confirmation",
};
