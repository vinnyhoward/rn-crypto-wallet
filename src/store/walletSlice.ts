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

export interface AddressState {
  accountName: string;
  derivationPath: string;
  address: string;
  publicKey: string;
  balance: number;
  transactionMetadata?: transactionMetadata;
}

export interface transactionMetadata {
  paginationKey: undefined | string | string[];
  transactions: Transaction[];
}

export interface AccountState {
  activeAddress: AddressState;
  inactiveAddresses: AddressState[];
  failedNetworkRequest: boolean;
  status: "idle" | "loading" | "failed" | "success";
}

export interface WalletState {
  activeAccountName: string;
  ethereum: AccountState;
  solana: AccountState;
}

export interface ActiveAccountDetails {
  ethereum: AddressState;
  solana: AddressState;
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
  activeAccountName: "",
  ethereum: {
    activeAddress: {
      accountName: "",
      derivationPath: "",
      address: "",
      publicKey: "",
      balance: 0,
      transactionMetadata: {
        paginationKey: undefined,
        transactions: [],
      },
    },
    inactiveAddresses: [],
    failedNetworkRequest: false,
    status: "idle",
  },
  solana: {
    activeAddress: {
      accountName: "",
      derivationPath: "",
      address: "",
      publicKey: "",
      balance: 0,
      transactionMetadata: {
        paginationKey: undefined,
        transactions: [],
      },
    },
    inactiveAddresses: [],
    failedNetworkRequest: false,
    status: "idle",
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
    saveEthereumAccountDetails: (
      state,
      action: PayloadAction<AddressState>
    ) => {
      state.ethereum.activeAddress = {
        ...action.payload,
        transactionMetadata: {
          paginationKey: undefined,
          transactions: [],
        },
      };
      state.activeAccountName = "Account 1";
    },
    saveSolanaAccountDetails: (state, action: PayloadAction<AddressState>) => {
      state.solana.activeAddress = {
        ...action.payload,
        transactionMetadata: {
          paginationKey: undefined,
          transactions: [],
        },
      };
      state.activeAccountName = "Account 1";
    },
    saveAllEthereumAddresses: (
      state,
      action: PayloadAction<AddressState[]>
    ) => {
      state.ethereum.inactiveAddresses = action.payload;
    },
    saveAllSolanaAddresses: (state, action: PayloadAction<AddressState[]>) => {
      state.solana.inactiveAddresses = action.payload;
    },
    depositEthereum: (state, action: PayloadAction<number>) => {
      state.ethereum.activeAddress.balance += action.payload;
    },
    withdrawEthereum: (state, action: PayloadAction<number>) => {
      if (state.ethereum.activeAddress.balance >= action.payload) {
        state.ethereum.activeAddress.balance -= action.payload;
      } else {
        console.warn("Not enough Ethereum balance");
      }
    },
    depositSolana: (state, action: PayloadAction<number>) => {
      state.solana.activeAddress.balance += action.payload;
    },
    withdrawSolana: (state, action: PayloadAction<number>) => {
      if (state.solana.activeAddress.balance >= action.payload) {
        state.solana.activeAddress.balance -= action.payload;
      } else {
        console.warn("Not enough Solana balance");
      }
    },
    addEthereumTransaction: (state, action: PayloadAction<Transaction>) => {
      state.ethereum.activeAddress.transactionMetadata.transactions.push(
        action.payload
      );
    },
    addSolanaTransaction: (state, action: PayloadAction<Transaction>) => {
      state.solana.activeAddress.transactionMetadata.transactions.push(
        action.payload
      );
    },
    updateEthereumBalance: (state, action: PayloadAction<string>) => {
      state.ethereum.activeAddress.balance = parseFloat(action.payload);
    },
    updateSolanaBalance: (state, action: PayloadAction<number>) => {
      state.solana.activeAddress.balance = action.payload;
    },
    updateSolanaInactiveAddresses: (
      state,
      action: PayloadAction<AddressState>
    ) => {
      state.solana.inactiveAddresses.push(action.payload);
    },
    updateEthereumInactiveAddresses: (
      state,
      action: PayloadAction<AddressState>
    ) => {
      state.ethereum.inactiveAddresses.push(action.payload);
    },
    updateAccountName: (
      state,
      action: PayloadAction<{
        accountName: string;
        ethAddress: string;
        solAddress: string;
      }>
    ) => {
      const ethAddressIndex = state.ethereum.inactiveAddresses.findIndex(
        (item) => item.address === action.payload.ethAddress
      );
      if (ethAddressIndex !== -1) {
        state.ethereum.inactiveAddresses[ethAddressIndex].accountName =
          action.payload.accountName;
      }

      const solAddressIndex = state.solana.inactiveAddresses.findIndex(
        (item) => item.address === action.payload.solAddress
      );
      if (solAddressIndex !== -1) {
        state.solana.inactiveAddresses[solAddressIndex].accountName =
          action.payload.accountName;
      }
      const isCurrentActiveAccountName =
        state.ethereum.activeAddress.address === action.payload.ethAddress;

      if (isCurrentActiveAccountName) {
        state.activeAccountName = state.activeAccountName =
          action.payload.accountName;
      }
    },
    setActiveAccount: (state, action: PayloadAction<ActiveAccountDetails>) => {
      state.activeAccountName = action.payload.ethereum.accountName;
      state.solana.activeAddress = {
        ...action.payload.solana,
        transactionMetadata: {
          paginationKey: undefined,
          transactions: [],
        },
      };
      state.ethereum.activeAddress = {
        ...action.payload.ethereum,
        transactionMetadata: {
          paginationKey: undefined,
          transactions: [],
        },
      };
    },
    resetState: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEthereumBalance.pending, (state) => {
        state.ethereum.status = "loading";
      })
      .addCase(fetchEthereumBalance.fulfilled, (state, action) => {
        state.ethereum.activeAddress.balance = parseFloat(
          truncateBalance(action.payload)
        );
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
          state.ethereum.activeAddress.transactionMetadata.transactions =
            action.payload.transferHistory;
          state.ethereum.activeAddress.transactionMetadata.paginationKey =
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
        state.solana.activeAddress.balance = parseFloat(
          truncateBalance(action.payload)
        );
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
          state.solana.activeAddress.transactionMetadata.transactions =
            action.payload;
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
  saveAllEthereumAddresses,
  depositSolana,
  saveAllSolanaAddresses,
  withdrawSolana,
  addSolanaTransaction,
  updateEthereumBalance,
  updateSolanaBalance,
  saveEthereumAccountDetails,
  saveSolanaAccountDetails,
  resetState,
  setActiveAccount,
  updateSolanaInactiveAddresses,
  updateEthereumInactiveAddresses,
  updateAccountName,
} = walletSlice.actions;

export default walletSlice.reducer;
