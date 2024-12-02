import { NativeModules } from "react-native";

const { Didcomm } = NativeModules;

export default {
  helloWorld: (): Promise<string> => {
    return Didcomm.helloWorld();
  },
};
