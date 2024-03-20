import * as web3 from "@solana/web3.js";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  AccountLayout,
  TOKEN_PROGRAM_ID,
  createMint,
  mintTo,
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
} from "@solana/spl-token";
import base58 from "bs58";

export const getTokenbalance = async (address) => {
  const BHOOMI_ADDRESS = process.env.NEXT_BHOOMI_ADDRESS;
  let connection = new web3.Connection(web3.clusterApiUrl("testnet"));

  const tokenAccounts = await connection.getTokenAccountsByOwner(
    new web3.PublicKey(address),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );
  let balance = 0;
  tokenAccounts.value.forEach((tokenAccount) => {
    const accountData = AccountLayout.decode(tokenAccount.account.data);
    console.log(
      `${new web3.PublicKey(accountData.mint)}   ${accountData.amount}`
    );
    let contractAddressBin = new web3.PublicKey(accountData.mint);
    let contractAddress = contractAddressBin.toString();

    if (contractAddress === BHOOMI_ADDRESS) {
      balance = accountData.amount;
    }
  });
  return balance;
};

export const getTokenSupply = async () => {
  const BIT_ADDRESS = process.env.NEXT_BIT_ADDRESS;
  const bitBalance = await getTokenbalance(BIT_ADDRESS);
  return bitBalance;
};

export const transferTokens = async (address, amount) => {
  const connection = new Connection(clusterApiUrl("testnet"), "confirmed");

  const payerPrivateKey = process.env.NEXT_PRIVATE_KEY;
  const payerPrivateKeydecoded = base58.decode(payerPrivateKey);
  const senderKeypair = Keypair.fromSecretKey(payerPrivateKeydecoded);

  const publicKey = new PublicKey(address);

  const MINT_ADDRESS = process.env.NEXT_BHOOMI_ADDRESS;

  console.log(`1 - Getting Source Token Account`);
  let sourceAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    senderKeypair,
    new PublicKey(MINT_ADDRESS),
    senderKeypair.publicKey
  );

  console.log(`2 - Getting Destination Token Account`);
  let destinationAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    senderKeypair,
    new PublicKey(MINT_ADDRESS),
    publicKey
  );

  const numberDecimals = 9;
  console.log(`4 - Creating and Sending Transaction`);
  const tx = new Transaction();
  tx.add(
    createTransferInstruction(
      sourceAccount.address,
      destinationAccount.address,
      senderKeypair.publicKey,
      amount * Math.pow(10, numberDecimals)
    )
  );

  console.log("sending transaction---");

  const signature = await sendAndConfirmTransaction(connection, tx, [
    senderKeypair,
  ]);

  console.log(signature);
  return signature;
};
