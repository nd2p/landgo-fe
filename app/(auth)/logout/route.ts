import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Logout logic here
  return NextResponse.json({ message: "Logged out" });
}
