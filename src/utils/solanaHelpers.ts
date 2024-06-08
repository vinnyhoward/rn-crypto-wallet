import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";
import { validateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { TransactionObject } from "../types";
import { uint8ArrayToBase64 } from "./uint8ArrayToBase64";
import { base64ToUint8Array } from "./base64ToUint8Array";

const { EXPO_PUBLIC_ALCHEMY_SOL_URL, EXPO_PUBLIC_ALCHEMY_SOL_API_KEY } =
  process.env;
const customRpcUrl =
  EXPO_PUBLIC_ALCHEMY_SOL_URL + EXPO_PUBLIC_ALCHEMY_SOL_API_KEY;
const connection = new Connection(customRpcUrl, "confirmed");

export function restoreSolWalletFromPhrase(mnemonicPhrase: string) {
  const seed = mnemonicToSeedSync(mnemonicPhrase, "");
  const path = `m/44'/501'/0'/0'`;
  const keypair = Keypair.fromSeed(derivePath(path, seed.toString("hex")).key);

  return keypair;
}

export async function getSolanaBalance(publicKeyString: string) {
  try {
    const publicKey = new PublicKey(publicKeyString);
    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / 1e9;
    return solBalance;
  } catch (error) {
    console.error("Error fetching Solana balance:", error);
    throw error;
  }
}

const fetchTransactionsSequentially = async (signatures: any[]) => {
  const transactions = [];

  for (const signature of signatures) {
    try {
      const transaction = await connection.getParsedTransaction(
        signature.signature
      );
      transactions.push(transaction);
    } catch (error) {
      if (error.message.includes("429")) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      } else {
        console.error("Failed to fetch transaction:", error);
      }
    }
  }

  return transactions;
};

export const getTransactionsByWallet = async (
  walletAddress: string,
  beforeSignature?: string,
  limit = 50
) => {
  const publicKey = new PublicKey(walletAddress);
  let signatures: any;

  try {
    signatures = await connection.getSignaturesForAddress(publicKey, {
      before: beforeSignature,
      limit,
    });
  } catch (err) {
    console.error("Error fetching signatures:", err);
  }

  if (signatures) {
    try {
      const rawTransactions = await fetchTransactionsSequentially(signatures);

      const transactions = rawTransactions
        .map((tx: any) => extractTransactionDetails(tx, walletAddress))
        .sort((a, b) => b.blockTime - a.blockTime);
      return transactions;
    } catch (error) {
      console.error("Failed to process transactions:", error);
      return [];
    }
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

export const calculateSolanaTransactionFee = async (
  from: string,
  to: string,
  amount: number
) => {
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(from),
        toPubkey: new PublicKey(to),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );
    let recentBlockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    transaction.recentBlockhash = recentBlockhash;
    transaction.feePayer = new PublicKey(from);

    const response = await connection.getFeeForMessage(
      transaction.compileMessage(),
      "confirmed"
    );
    return response.value;
  } catch (err) {
    console.error("Error fetching Solana transaction fee:", err);
    throw err;
  }
};

export const sendSolanaTransaction = async (
  secretKey: Uint8Array,
  to: string,
  amount: number
) => {
  try {
    const keyPair = Keypair.fromSecretKey(secretKey);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(keyPair.publicKey.toString()),
        toPubkey: new PublicKey(to),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );
    let recentBlockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    transaction.recentBlockhash = recentBlockhash;
    transaction.feePayer = new PublicKey(keyPair.publicKey.toString());

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keyPair,
    ]);
    return signature;
  } catch (err) {
    console.error("Error sending Solana transaction:", err);
    throw err;
  }
};

