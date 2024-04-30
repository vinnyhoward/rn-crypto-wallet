import "react-native-get-random-values";
import "@ethersproject/shims";

import { combineReducers } from "redux";
import {
  configureStore,
  Middleware,
  PayloadAction,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import walletReducer from "./walletSlice";
import * as ethers from "ethers";

const persistConfig = {
  key: "root",
  // TODO: Remove this in favor of a more secure storage.
  // This is for development purposes only.
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  wallet: walletReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const { EXPO_PUBLIC_ALCHEMY_KEY, EXPO_PUBLIC_ALCHEMY_SOCKET_URL } = process.env;
const ethWebSocketUrl =
  EXPO_PUBLIC_ALCHEMY_SOCKET_URL + EXPO_PUBLIC_ALCHEMY_KEY;

export const webSocketMiddleware: Middleware =
  (store) =>
  (next) =>
  (action: PayloadAction<string> | PayloadAction<number>) => {
    next(action);

    if (action.type === "wallet/saveEthereumAddress") {
      const state = store.getState();
      const { ethereum } = state.wallet;

      const provider = new ethers.WebSocketProvider(ethWebSocketUrl);

      provider.on("block", async () => {
        const balance = await provider.getBalance(ethereum.address);
        store.dispatch({
          type: "wallet/updateEthereumBalance",
          payload: ethers.formatEther(balance),
        });
      });

      return () => provider.removeAllListeners();
    }
  };

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/REGISTER",
          "persist/DEFAULT_VERSION",
        ],
      },
    }).concat(webSocketMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// TODO: Move somewhere else
export const clearPersistedState = async () => {
  try {
    await persistor.purge();
  } catch (error) {
    console.error("Failed to purge persistor:", error);
  }
};
