import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CryptoWallet {
  balance: number;
  transactions: Transaction[];
  status: "idle" | "loading" | "failed";
  address: string;
  publicKey: string;
}

export interface WalletState {
  ethereum: CryptoWallet;
  solana: CryptoWallet;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
}

const initialState: WalletState = {
  ethereum: {
    balance: 0,
    transactions: [],
    status: "idle",
    address: "",
    publicKey: "",
  },
  solana: {
    balance: 0,
    transactions: [],
    status: "idle",
    address: "",
    publicKey: "",
  },
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    saveEthereumAddress: (state, action: PayloadAction<string>) => {
      state.ethereum.address = action.payload;
    },
    saveSolanaAddress: (state, action: PayloadAction<string>) => {
      state.solana.address = action.payload;
    },
    saveEthereumPublicKey: (state, action: PayloadAction<string>) => {
      state.ethereum.publicKey = action.payload;
    },
    saveSolanaPublicKey: (state, action: PayloadAction<string>) => {
      state.solana.publicKey = action.payload;
    },
    depositEthereum: (state, action: PayloadAction<number>) => {
      state.ethereum.balance += action.payload;
    },
    withdrawEthereum: (state, action: PayloadAction<number>) => {
      if (state.ethereum.balance >= action.payload) {
        state.ethereum.balance -= action.payload;
      } else {
        console.warn("Not enough Ethereum balance");
      }
    },
    depositSolana: (state, action: PayloadAction<number>) => {
      state.solana.balance += action.payload;
    },
    withdrawSolana: (state, action: PayloadAction<number>) => {
      if (state.solana.balance >= action.payload) {
        state.solana.balance -= action.payload;
      } else {
        console.warn("Not enough Solana balance");
      }
    },
    addEthereumTransaction: (state, action: PayloadAction<Transaction>) => {
      state.ethereum.transactions.push(action.payload);
    },
    addSolanaTransaction: (state, action: PayloadAction<Transaction>) => {
      state.solana.transactions.push(action.payload);
    },
  },
});

export const {
  depositEthereum,
  withdrawEthereum,
  addEthereumTransaction,
  saveEthereumAddress,
  saveEthereumPublicKey,
  depositSolana,
  withdrawSolana,
  addSolanaTransaction,
  saveSolanaAddress,
  saveSolanaPublicKey,
} = walletSlice.actions;

export default walletSlice.reducer;
