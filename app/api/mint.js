import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import base58 from "bs58";

async function createTokenAccount(connection, payer, mint, owner) {
  const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    owner,
    true
  );
  console.log(owner);

  return tokenAccount;
}
async function transferTokens(
  connection,
  payer,
  source,
  destination,
  owner,
  amount,
  mint
) {
  const mintInfo = await token.getMint(connection, mint);
  console.log("mint INfo");
  console.log(mintInfo);
  const transactionSignature = await token.transfer(
    connection,
    payer,
    source,
    destination,
    owner,
    amount * 10 ** mintInfo.decimals
  );
}

export async function mintTokens(recipientAddress, amount) {
  const connection = new web3.Connection("", {
    commitment: "confirmed",
  });
  const payerPrivateKey = process.env.NEXT_PRIVATE_KEY;
  const payerPrivateKeydecoded = base58.decode(payerPrivateKey);
  const signer = web3.Keypair.fromSecretKey(payerPrivateKeydecoded);
  console.log("PublicKey:", signer.publicKey.toBase58());
  const recipient = new web3.PublicKey(recipientAddress);
  const mint = new web3.PublicKey(process.env.NEXT_BHOOMI_ADDRESS);
  const ata = new web3.PublicKey(
    "9G4RTia1n5uThQ42tfmci2k9w1nauXjAKQPGQV9FKRuD"
  );
  const senderTokenAccount = await token.getOrCreateAssociatedTokenAccount(
    connection,
    signer,
    mint,
    signer.publicKey
  );
  console.log(senderTokenAccount.address);
  // create the associated token account of the token of the recipient
  const recipientTokenAccount = await token.getOrCreateAssociatedTokenAccount(
    connection,
    signer,
    mint,
    recipient
  );
  console.log("created token account");
  console.log(recipientTokenAccount.address);
  const PRIORITY_RATE = 10000; // MICRO_LAMPORTS
  const PRIORITY_FEE_INSTRUCTIONS =
    web3.ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: PRIORITY_RATE,
    });
  const mintInfo = await token.getMint(connection, mint);
  const transferInstruction = token.createTransferInstruction(
    // Those addresses are the Associated Token Accounts belonging to the sender and receiver
    senderTokenAccount.address,
    recipientTokenAccount.address,
    ata,
    amount * 10 ** mintInfo.decimals
  );
  let latestBlockhash = await connection.getLatestBlockhash("confirmed");
  // Compiles and signs the transaction message with the sender's Keypair.
  const messageV0 = new web3.TransactionMessage({
    payerKey: ata,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [PRIORITY_FEE_INSTRUCTIONS, transferInstruction],
  }).compileToV0Message();
  const versionedTransaction = new web3.VersionedTransaction(messageV0);
  versionedTransaction.sign([signer]);
  console.log("Transaction Signed. Preparing to send...");
  // Attempts to send the transaction to the network, handling success or failure.
  const txid = await connection.sendTransaction(versionedTransaction, {
    maxRetries: 20,
  });
  console.log(`Transaction Submitted: ${txid}`);
  await confirmTxn(
    connection,
    txid,
    latestBlockhash.blockhash,
    latestBlockhash.lastValidBlockHeight,
    0
  );
}
const confirmTxn = async (
  connection,
  sig,
  blockHash,
  lastValidBlockHeight,
  count
) => {
  if (count >= 5) {
    console.log("Failed to confirm transaction");
    return;
  }
  console.log(count);
  try {
    const confirmation = await connection.confirmTransaction(
      {
        signature: sig,
        blockhash: blockHash,
        lastValidBlockHeight: lastValidBlockHeight,
      },
      "confirmed"
    );
    console.log(confirmation);
    if (confirmation.value.err) {
      throw new Error(":rotating_light:Transaction not confirmed.");
    }
    console.log(
      `Transaction Successfully Confirmed! :tada: View on SolScan: https://solscan.io/tx/${sig}`
    );
  } catch (error) {
    console.log(`Failed to confirm, Retrying count : ${count}....`);
    let latestBlockhash = await connection.getLatestBlockhash("confirmed");
    await confirmTxn(
      connection,
      sig,
      latestBlockhash.blockhash,
      latestBlockhash.lastValidBlockHeight,
      count + 1
    );
    console.log(error);
  }
};
