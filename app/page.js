"use client";
import styles from "./page.module.css";
import useapi from "./api/getbhoomibalance/useapi";

export default function Home() {
  const api = useapi();
  return (
    <main className={styles.main}>
      <button
        onClick={async () => {
          const provider = window.phantom?.solana;
          await provider.connect();
          console.log(provider.publicKey);
          console.log(provider.publicKey.toBase58());
          console.log({
            address: provider.publicKey,
          });

          await api
            .crud("POST", "getbhoomibalance", {
              address: provider.publicKey.toBase58(),
            })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }}
      >
        Get Bhoomi Balance
      </button>
    </main>
  );
}
