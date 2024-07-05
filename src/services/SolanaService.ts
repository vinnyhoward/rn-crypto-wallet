import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Keypair,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import uuid from "react-native-uuid";
import { validateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { TransactionObject } from "../types";

class SolanaService {
  private connection: Connection;
  constructor(private rpcUrl: string) {
    this.connection = new Connection(rpcUrl, "confirmed");
  }

  restoreWalletFromPhrase(mnemonicPhrase: string): Promise<Keypair> {
    return new Promise((resolve, reject) => {
      try {
        const seed = mnemonicToSeedSync(mnemonicPhrase, "");
        const path = `m/44'/501'/0'/0'`;
        const keypair = Keypair.fromSeed(
          derivePath(path, seed.toString("hex")).key
        );

        resolve(keypair);
      } catch (error) {
        reject(new Error("Failed to import solana wallet: " + error.message));
      }
    });
  }

  async createWalletByIndex(phrase: string, index: number = 0) {
    try {
      const seed = mnemonicToSeedSync(phrase, "");
      const path = `m/44'/501'/${index}'/0'`;
      const keypair = Keypair.fromSeed(
        derivePath(path, seed.toString("hex")).key
      );

      return {
        publicKey: keypair.publicKey.toBase58(),
        address: keypair.publicKey.toBase58(),
        derivationPath: path,
      };
    } catch (error) {
      throw new Error(
        "failed to create Solana wallet by index: " + (error as Error).message
      );
    }
  }

  async getBalance(publicKeyString: string) {
    try {
      const publicKey = new PublicKey(publicKeyString);
      const balance = await this.connection.getBalance(publicKey);
      const solBalance = balance / 1e9;
      return solBalance;
    } catch (error) {
      console.error("Error fetching Solana balance:", error);
      throw error;
    }
  }

  async #fetchTransactionsSequentially(signatures: any[]) {
    const transactions = [];

    for (const signature of signatures) {
      try {
        const transaction = await this.connection.getParsedTransaction(
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
  }

  #extractTransactionDetails(
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
    const uniqueId = uuid.v4();
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

  async getTransactionsByWallet(
    walletAddress: string,
    beforeSignature?: string,
    limit: number = 50
  ) {
    const publicKey = new PublicKey(walletAddress);
    let signatures: any;

    try {
      signatures = await this.connection.getSignaturesForAddress(publicKey, {
        before: beforeSignature,
        limit,
      });
    } catch (err) {
      console.error("Error fetching signatures:", err);
    }

    if (signatures) {
      try {
        const rawTransactions = await this.#fetchTransactionsSequentially(
          signatures
        );

        const transactions = rawTransactions
          .map((tx: any) => this.#extractTransactionDetails(tx, walletAddress))
          .sort((a, b) => b.blockTime - a.blockTime);
        return transactions;
      } catch (error) {
        console.error("Failed to process transactions:", error);
        return [];
      }
    }
  }

  async validateAddress(addr: string) {
    let publicKey: PublicKey;
    try {
      publicKey = new PublicKey(addr);
      return await PublicKey.isOnCurve(publicKey.toBytes());
    } catch (err) {
      return false;
    }
  }

  async calculateTransactionFee(from: string, to: string, amount: number) {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(from),
          toPubkey: new PublicKey(to),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
      let recentBlockhash = (
        await this.connection.getLatestBlockhash("finalized")
      ).blockhash;
      transaction.recentBlockhash = recentBlockhash;
      transaction.feePayer = new PublicKey(from);

      const response = await this.connection.getFeeForMessage(
        transaction.compileMessage(),
        "confirmed"
      );
      return response.value;
    } catch (err) {
      console.error("Error fetching Solana transaction fee:", err);
      throw err;
    }
  }

  async sendTransaction(secretKey: Uint8Array, to: string, amount: number) {
    try {
      const keyPair = Keypair.fromSecretKey(secretKey);
      const balance = await this.connection.getBalance(
        new PublicKey(keyPair.publicKey)
      );

      if (balance < amount * LAMPORTS_PER_SOL) {
        throw new Error("Insufficient funds for the transaction");
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(keyPair.publicKey.toString()),
          toPubkey: new PublicKey(to),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
      let recentBlockhash = (
        await this.connection.getLatestBlockhash("finalized")
      ).blockhash;
      transaction.recentBlockhash = recentBlockhash;
      transaction.feePayer = new PublicKey(keyPair.publicKey.toString());

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [keyPair]
      );
      return signature;
    } catch (err) {
      console.error("Error sending Solana transaction:", err);
      throw err;
    }
  }

  async derivePrivateKeysFromPhrase(mnemonicPhrase: string, path: string) {
    if (!mnemonicPhrase) {
      throw new Error("Empty mnemonic phrase ");
    }
    if (!validateMnemonic(mnemonicPhrase)) {
      throw new Error("Invalid mnemonic phrase ");
    }

    try {
      const seed = mnemonicToSeedSync(mnemonicPhrase, "");
      const keypair = Keypair.fromSeed(
        derivePath(path, seed.toString("hex")).key
      );

      return keypair.secretKey;
    } catch (error) {
      throw new Error(
        "Failed to derive wallet from mnemonic: " + (error as Error).message
      );
    }
  }

  async findNextUnusedWalletIndex(
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
      const signatures = await this.connection.getSignaturesForAddress(
        publicKey,
        {
          limit: 1,
        }
      );

      if (signatures.length === 0) {
        break;
      }
      currentIndex += 1;
    }

    return currentIndex > 0 ? currentIndex + 1 : 0;
  }

  async collectedUsedAddresses(mnemonicPhrase: string, unusedIndex: number) {
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

  async importAllActiveAddresses(mnemonicPhrase: string, offsetIndex?: number) {
    if (offsetIndex) {
      const usedAddresses = await this.collectedUsedAddresses(
        mnemonicPhrase,
        offsetIndex
      );
      return usedAddresses;
    } else {
      const unusedAddressIndex = await this.findNextUnusedWalletIndex(
        mnemonicPhrase
      );
      const usedAddresses = await this.collectedUsedAddresses(
        mnemonicPhrase,
        unusedAddressIndex
      );
      return usedAddresses;
    }
  }

  async confirmTransaction(signature: string): Promise<boolean> {
    try {
      const latestBlockhash = await this.connection.getLatestBlockhash();

      const strategy: TransactionConfirmationStrategy = {
        signature: signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      };

      const result = await this.connection.confirmTransaction(strategy);
      return result.value.err === null;
    } catch (error) {
      console.error("Error confirming Solana transaction:", error);
      return false;
    }
  }
}

const { EXPO_PUBLIC_ALCHEMY_SOL_URL, EXPO_PUBLIC_ALCHEMY_SOL_API_KEY } =
  process.env;
const customRpcUrl =
  EXPO_PUBLIC_ALCHEMY_SOL_URL + EXPO_PUBLIC_ALCHEMY_SOL_API_KEY;

const solanaService = new SolanaService(customRpcUrl);
export default solanaService;
