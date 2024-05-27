import "react-native-get-random-values";
import "@ethersproject/shims";

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as ethers from "ethers";
import { RootState } from "./index";
import { fetchTransactions, ethProvider } from "../utils/etherHelpers";
import {
  getTransactionsByWallet,
  getSolanaBalance,
} from "../utils/solanaHelpers";
import { truncateBalance } from "../utils/truncateBalance";

interface CryptoWallet {
  balance: number;
  transactionMetadata: {
    paginationKey: string | string[] | undefined;
    transactions: Transaction[];
  };
  status: "idle" | "loading" | "failed";
  address: string;
  publicKey: string;
  failedNetworkRequest: boolean;
}

export interface WalletState {
  ethereum: CryptoWallet;
  solana: CryptoWallet;
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

const initialState: WalletState = {
  ethereum: {
    balance: 0,
    transactionMetadata: {
      paginationKey: undefined,
      transactions: [],
    },
    failedNetworkRequest: false,
    status: "idle",
    address: "",
    publicKey: "",
  },
  solana: {
    balance: 0,
    transactionMetadata: {
      paginationKey: undefined,
      transactions: [],
    },
    failedNetworkRequest: false,
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
      console.error("error", error);
      return rejectWithValue(error.message);
    }
  }
);

export interface FetchTransactionsArg {
  address: string;
  paginationKey?: string[] | string;
}

export const fetchEthereumTransactions = createAsyncThunk(
  "wallet/fetchEthereumTransactions",
  async ({ address }: FetchTransactionsArg, { rejectWithValue }) => {
    try {
      const transactions = await fetchTransactions(address);
      return transactions;
    } catch (error) {
      console.error("error", error);
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
      console.error("error", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSolanaBalance = createAsyncThunk(
  "wallet/fetchSolanaBalance",
  async (tokenAddress: string, { rejectWithValue }): Promise<any> => {
    try {
      const currentSolBalance = await getSolanaBalance(tokenAddress);
      return currentSolBalance;
    } catch (error) {
      console.error("error", error);
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
      state.ethereum.transactionMetadata.transactions.push(action.payload);
    },
    addSolanaTransaction: (state, action: PayloadAction<Transaction>) => {
      state.solana.transactionMetadata.transactions.push(action.payload);
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
        state.ethereum.balance = parseFloat(truncateBalance(action.payload));
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
        if (action.payload) {
          state.ethereum.failedNetworkRequest = false;
          state.ethereum.transactionMetadata.transactions =
            action.payload.transferHistory;
          state.ethereum.transactionMetadata.paginationKey =
            action.payload.paginationKey;
        } else {
          state.ethereum.failedNetworkRequest = true;
        }
        state.ethereum.status = "idle";
      })
      .addCase(fetchEthereumTransactions.rejected, (state, action) => {
        state.ethereum.status = "failed";
        console.error("Failed to fetch transactions:", action.payload);
      })
      .addCase(fetchSolanaBalance.pending, (state) => {
        state.solana.status = "loading";
      })
      .addCase(fetchSolanaBalance.fulfilled, (state, action) => {
        state.solana.balance = parseFloat(truncateBalance(action.payload));
        state.solana.status = "idle";
      })
      .addCase(fetchSolanaBalance.rejected, (state, action) => {
        state.solana.status = "failed";
        console.error("Failed to fetch balance:", action.payload);
      })
      .addCase(fetchSolanaTransactions.pending, (state) => {
        state.solana.status = "loading";
      })
      .addCase(fetchSolanaTransactions.fulfilled, (state, action) => {
        if (action.payload) {
          state.solana.failedNetworkRequest = false;
          state.solana.transactionMetadata.transactions = action.payload;
        } else {
          state.solana.failedNetworkRequest = true;
        }
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
