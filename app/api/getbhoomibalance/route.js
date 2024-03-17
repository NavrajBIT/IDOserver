import { NextResponse } from "next/server";
import * as web3 from "@solana/web3.js";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const BHOOMI_ADDRESS = "Aa5w19iqzLynJ1kcAKQf53LhWSBX9c1dGhSzRJweRUY9";

export async function POST(request) {
  const data = await request.json();
  console.log(data);
  const address = data.address;

  let balance = await getTokenbalance(address);

  return NextResponse.json({ balance: balance });
}

const getTokenbalance = async (address) => {
  let connection = new web3.Connection(web3.clusterApiUrl("devnet"));

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

    if (new web3.PublicKey(accountData.mint) === BHOOMI_ADDRESS) {
      balance = accountData.amount;
    }
  });
  return balance;
};
