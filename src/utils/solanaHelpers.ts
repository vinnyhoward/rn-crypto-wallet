import {
  Connection,
  PublicKey,
  clusterApiUrl,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Signer,
  Keypair,
} from "@solana/web3.js";

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

    const response = await Promise.all(
      signatures.map(async (signature) => {
        const transaction = await connection.getParsedTransaction(
          signature.signature
        );
        return transaction;
      })
    );

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
