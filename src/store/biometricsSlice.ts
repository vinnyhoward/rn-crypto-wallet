import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as LocalAuthentication from "expo-local-authentication";
import { RootState } from ".";

export const authenticate = createAsyncThunk<
  boolean,
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("biometrics/authenticate", async (_, { rejectWithValue }) => {
  try {
    const hasBiometric = await LocalAuthentication.hasHardwareAsync();
    if (!hasBiometric) {
      return rejectWithValue(
        "Biometric authentication is not available on this device."
      );
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access the app.",
      fallbackLabel: "Use passcode instead?",
      disableDeviceFallback: true,
      cancelLabel: "Cancel",
    });

    return result.success;
  } catch (error) {
    console.error("Authentication error", error);
    return rejectWithValue("An error occurred during authentication.");
  }
});

export const isAuthEnrolled = createAsyncThunk<
  boolean,
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("biometrics/isAuthEnrolled", async (_, { rejectWithValue }) => {
  try {
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      return rejectWithValue("No biometrics enrolled on this device.");
    }
    return isEnrolled;
  } catch (error) {
    console.error("Enrollment check error", error);
    return rejectWithValue(
      "An error occurred while checking biometric enrollment."
    );
  }
});

export interface InitialBiometricsState {
  biometricsEnabled: boolean;
  isEnrolled: boolean;
  errorMessage: string;
  status: "idle" | "loading" | "rejected";
}

const initialState: InitialBiometricsState = {
  biometricsEnabled: false,
  isEnrolled: false,
  errorMessage: "",
  status: "idle",
};

const biometricsSlice = createSlice({
  name: "biometrics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        authenticate.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.biometricsEnabled = action.payload;
          state.status = "idle";
        }
      )
      .addCase(authenticate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.status = "rejected";
        state.errorMessage = action.error.message || "Failed to authenticate.";
      })
      .addCase(
        isAuthEnrolled.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.isEnrolled = action.payload;
          state.status = "idle";
        }
      )
      .addCase(isAuthEnrolled.pending, (state) => {
        state.status = "loading";
      })
      .addCase(isAuthEnrolled.rejected, (state, action) => {
        state.status = "rejected";
        state.errorMessage =
          action.error.message || "Failed to check enrollment.";
      });
  },
});

export default biometricsSlice.reducer;
