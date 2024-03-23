import { NextResponse } from "next/server";
import { getTokenSupply } from "../solanascripts";

export async function GET() {
  let currentAvailableToMint = await getTokenSupply();

  return NextResponse.json({
    totalSupply: process.env.NEXT_TOTAL_SUPPLY,
    totalAvailableToMint: process.env.NEXT_CURRENT_SUPPLY,
    // currentAvailableToMint: currentAvailableToMint.toString(),
    address: process.env.NEXT_BHOOMI_ADDRESS,
  });
}
