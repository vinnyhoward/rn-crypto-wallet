import "react-native-get-random-values";
import "@ethersproject/shims";
import * as ethers from "ethers";

const { EXPO_PUBLIC_ALCHEMY_KEY, EXPO_PUBLIC_ALCHEMY_URL } = process.env;
const url = EXPO_PUBLIC_ALCHEMY_URL + EXPO_PUBLIC_ALCHEMY_KEY;

export const createWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  const provider = new ethers.JsonRpcProvider(url);
  const providerConnectedWallet = wallet.connect(provider);

  return providerConnectedWallet;
};
