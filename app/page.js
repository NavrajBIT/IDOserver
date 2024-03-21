"use client";
import styles from "./page.module.css";
import useapi from "./api/getbhoomibalance/useapi";
import {
  createMint,
  mintTo,
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
} from "@solana/spl-token";
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

import base58 from "bs58";
import { useState } from "react";
import metadata from "./metadata";

export default function Home() {
  const api = useapi();
  const [contractAddress, setContractAddress] = useState("");
  return (
    <main className={styles.main}>
      <button
        onClick={async () => {
          await api
            .crud("POST", "getbhoomibalance", {
              address: "eEjz2hdrxnxixAy2o1PFMGDB9oyn4WxF3ECTAQPdNDA",
            })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }}
      >
        Get Bhoomi Balance
      </button>
      <br />
      <button
        onClick={async () => {
          await api
            .crud("GET", "getbhoomisupply")
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }}
      >
        Get Bhoomi Supply
      </button>
      <br />
      <button
        onClick={async () => {
          const provider = window.phantom?.solana;
          await provider
            .connect()
            .then((res) => console.log(`Connected : ${res.publicKey}`))
            .catch((err) => console.log("Could not connect"));
        }}
      >
        Connect Phantom
      </button>
      <br />
      <button
        onClick={async () => {
          const connection = new Connection(
            clusterApiUrl("testnet"),
            "confirmed"
          );

          const payerPrivateKey = "";
          const payerPrivateKeydecoded = base58.decode(payerPrivateKey);
          const payer = Keypair.fromSecretKey(payerPrivateKeydecoded);

          const mint = await createMint(
            connection,
            payer,
            payer.publicKey,
            payer.publicKey,
            9
          );

          console.log("deployed successfully!!!!");
          alert(mint.toBase58());

          const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint,
            payer.publicKey
          );

          console.log(tokenAccount.address.toBase58());

          await mintTo(
            connection,
            payer,
            mint,
            tokenAccount.address,
            payer,
            "100000000000"
          );
        }}
      >
        Deploy Contract
      </button>
      <br />

      <button onClick={metadata}>Add Metadata</button>

      <button
        onClick={async () => {
          const connection = new Connection(
            clusterApiUrl("devnet"),
            "confirmed"
          );

          const payerPrivateKey = "";
          const payerPrivateKeydecoded = base58.decode(payerPrivateKey);
          const senderKeypair = Keypair.fromSecretKey(payerPrivateKeydecoded);

          const publicKey = new PublicKey(
            "eEjz2hdrxnxixAy2o1PFMGDB9oyn4WxF3ECTAQPdNDA"
          );

          const MINT_ADDRESS = "BqBzJ6zRT1wXnEBRaGQ3K6TxWB1G5Pcb3rjcY2YB3Qdu";

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
              9 * Math.pow(10, numberDecimals)
            )
          );

          console.log("sending transaction---");

          const signature = await sendAndConfirmTransaction(connection, tx, [
            senderKeypair,
          ]);

          console.log(signature);
        }}
      >
        Tranfer tokens
      </button>
    </main>
  );
}

// 55PwjYGjRwvXBL7X9ccaewbvwTkRyu9RB6cTjk7t5afCGuyEmfVUQCVZAtQQRSncQw3J765UzGpwrw76CGJepKnb
