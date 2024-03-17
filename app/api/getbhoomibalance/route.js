import { NextResponse } from "next/server";

import { getTokenbalance } from "../solanascripts";

export async function POST(request) {
  const data = await request.json();
  const address = data.address;

  let balance = await getTokenbalance(address);

  return NextResponse.json({ balance: balance.toString() });
}
