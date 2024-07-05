import ethService from "../services/EthereumService";
import solanaService from "../services/SolanaService";
import { Chains } from "../types";

export function identifyAddress(address: string) {
  if (ethService.validateAddress(address)) {
    return Chains.Ethereum;
  }

  if (solanaService.validateAddress(address)) {
    return Chains.Solana;
  }

  return "Unknown";
}
