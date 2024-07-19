import { Chains } from "../types";

export enum GeneralStatus {
  Idle = "idle",
  Loading = "loading",
  Failed = "failed",
  Success = "success",
}

export enum ConfirmationState {
  Pending = "pending",
  Confirmed = "confirmed",
  Failed = "failed",
}

export interface AddressState {
  accountName: string;
  derivationPath: string;
  address: string;
  publicKey: string;
  balance: number;
  transactionMetadata?: TransactionMetadata;
  failedNetworkRequest: boolean;
  status: GeneralStatus;
  transactionConfirmations: TransactionConfirmation[];
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

export interface FetchTransactionsArg {
  address: string;
  paginationKey?: string[] | string;
}

export interface TransactionConfirmation {
  txHash: string;
  status: ConfirmationState;
  error?: string;
}

export interface WalletState {
  activeIndex: number | null;
  addresses: AddressState[];
}
