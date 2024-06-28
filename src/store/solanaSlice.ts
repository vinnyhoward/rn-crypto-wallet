import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import solanaService from "../services/SolanaService";
import { truncateBalance } from "../utils/truncateBalance";
import type { AddressState, Transaction } from "./types";
// TODO: File is current a WIP - Splitting walletSlice into two
export interface SolWalletState {
  activeAddress: AddressState;
}

const initialState: SolWalletState = {
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
    addresses: [],
    failedNetworkRequest: false,
    status: "idle",
  },
};

export const fetchSolanaTransactions = createAsyncThunk(
  "wallet/fetchSolanaTransactions",
  async (address: string, { rejectWithValue }): Promise<any> => {
    try {
      const transactions = await solanaService.getTransactionsByWallet(address);
      return transactions;
    } catch (error) {
      console.error("error", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSolanaTransactionsInterval = createAsyncThunk(
  "wallet/fetchSolanaTransactionsInterval",
  async (address: string, { rejectWithValue }): Promise<any> => {
    try {
      const transactions = await solanaService.getTransactionsByWallet(address);
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
      const currentSolBalance = await solanaService.getBalance(tokenAddress);
      return currentSolBalance;
    } catch (error) {
      console.error("error", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSolanaBalanceInterval = createAsyncThunk(
  "wallet/fetchSolanaBalanceInterval",
  async (tokenAddress: string, { rejectWithValue }): Promise<any> => {
    try {
      const currentSolBalance = await solanaService.getBalance(tokenAddress);
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
    saveAllSolanaAddresses: (state, action: PayloadAction<AddressState[]>) => {
      state.solana.inactiveAddresses = action.payload;
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
    addSolanaTransaction: (state, action: PayloadAction<Transaction>) => {
      state.solana.activeAddress.transactionMetadata.transactions.push(
        action.payload
      );
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
    updateAccountName: (
      state,
      action: PayloadAction<{
        accountName: string;
        ethAddress: string;
        solAddress: string;
      }>
    ) => {
      const solAddressIndex = state.solana.inactiveAddresses.findIndex(
        (item) => item.address === action.payload.solAddress
      );
      if (solAddressIndex !== -1) {
        state.solana.inactiveAddresses[solAddressIndex].accountName =
          action.payload.accountName;
      }
      const isCurrentActiveAccountName =
        state.solana.activeAddress.address === action.payload.solAddress;

      if (isCurrentActiveAccountName) {
        state.activeAccountName = state.activeAccountName =
          action.payload.accountName;
      }
    },
    setActiveAccount: (
      state,
      action: PayloadAction<SolActiveAccountDetails>
    ) => {
      state.activeAccountName = action.payload.solana.accountName;
      state.solana.activeAddress = {
        ...action.payload.solana,
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
      .addCase(fetchSolanaBalanceInterval.fulfilled, (state, action) => {
        state.solana.activeAddress.balance = parseFloat(
          truncateBalance(action.payload)
        );
        state.solana.status = "idle";
      })
      .addCase(fetchSolanaBalanceInterval.rejected, (state, action) => {
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
      })
      .addCase(fetchSolanaTransactionsInterval.fulfilled, (state, action) => {
        if (action.payload) {
          state.solana.failedNetworkRequest = false;
          state.solana.activeAddress.transactionMetadata.transactions =
            action.payload;
        } else {
          state.solana.failedNetworkRequest = true;
        }
        state.solana.status = "idle";
      })
      .addCase(fetchSolanaTransactionsInterval.rejected, (state, action) => {
        state.solana.status = "failed";
        console.error("Failed to fetch transactions:", action.payload);
      });
  },
});

export const {
  depositSolana,
  saveAllSolanaAddresses,
  withdrawSolana,
  addSolanaTransaction,
  updateSolanaBalance,
  saveSolanaAccountDetails,
  resetState,
  setActiveAccount,
  updateSolanaInactiveAddresses,
  updateAccountName,
} = walletSlice.actions;

export default walletSlice.reducer;
