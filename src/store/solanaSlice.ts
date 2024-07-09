import "react-native-get-random-values";
import "@ethersproject/shims";

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import solanaService from "../services/SolanaService";
import { truncateBalance } from "../utils/truncateBalance";
import {
  GeneralStatus,
  AddressState,
  Transaction,
  TransactionConfirmation,
  ConfirmationState,
  WalletState,
} from "./types";

const CONFIRMATION_TIMEOUT = 60000;
const initialState: WalletState = {
  activeIndex: 0,
  addresses: [
    {
      accountName: "",
      derivationPath: "",
      address: "",
      publicKey: "",
      balance: 0,
      failedNetworkRequest: false,
      status: GeneralStatus.Idle,
      transactionConfirmations: [],
      transactionMetadata: {
        paginationKey: undefined,
        transactions: [],
      },
    },
  ],
};

export interface FetchTransactionsArg {
  address: string;
  paginationKey?: string[] | string;
}

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

interface SolTransactionArgs {
  privateKey: Uint8Array;
  address: string;
  amount: string;
}

export const sendSolanaTransaction = createAsyncThunk(
  "solana/sendSolanaTransaction",
  async (
    { privateKey, address, amount }: SolTransactionArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await solanaService.sendTransaction(
        privateKey,
        address,
        parseFloat(amount)
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const confirmSolanaTransaction = createAsyncThunk(
  "wallet/confirmSolanaTransaction",
  async ({ txHash }: { txHash: string }, { rejectWithValue }) => {
    try {
      const confirmationPromise = solanaService.confirmTransaction(txHash);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Transaction confirmation timed out")),
          CONFIRMATION_TIMEOUT
        )
      );

      const confirmation = await Promise.race([
        confirmationPromise,
        timeoutPromise,
      ]);
      return { txHash, confirmation };
    } catch (error) {
      return rejectWithValue({ txHash, error: error.message });
    }
  }
);

export const solanaSlice = createSlice({
  name: "solana",
  initialState,
  reducers: {
    saveSolanaAddresses: (state, action: PayloadAction<AddressState[]>) => {
      state.addresses = [...action.payload];
      state.activeIndex = 0;
    },
    depositSolana: (state, action: PayloadAction<number>) => {
      state.addresses[state.activeIndex].balance += action.payload;
    },
    withdrawSolana: (state, action: PayloadAction<number>) => {
      if (state.addresses[state.activeIndex].balance >= action.payload) {
        state.addresses[state.activeIndex].balance -= action.payload;
      } else {
        console.warn("Not enough Solana balance");
      }
    },
    addSolanaTransaction: (state, action: PayloadAction<Transaction>) => {
      state.addresses[state.activeIndex].transactionMetadata.transactions.push(
        action.payload
      );
    },
    updateSolanaBalance: (state, action: PayloadAction<number>) => {
      state.addresses[state.activeIndex].balance = action.payload;
    },
    updateSolanaAddresses: (state, action: PayloadAction<AddressState>) => {
      state.addresses.push(action.payload);
    },
    // TODO: Refactor. This is an tech debt from redux refactor
    updateSolanaAccountName: (
      state,
      action: PayloadAction<{
        accountName: string;
        solAddress: string;
      }>
    ) => {
      const solAddressIndex = state.addresses.findIndex(
        (item) => item.address === action.payload.solAddress
      );
      if (solAddressIndex !== -1) {
        state.addresses[solAddressIndex].accountName =
          action.payload.accountName;
      }
    },
    // TODO: Refactor. This is an tech debt from redux refactor
    setActiveSolanaAccount: (state, action: PayloadAction<number>) => {
      state.activeIndex = action.payload;
    },
    resetSolanaState: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolanaBalance.pending, (state) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Loading;
      })
      .addCase(fetchSolanaBalance.fulfilled, (state, action) => {
        state.addresses[state.activeIndex].balance = parseFloat(
          truncateBalance(action.payload)
        );
        state.addresses[state.activeIndex].status = GeneralStatus.Idle;
      })
      .addCase(fetchSolanaBalance.rejected, (state, action) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Failed;
        console.error("Failed to fetch balance:", action.payload);
      })
      .addCase(fetchSolanaBalanceInterval.fulfilled, (state, action) => {
        state.addresses[state.activeIndex].balance = parseFloat(
          truncateBalance(action.payload)
        );
        state.addresses[state.activeIndex].status = GeneralStatus.Idle;
      })
      .addCase(fetchSolanaBalanceInterval.rejected, (state, action) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Failed;
        console.error("Failed to fetch balance:", action.payload);
      })
      .addCase(fetchSolanaTransactions.pending, (state) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Loading;
      })
      .addCase(fetchSolanaTransactions.fulfilled, (state, action) => {
        if (action.payload) {
          state.addresses[state.activeIndex].failedNetworkRequest = false;
          state.addresses[state.activeIndex].transactionMetadata.transactions =
            action.payload;
        } else {
          state.addresses[state.activeIndex].failedNetworkRequest = true;
        }
        state.addresses[state.activeIndex].status = GeneralStatus.Idle;
      })
      .addCase(fetchSolanaTransactions.rejected, (state, action) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Failed;
        console.error("Failed to fetch transactions:", action.payload);
      })
      .addCase(fetchSolanaTransactionsInterval.fulfilled, (state, action) => {
        if (action.payload) {
          state.addresses[state.activeIndex].failedNetworkRequest = false;
          state.addresses[state.activeIndex].transactionMetadata.transactions =
            action.payload;
        } else {
          state.addresses[state.activeIndex].failedNetworkRequest = true;
        }
        state.addresses[state.activeIndex].status = GeneralStatus.Idle;
      })
      .addCase(fetchSolanaTransactionsInterval.rejected, (state, action) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Failed;
        console.error("Failed to fetch transactions:", action.payload);
      })
      .addCase(confirmSolanaTransaction.pending, (state, action) => {
        const { txHash } = action.meta.arg;
        const newConfirmation: TransactionConfirmation = {
          txHash,
          status: ConfirmationState.Pending,
        };
        state.addresses[state.activeIndex].transactionConfirmations.push(
          newConfirmation
        );
      })
      .addCase(confirmSolanaTransaction.fulfilled, (state, action) => {
        const { txHash, confirmation } = action.payload;
        const index = state.addresses[
          state.activeIndex
        ].transactionConfirmations.findIndex((tx) => tx.txHash === txHash);
        if (index !== -1) {
          state.addresses[state.activeIndex].transactionConfirmations[
            index
          ].status = confirmation
            ? ConfirmationState.Confirmed
            : ConfirmationState.Failed;
        }
      })
      .addCase(confirmSolanaTransaction.rejected, (state, action) => {
        const { txHash, error } = action.payload as any;
        const index = state.addresses[
          state.activeIndex
        ].transactionConfirmations.findIndex((tx: any) => tx.txHash === txHash);
        if (index !== -1) {
          state.addresses[state.activeIndex].transactionConfirmations[
            index
          ].status = ConfirmationState.Failed;
          state.addresses[state.activeIndex].transactionConfirmations[
            index
          ].error = error;
        }
      })
      .addCase(sendSolanaTransaction.pending, (state) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Loading;
      })
      .addCase(sendSolanaTransaction.fulfilled, (state, action) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Idle;

        state.addresses[state.activeIndex].transactionConfirmations.push({
          txHash: action.payload,
          status: ConfirmationState.Pending,
        });
      })
      .addCase(sendSolanaTransaction.rejected, (state, action) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Failed;
        console.error("Failed to send Solana transaction:", action.payload);
      });
  },
});

export const {
  depositSolana,
  withdrawSolana,
  addSolanaTransaction,
  updateSolanaBalance,
  saveSolanaAddresses,
  resetSolanaState,
  setActiveSolanaAccount,
  updateSolanaAddresses,
  updateSolanaAccountName,
} = solanaSlice.actions;

export default solanaSlice.reducer;
