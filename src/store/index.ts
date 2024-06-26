import "react-native-get-random-values";
import "@ethersproject/shims";

import { combineReducers } from "redux";
import {
  configureStore,
  Middleware,
  PayloadAction,
  ThunkAction,
  Action,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import walletReducer from "./walletSlice";
// import ethereumReducer from "./ethereumSlice";
// import solanaReducer from "./solanaSlice";
import priceReduce from "./priceSlice";
import biometricsReducer from "./biometricsSlice";
import { formatEther } from "ethers";
import ethService from "../services/EthereumService";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  wallet: walletReducer,
  // ethereum: ethereumReducer,
  // solana: solanaReducer,
  price: priceReduce,
  biometrics: biometricsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const webSocketMiddleware: Middleware =
  (store) =>
  (next) =>
  (action: PayloadAction<string> | PayloadAction<number>) => {
    next(action);
    if (action.type === "wallet/saveEthereumAddress") {
      const state = store.getState();
      const { ethereum } = state.wallet;
      ethService.getWebSocketProvider().on("block", async () => {
        const balance = await ethService
          .getWebSocketProvider()
          .getBalance(ethereum.address);
        store.dispatch({
          type: "wallet/updateEthereumBalance",
          payload: formatEther(balance),
        });
      });

      return () => ethService.getWebSocketProvider().removeAllListeners();
    }
  };

export const clearPersistedState = async () => {
  try {
    await persistor.purge();
  } catch (error) {
    console.error("Failed to purge persistor:", error);
  }
};

const listenerMiddleware = createListenerMiddleware();

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
    })
      .prepend(listenerMiddleware.middleware)
      .concat(webSocketMiddleware),
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
