import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WalletState {
  balance: number;
  transactions: Transaction[];
  status: "idle" | "loading" | "failed";
  address: string;
  publicKey: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
}

const initialState: WalletState = {
  balance: 0,
  transactions: [],
  status: "idle",
  address: "",
  publicKey: "",
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    saveAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    savePublicKey: (state, action: PayloadAction<string>) => {
      state.publicKey = action.payload;
    },
    deposit: (state, action: PayloadAction<number>) => {
      state.balance += action.payload;
    },
    withdraw: (state, action: PayloadAction<number>) => {
      if (state.balance >= action.payload) {
        state.balance -= action.payload;
      } else {
        console.warn("Not enough balance");
      }
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
  },
});

export const { deposit, withdraw, addTransaction, saveAddress, savePublicKey } =
  walletSlice.actions;

export default walletSlice.reducer;
