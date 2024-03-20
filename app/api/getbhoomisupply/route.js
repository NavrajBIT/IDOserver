import { NextResponse } from "next/server";
import { getTokenSupply } from "../solanascripts";

export async function GET() {
  let currentAvailableToMint = await getTokenSupply();

  return NextResponse.json({
    totalSupply: "100000",
    totalAvailableToMint: "100000",
    currentAvailableToMint: currentAvailableToMint.toString(),
  });
}
