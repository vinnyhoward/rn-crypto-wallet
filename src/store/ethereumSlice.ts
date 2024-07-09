import "react-native-get-random-values";
import "@ethersproject/shims";

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as ethers from "ethers";
import { RootState } from "./index";
import ethService from "../services/EthereumService";

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
      const balance = await ethService.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("error", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEthereumBalanceInterval = createAsyncThunk<
  string,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  "wallet/fetchEthereumBalanceInterval",
  async (address: ethers.AddressLike, { rejectWithValue }) => {
    try {
      const balance = await ethService.getBalance(address);
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
      const transactions = await ethService.fetchTransactions(address);
      return transactions;
    } catch (error) {
      console.error("error", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEthereumTransactionsInterval = createAsyncThunk(
  "wallet/fetchEthereumTransactionsInterval",
  async ({ address }: FetchTransactionsArg, { rejectWithValue }) => {
    try {
      const transactions = await ethService.fetchTransactions(address);
      return transactions;
    } catch (error) {
      console.error("error", error);
      return rejectWithValue(error.message);
    }
  }
);
interface EthTransactionArgs {
  address: ethers.AddressLike;
  privateKey: string;
  amount: string;
}

export const sendEthereumTransaction = createAsyncThunk(
  "ethereum/sendEthereumTransaction",
  async (
    { address, privateKey, amount }: EthTransactionArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await ethService.sendTransaction(
        address,
        privateKey,
        amount
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const confirmEthereumTransaction = createAsyncThunk(
  "wallet/confirmEthereumTransaction",
  async ({ txHash }: { txHash: string }, { rejectWithValue }) => {
    try {
      const confirmationPromise = ethService.confirmTransaction(txHash);
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

export const ethereumSlice = createSlice({
  name: "ethereum",
  initialState,
  reducers: {
    saveEthereumAddresses: (state, action: PayloadAction<AddressState[]>) => {
      state.addresses = [...action.payload];
      state.activeIndex = 0;
    },
    depositEthereum: (state, action: PayloadAction<number>) => {
      state.addresses[state.activeIndex].balance += action.payload;
    },
    withdrawEthereum: (state, action: PayloadAction<number>) => {
      if (state.addresses[state.activeIndex].balance >= action.payload) {
        state.addresses[state.activeIndex].balance -= action.payload;
      } else {
        console.warn("Not enough Ethereum balance");
      }
    },
    addEthereumTransaction: (state, action: PayloadAction<Transaction>) => {
      state.addresses[state.activeIndex].transactionMetadata.transactions.push(
        action.payload
      );
    },
    updateEthereumBalance: (state, action: PayloadAction<string>) => {
      state.addresses[state.activeIndex].balance = parseFloat(action.payload);
    },
    updateEthereumAddresses: (state, action: PayloadAction<AddressState>) => {
      state.addresses.push(action.payload);
    },
    updateAccountName: (
      state,
      action: PayloadAction<{
        accountName: string;
        ethAddress: string;
      }>
    ) => {
      const ethAddressIndex = state.addresses.findIndex(
        (item) => item.address === action.payload.ethAddress
      );
      if (ethAddressIndex !== -1) {
        state.addresses[ethAddressIndex].accountName =
          action.payload.accountName;
      }
    },
    // TODO: Refactor. This is an tech debt from redux refactor
    setActiveEthereumAccount: (state, action: PayloadAction<number>) => {
      state.activeIndex = action.payload;
    },
    resetEthereumState: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEthereumBalance.pending, (state) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Loading;
      })
      .addCase(fetchEthereumBalance.fulfilled, (state, action) => {
        state.addresses[state.activeIndex].balance = parseFloat(
          truncateBalance(action.payload)
        );
        state.addresses[state.activeIndex].status = GeneralStatus.Idle;
      })
      .addCase(fetchEthereumBalance.rejected, (state, action) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Failed;
        console.error("Failed to fetch balance:", action.payload);
      })
      .addCase(fetchEthereumBalanceInterval.fulfilled, (state, action) => {
        state.addresses[state.activeIndex].balance = parseFloat(
          truncateBalance(action.payload)
        );
        state.addresses[state.activeIndex].status = GeneralStatus.Idle;
      })
      .addCase(fetchEthereumBalanceInterval.rejected, (state, action) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Failed;
        console.error("Failed to fetch balance:", action.payload);
      })
      .addCase(fetchEthereumTransactions.pending, (state) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Loading;
      })
      .addCase(fetchEthereumTransactions.fulfilled, (state, action) => {
        if (action.payload) {
          state.addresses[state.activeIndex].failedNetworkRequest = false;
          state.addresses[state.activeIndex].transactionMetadata.transactions =
            action.payload.transferHistory;
          state.addresses[state.activeIndex].transactionMetadata.paginationKey =
            action.payload.paginationKey;
        } else {
          state.addresses[state.activeIndex].failedNetworkRequest = true;
        }
        state.addresses[state.activeIndex].status = GeneralStatus.Idle;
      })
      .addCase(fetchEthereumTransactions.rejected, (state, action) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Failed;
        console.error("Failed to fetch transactions:", action.payload);
      })
      .addCase(fetchEthereumTransactionsInterval.fulfilled, (state, action) => {
        if (action.payload) {
          state.addresses[state.activeIndex].failedNetworkRequest = false;
          state.addresses[state.activeIndex].transactionMetadata.transactions =
            action.payload.transferHistory;
          state.addresses[state.activeIndex].transactionMetadata.paginationKey =
            action.payload.paginationKey;
        } else {
          state.addresses[state.activeIndex].failedNetworkRequest = true;
        }
        state.addresses[state.activeIndex].status = GeneralStatus.Idle;
      })
      .addCase(fetchEthereumTransactionsInterval.rejected, (state, action) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Failed;
        console.error("Failed to fetch transactions:", action.payload);
      })
      .addCase(confirmEthereumTransaction.pending, (state, action) => {
        const { txHash } = action.meta.arg;
        const newConfirmation: TransactionConfirmation = {
          txHash,
          status: ConfirmationState.Pending,
        };
        state.addresses[state.activeIndex].transactionConfirmations.push(
          newConfirmation
        );
      })
      .addCase(confirmEthereumTransaction.fulfilled, (state, action) => {
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
      .addCase(confirmEthereumTransaction.rejected, (state, action) => {
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
      .addCase(sendEthereumTransaction.pending, (state) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Loading;
      })
      .addCase(sendEthereumTransaction.fulfilled, (state, action) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Idle;

        state.addresses[state.activeIndex].transactionConfirmations.push({
          txHash: action.payload.hash,
          status: ConfirmationState.Pending,
        });
      })
      .addCase(sendEthereumTransaction.rejected, (state, action) => {
        state.addresses[state.activeIndex].status = GeneralStatus.Failed;
        console.error("Failed to send transaction:", action.payload);
      });
  },
});

export const {
  depositEthereum,
  withdrawEthereum,
  addEthereumTransaction,
  updateEthereumBalance,
  saveEthereumAddresses,
  resetEthereumState,
  setActiveEthereumAccount,
  updateEthereumAddresses,
  updateAccountName,
} = ethereumSlice.actions;

export default ethereumSlice.reducer;
