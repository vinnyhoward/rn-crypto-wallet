import "react-native-get-random-values";
import "@ethersproject/shims";

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as ethers from "ethers";
import { RootState } from "./index";
import ethService from "../services/EthereumService";
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
import { Chains } from "../types";

const CONFIRMATION_TIMEOUT = 60000;
const initialState: WalletState = {
  activeIndex: 0,
  addresses: [],
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

interface EthTransactionArgs {
  address: ethers.AddressLike;
  privateKey: string;
  amount: string;
}

export const sendEthereumTransaction = createAsyncThunk(
  "ethereum/sendTransaction",
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

interface SolTransactionArgs {
  privateKey: Uint8Array;
  address: string;
  amount: string;
}

export const sendSolanaTransaction = createAsyncThunk(
  "solana/sendTransaction",
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

export const confirmTransaction = createAsyncThunk(
  "wallet/confirmTransaction",
  async (
    { txHash, blockchain }: { txHash: string; blockchain: Chains },
    { rejectWithValue }
  ) => {
    const service = blockchain === Chains.Ethereum ? ethService : solanaService;
    try {
      const confirmationPromise = service.confirmTransaction(txHash);
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
      return { txHash, blockchain, confirmation };
    } catch (error) {
      return rejectWithValue({ txHash, blockchain, error: error.message });
    }
  }
);

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    saveEthereumAddresses: (state, action: PayloadAction<AddressState[]>) => {
      state[state.activeIndex].addresses = [...action.payload];
    },
    saveSolanaAddresses: (state, action: PayloadAction<AddressState[]>) => {
      state[state.activeIndex].addresses = [...action.payload];
    },
    depositEthereum: (state, action: PayloadAction<number>) => {
      state[state.activeIndex].balance += action.payload;
    },
    withdrawEthereum: (state, action: PayloadAction<number>) => {
      if (state[state.activeIndex].balance >= action.payload) {
        state[state.activeIndex].balance -= action.payload;
      } else {
        console.warn("Not enough Ethereum balance");
      }
    },
    depositSolana: (state, action: PayloadAction<number>) => {
      state[state.activeIndex].balance += action.payload;
    },
    withdrawSolana: (state, action: PayloadAction<number>) => {
      if (state[state.activeIndex].balance >= action.payload) {
        state[state.activeIndex].balance -= action.payload;
      } else {
        console.warn("Not enough Solana balance");
      }
    },
    addEthereumTransaction: (state, action: PayloadAction<Transaction>) => {
      state[state.activeIndex].transactionMetadata.transactions.push(
        action.payload
      );
    },
    addSolanaTransaction: (state, action: PayloadAction<Transaction>) => {
      state[state.activeIndex].transactionMetadata.transactions.push(
        action.payload
      );
    },
    updateEthereumBalance: (state, action: PayloadAction<string>) => {
      state[state.activeIndex].balance = parseFloat(action.payload);
    },
    updateSolanaBalance: (state, action: PayloadAction<number>) => {
      state[state.activeIndex].balance = action.payload;
    },
    updateSolanaAddresses: (state, action: PayloadAction<AddressState>) => {
      state[state.activeIndex].addresses.push(action.payload);
    },
    updateEthereumAddresses: (state, action: PayloadAction<AddressState>) => {
      state[state.activeIndex].address.push(action.payload);
    },
    updateAccountName: (
      state,
      action: PayloadAction<{
        accountName: string;
        ethAddress: string;
        solAddress: string;
      }>
    ) => {
      const ethAddressIndex = state.addresses.findIndex(
        (item) => item.address === action.payload.ethAddress
      );
      if (ethAddressIndex !== -1) {
        state.addresses[ethAddressIndex].accountName =
          action.payload.accountName;
      }

      const solAddressIndex = state.addresses.findIndex(
        (item) => item.address === action.payload.solAddress
      );
      if (solAddressIndex !== -1) {
        state.addresses[solAddressIndex].accountName =
          action.payload.accountName;
      }
    },
    // TODO: Refactor. This is an tech debt from redux refactor
    setActiveAccount: (state, action: PayloadAction<number>) => {
      state.activeIndex = action.payload;
    },
    resetState: (state) => {
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
      .addCase(confirmTransaction.pending, (state, action) => {
        const { txHash, blockchain } = action.meta.arg;
        const newConfirmation: TransactionConfirmation = {
          txHash,
          status: ConfirmationState.Pending,
        };
        state.addresses[state.activeIndex].transactionConfirmations.push(
          newConfirmation
        );
      })
      .addCase(confirmTransaction.fulfilled, (state, action) => {
        const { txHash, blockchain, confirmation } = action.payload;
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
      .addCase(confirmTransaction.rejected, (state, action) => {
        const { txHash, blockchain, error } = action.payload as any;
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
      });
  },
});

export const {
  depositEthereum,
  withdrawEthereum,
  addEthereumTransaction,
  depositSolana,
  withdrawSolana,
  addSolanaTransaction,
  updateEthereumBalance,
  updateSolanaBalance,
  saveEthereumAddresses,
  saveSolanaAddresses,
  resetState,
  setActiveAccount,
  updateSolanaAddresses,
  updateEthereumAddresses,
  updateAccountName,
} = walletSlice.actions;

export default walletSlice.reducer;
