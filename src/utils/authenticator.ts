import * as LocalAuthentication from "expo-local-authentication";

export const Authenticator = {
  async unlock(): Promise<boolean> {
    const hasBiometric = await LocalAuthentication.hasHardwareAsync();
    if (!hasBiometric) {
      console.warn("Biometric authentication is not available on this device.");
      return false;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access the app.",
      fallbackLabel: "Use passcode instead?",
      disableDeviceFallback: true,
      cancelLabel: "Cancel",
    });

    if (result.success) {
      return true;
    }
    return false;
  },
};
