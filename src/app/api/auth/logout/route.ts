import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/src/lib/auth-cookies";

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ message: "Logged out" }, { status: 200 });
}
