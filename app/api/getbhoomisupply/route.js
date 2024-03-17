import { NextResponse } from "next/server";
import { getTokenSupply } from "../solanascripts";

export async function GET() {
  let currentAvailableToMint = await getTokenSupply();

  return NextResponse.json({
    totalSupply: "100000000",
    totalAvailableToMint: "10000000",
    currentAvailableToMint: currentAvailableToMint.toString(),
  });
}
