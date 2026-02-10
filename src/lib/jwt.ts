import jwt, { JwtPayload } from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!accessSecret || !refreshSecret) {
  throw new Error('JWT secrets are not configured. Please set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in your environment variables.');
}

// We know they are defined now, but let's re-assign or cast for TS in functions, 
// or simpler: just cast them in the functions or use the ! operator if strictNullChecks is on.
// A cleaner way is to export them as guaranteed strings or use them directly.
// Let's just cast them in the variable declaration or right after check.
const secretAccess = accessSecret as string;
const secretRefresh = refreshSecret as string;
const accessExp = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const refreshExp = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export type AccessTokenPayload = {
  sub: string; // userId
  orgId?: string;
  role?: string;
  first_name?: string;
  last_name?: string;
};

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, secretAccess, { expiresIn: accessExp as string });
}

export function signRefreshToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, secretRefresh, { expiresIn: refreshExp as string });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, secretAccess) as JwtPayload & AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, secretRefresh) as JwtPayload & AccessTokenPayload;
}
