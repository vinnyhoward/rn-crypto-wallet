import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { BorshCoder } from "@coral-xyz/anchor";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const getSolanaBalance = async (publicKeyString: string) => {
  try {
    const publicKey = new PublicKey(publicKeyString);
    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / 1e9;
    return solBalance;
  } catch (error) {
    console.error("Error fetching Solana balance:", error);
    throw error;
  }
};

export const getTransactionsByWallet = async (walletAddress: string) => {
  const publicKey = new PublicKey(walletAddress);

  try {
    const signatures = await connection.getSignaturesForAddress(publicKey);
    const signature = signatures.map((signature) => signature.signature)[0];
    console.log("signature:", signature);
    const response = await connection.getParsedTransaction(signature);
    console.log("transactions", response);

    return response;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
};

export const validateSolanaAddress = async (addr: string) => {
  let publicKey: PublicKey;
  try {
    publicKey = new PublicKey(addr);
    return await PublicKey.isOnCurve(publicKey.toBytes());
  } catch (err) {
    return false;
  }
};

export const calculateSolanaTransactionFee = async () => {};
