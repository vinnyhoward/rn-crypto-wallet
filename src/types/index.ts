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
