import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import walletReducer from "./walletSlice";

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
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// TODO: Move somewhere else
export const clearPersistedState = async () => {
  try {
    await persistor.purge();
  } catch (error) {
    console.error("Failed to purge persistor:", error);
  }
};
