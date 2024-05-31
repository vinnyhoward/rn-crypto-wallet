export interface AssetTransfer {
  asset: string;
  blockNum: string;
  category:
    | "external"
    | "internal"
    | "erc20"
    | "erc721"
    | "erc1155"
    | "specialnft";
  erc1155Metadata: null | any;
  erc721TokenId: null | string;
  from: string;
  hash: string;
  rawContract: any;
  to: string;
  tokenId: null | string;
  uniqueId: string;
  value: number;
}

export interface AssetTransfersWithMetadataResponse {
  transfers: AssetTransfer[];
}

export interface ErrorResponse {
  errorMessage: string;
}

export enum Chains {
  Ethereum = "ethereum",
  Solana = "solana",
}

type BlockTime = number;

export interface Status {
  Ok: null;
}

export interface Meta {
  computeUnitsConsumed: number;
  err: null;
  fee: number;
  innerInstructions: any[];
  logMessages: string[];
  postBalances: number[];
  postTokenBalances: any[];
  preBalances: number[];
  preTokenBalances: any[];
  rewards: any[];
  status: Status;
}

export interface PublicKeyInfo {
  pubkey: string;
  signer: boolean;
  source: string;
  writable: boolean;
}

export interface Info {
  destination: string;
  lamports: number;
  source: string;
}

export interface Parsed {
  info: Info;
  type: string;
}

export interface Instruction {
  parsed: Parsed;
  program: string;
  programId: string;
  stackHeight: null | number;
}

export interface Message {
  accountKeys: PublicKeyInfo[];
  instructions: Instruction[];
  recentBlockhash: string;
}

export interface Transaction {
  message: Message;
  signatures: string[];
}

export interface TransactionObject {
  blockTime: BlockTime;
  meta: Meta;
  slot: number;
  transaction: Transaction;
}

export interface GenericTransaction {
  uniqueId: string;
  from: string;
  to: string;
  hash: string;
  value: BigInt;
  blockTime: number;
  asset: string;
  direction: string;
}

export interface GenericTransactionFlatList {
  item: {
    uniqueId: string;
    from: string;
    to: string;
    hash: string;
    value: BigInt;
    blockTime: number;
    asset: string;
    direction: string;
  };
}