export function extractTransactionDetails(
  transactionObject: TransactionObject,
  addressOfInterest: string
) {
  const transferInstruction =
    transactionObject.transaction.message.instructions.find(
      (instruction) =>
        instruction.parsed && instruction.parsed.type === "transfer"
    );

  if (!transferInstruction) {
    return;
  }

  const info = transferInstruction.parsed.info;
  let direction = "other";
  if (info.source === addressOfInterest) {
    direction = "sent";
  } else if (info.destination === addressOfInterest) {
    direction = "received";
  }

  const hash = transactionObject.transaction.message.recentBlockhash;
  const uniqueId = info.destination + info.source + hash;
  const from = info.source;
  const to = info.destination;
  const amountSentLamports = info.lamports;
  const value = amountSentLamports / 1000000000;
  const blockTime = transactionObject.blockTime;

  return {
    uniqueId,
    from,
    to,
    hash,
    value,
    direction,
    blockTime,
    asset: "SOL",
  };
}

export const deriveSolPrivateKeysFromPhrase = async (
  mnemonicPhrase: string
) => {
  if (!mnemonicPhrase) {
    throw new Error("Empty mnemonic phrase ");
  }
  if (!validateMnemonic(mnemonicPhrase)) {
    throw new Error("Invalid mnemonic phrase ");
  }

  try {
    const seedBuffer = mnemonicToSeedSync(mnemonicPhrase);
    const seed = new Uint8Array(
      seedBuffer.buffer,
      seedBuffer.byteOffset,
      seedBuffer.byteLength
    ).slice(0, 32);

    const solWallet = Keypair.fromSeed(seed);
    const solPrivateKeyBase64 = uint8ArrayToBase64(solWallet.secretKey);
    const solPrivateKey = base64ToUint8Array(solPrivateKeyBase64);

    return solPrivateKey;
  } catch (error) {
    throw new Error(
      "Failed to derive wallet from mnemonic: " + (error as Error).message
    );
  }
};

export async function findNextUnusedSolWalletIndex(
  mnemonicPhrase: string,
  indexOffset: number = 0
) {
  if (!mnemonicPhrase) {
    throw new Error("Empty mnemonic phrase ");
  }

  if (!validateMnemonic(mnemonicPhrase)) {
    throw new Error("Invalid mnemonic phrase ");
  }

  const seed = mnemonicToSeedSync(mnemonicPhrase, "");
  let currentIndex = indexOffset;
  while (true) {
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const keypair = Keypair.fromSeed(
      derivePath(path, seed.toString("hex")).key
    );
    const publicKey = keypair.publicKey;
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit: 1,
    });

    if (signatures.length === 0) {
      break;
    }
    currentIndex += 1;
  }

  return currentIndex > 0 ? currentIndex + 1 : 0;
}

export async function collectedUsedAddresses(
  mnemonicPhrase: string,
  unusedIndex: number
) {
  const startingIndex = unusedIndex > 0 ? unusedIndex - 1 : unusedIndex;
  const seed = mnemonicToSeedSync(mnemonicPhrase, "");
  const keyPairsUsed = [];

  for (let i = 0; i <= startingIndex; i++) {
    const path = `m/44'/501'/${i}'/0'`;
    const keypair = Keypair.fromSeed(
      derivePath(path, seed.toString("hex")).key
    );
    const normalizedKeyPair = {
      publicKey: keypair.publicKey.toBase58(),
    };
    const keypairWithDetails = {
      ...normalizedKeyPair,
      derivationPath: path,
    };
    keyPairsUsed.push(keypairWithDetails);
  }

  return keyPairsUsed;
}

export async function importAllActiveSolAddresses(mnemonicPhrase: string) {
  const unusedAddressIndex = await findNextUnusedSolWalletIndex(mnemonicPhrase);
  const usedAddresses = await collectedUsedAddresses(
    mnemonicPhrase,
    unusedAddressIndex
  );

  return usedAddresses;
}

export const createSolWalletByIndex = async (
  phrase: string,
  indexOffset: number = 0
) => {
  try {
    const seed = mnemonicToSeedSync(phrase, "");

    const path = `m/44'/501'/${indexOffset}'/0'`;
    const keypair = Keypair.fromSeed(
      derivePath(path, seed.toString("hex")).key
    );

    return keypair;
  } catch (error) {
    throw new Error(
      "failed to create Solana wallet by index: " + (error as Error).message
    );
  }
};
