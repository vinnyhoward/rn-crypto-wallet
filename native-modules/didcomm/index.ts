import { NativeModules, Platform } from "react-native";

const LINKING_ERROR =
  `The package 'didcomm-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo Go";

const Didcomm = NativeModules.Didcomm
  ? NativeModules.Didcomm
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default {
  helloWorld: (): Promise<string> => {
    console.log("Calling helloWorld from JS bridge");
    return Didcomm.helloWorld();
  },
};
