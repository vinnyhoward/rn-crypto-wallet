import "react-native-get-random-values";
import "@ethersproject/shims";
import { Wallet, JsonRpcProvider, HDNodeWallet } from "ethers";

const { EXPO_PUBLIC_ALCHEMY_KEY, EXPO_PUBLIC_ALCHEMY_URL } = process.env;
const url = EXPO_PUBLIC_ALCHEMY_URL + EXPO_PUBLIC_ALCHEMY_KEY;

/**
 * Creates a new Ethereum wallet.
 * @returns The wallet object.
 */
export const createWallet = (): HDNodeWallet => {
  const wallet = Wallet.createRandom();
  const provider = new JsonRpcProvider(url);
  const providerConnectedWallet = wallet.connect(provider);
  return providerConnectedWallet;
};
