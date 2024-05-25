import "react-native-get-random-values";
import "@ethersproject/shims";

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as ethers from "ethers";
import { RootState } from "./index";
import { fetchTransactions } from "../utils/fetchTransactions";
import { ethProvider } from "../utils/etherHelpers";
import { getTransactionsByWallet } from "../utils/solanaHelpers";

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

export const fetchEthereumBalance = createAsyncThunk<
  string,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  "wallet/fetchEthereumBalance",
  async (address: ethers.AddressLike, { rejectWithValue }) => {
    try {
      const balance = await ethProvider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEthereumTransactions = createAsyncThunk(
  "wallet/fetchEthereumTransactions",
  async (address: string, { rejectWithValue }): Promise<any> => {
    try {
      const transactions = await fetchTransactions(address);
      console.log("eth transactions:", transactions);
      return transactions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSolanaTransactions = createAsyncThunk(
  "wallet/fetchSolanaTransactions",
  async (address: string, { rejectWithValue }): Promise<any> => {
    try {
      const transactions = await getTransactionsByWallet(address);
      return transactions;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.message);
    }
  }
);

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
    updateEthereumBalance: (state, action: PayloadAction<string>) => {
      state.ethereum.balance = parseFloat(action.payload);
    },
    updateSolanaBalance: (state, action: PayloadAction<number>) => {
      state.solana.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEthereumBalance.pending, (state) => {
        state.ethereum.status = "loading";
      })
      .addCase(fetchEthereumBalance.fulfilled, (state, action) => {
        state.ethereum.balance = parseFloat(action.payload);
        state.ethereum.status = "idle";
      })
      .addCase(fetchEthereumBalance.rejected, (state, action) => {
        state.ethereum.status = "failed";
        console.error("Failed to fetch balance:", action.payload);
      })
      .addCase(fetchEthereumTransactions.pending, (state) => {
        state.ethereum.status = "loading";
      })
      .addCase(fetchEthereumTransactions.fulfilled, (state, action) => {
        state.ethereum.transactions = action.payload;
        state.ethereum.status = "idle";
      })
      .addCase(fetchEthereumTransactions.rejected, (state, action) => {
        state.ethereum.status = "failed";
        console.error("Failed to fetch transactions:", action.payload);
      })
      .addCase(fetchSolanaTransactions.pending, (state) => {
        state.solana.status = "loading";
      })
      .addCase(fetchSolanaTransactions.fulfilled, (state, action) => {
        state.solana.transactions = action.payload;
        state.solana.status = "idle";
      })
      .addCase(fetchSolanaTransactions.rejected, (state, action) => {
        state.solana.status = "failed";
        console.error("Failed to fetch transactions:", action.payload);
      });
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
  updateEthereumBalance,
  updateSolanaBalance,
} = walletSlice.actions;

export default walletSlice.reducer;
