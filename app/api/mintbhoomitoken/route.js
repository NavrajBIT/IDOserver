import { NextResponse } from "next/server";

import { getTokenbalance, transferTokens, revertTx } from "../solanascripts";

export async function POST(request) {
  const data = await request.json();
  const address = data.address;
  const amount = data.amount;
  const sol = data.sol;

  try {
    let signature = await transferTokens(address, amount);
    return NextResponse.json({ status: "success", signature: signature });
  } catch {
    revertTx(address, sol);
    return NextResponse.json({ status: "failed" });
  }
}
