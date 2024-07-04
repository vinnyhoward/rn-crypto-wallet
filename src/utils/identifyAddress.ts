import ethService from "../services/EthereumService";
import solanaService from "../services/SolanaService";

export function identifyAddress(address: string) {
  if (ethService.validateAddress(address)) {
    return "ethereum";
  }

  if (solanaService.validateAddress(address)) {
    return "solana";
  }

  return "Unknown";
}
