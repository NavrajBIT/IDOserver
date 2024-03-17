import { NextResponse } from "next/server";

import { getTokenbalance, transferTokens } from "../solanascripts";

export async function POST(request) {
  const data = await request.json();
  const address = data.address;
  const amount = data.amount;

  let signature = await transferTokens(address, amount);

  return NextResponse.json({ status: "success", signature: signature });
}
