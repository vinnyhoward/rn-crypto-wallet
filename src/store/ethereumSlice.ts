import "react-native-get-random-values";
import "@ethersproject/shims";

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as ethers from "ethers";
import { RootState } from "./index";
import { fetchTransactions, ethProvider } from "../utils/etherHelpers";
import { truncateBalance } from "../utils/truncateBalance";
import type {
  AddressState,
  Transaction,
  AccountState,
  FetchTransactionsArg,
} from "./types";

export interface EthereumWalletState {
  activeAccountName: string;
  ethereum: AccountState;
}

export interface EthereumActiveAccountDetails {
  ethereum: AddressState;
}

const initialState: EthereumWalletState = {
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
      const balance = await ethProvider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("error", error);
      return rejectWithValue(error.message);
    }
  }
);

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

export const fetchEthereumTransactionsInterval = createAsyncThunk(
  "wallet/fetchEthereumTransactionsInterval",
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
    saveAllEthereumAddresses: (
      state,
      action: PayloadAction<AddressState[]>
    ) => {
      state.ethereum.inactiveAddresses = action.payload;
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
    addEthereumTransaction: (state, action: PayloadAction<Transaction>) => {
      state.ethereum.activeAddress.transactionMetadata.transactions.push(
        action.payload
      );
    },
    updateEthereumBalance: (state, action: PayloadAction<string>) => {
      state.ethereum.activeAddress.balance = parseFloat(action.payload);
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

      const isCurrentActiveAccountName =
        state.ethereum.activeAddress.address === action.payload.ethAddress;

      if (isCurrentActiveAccountName) {
        state.activeAccountName = state.activeAccountName =
          action.payload.accountName;
      }
    },
    setActiveAccount: (
      state,
      action: PayloadAction<EthereumActiveAccountDetails>
    ) => {
      state.activeAccountName = action.payload.ethereum.accountName;
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
      .addCase(fetchEthereumBalanceInterval.fulfilled, (state, action) => {
        state.ethereum.activeAddress.balance = parseFloat(
          truncateBalance(action.payload)
        );
        state.ethereum.status = "idle";
      })
      .addCase(fetchEthereumBalanceInterval.rejected, (state, action) => {
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
      .addCase(fetchEthereumTransactionsInterval.fulfilled, (state, action) => {
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
      .addCase(fetchEthereumTransactionsInterval.rejected, (state, action) => {
        state.ethereum.status = "failed";
        console.error("Failed to fetch transactions:", action.payload);
      });
  },
});

export const {
  depositEthereum,
  withdrawEthereum,
  addEthereumTransaction,
  saveAllEthereumAddresses,
  updateEthereumBalance,
  saveEthereumAccountDetails,
  resetState,
  setActiveAccount,
  updateEthereumInactiveAddresses,
  updateAccountName,
} = walletSlice.actions;

export default walletSlice.reducer;
