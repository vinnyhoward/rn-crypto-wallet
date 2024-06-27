export interface AccountState {
  activeAddress: AddressState;
  inactiveAddresses: AddressState[];
  failedNetworkRequest: boolean;
  status: "idle" | "loading" | "failed" | "success";
}

export interface AddressState {
  accountName: string;
  derivationPath: string;
  address: string;
  publicKey: string;
  balance: number;
  transactionMetadata?: TransactionMetadata;
}

export interface TransactionMetadata {
  paginationKey: undefined | string | string[];
  transactions: Transaction[];
}

export interface Transaction {
  uniqueId: string;
  from: string;
  to: string;
  hash: string;
  value: number;
  blockTime: number;
  asset: string;
  direction: string;
}

export enum StatusTypes {
  IDLE = "idle",
  LOADING = "loading",
  FAILED = "failed",
  SUCCESS = "success",
}

export interface FetchTransactionsArg {
  address: string;
  paginationKey?: string[] | string;
}
