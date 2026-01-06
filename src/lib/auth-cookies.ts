import { cookies } from "next/headers";

const isProd = process.env.NODE_ENV === "production";

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const c = await cookies();

  c.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 min
  });

  c.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookies() {
  const c = await cookies();
  c.set(ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  c.set(REFRESH_COOKIE, "", { path: "/", maxAge: 0 });
}
