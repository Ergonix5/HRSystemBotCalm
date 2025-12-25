import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/src/lib/auth-cookies";
import { verifyAccessToken } from "@/src/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_COOKIE)?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const payload = verifyAccessToken(token);

    return NextResponse.json(
      { user: { id: payload.sub, role: payload.role, organization_id: payload.organization_id, designation: payload.designation } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
