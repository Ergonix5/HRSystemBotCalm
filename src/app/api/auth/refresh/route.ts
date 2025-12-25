import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { REFRESH_COOKIE, ACCESS_COOKIE } from "@/src/lib/auth-cookies";
import { verifyRefreshToken, signAccessToken } from "@/src/lib/jwt";

const isProd = process.env.NODE_ENV === "production";

export async function POST() {
  try {
    const refresh = (await cookies()).get(REFRESH_COOKIE)?.value;
    if (!refresh) return NextResponse.json({ message: "No refresh token" }, { status: 401 });

    const payload = verifyRefreshToken(refresh);

    const newAccess = signAccessToken({ sub: payload.sub, role: payload.role, orgId: payload.orgId });

    (await cookies()).set(ACCESS_COOKIE, newAccess, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return NextResponse.json({ message: "Refreshed" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Refresh failed" }, { status: 401 });
  }
}
