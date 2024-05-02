import "react-native-get-random-values";
import "@ethersproject/shims";

import { isAddress } from "ethers";

export function isAddressValid(address: string) {
  return isAddress(address);
}
