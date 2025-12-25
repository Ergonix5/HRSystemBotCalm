import jwt, { JwtPayload } from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;
const accessExp = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const refreshExp = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export type AccessTokenPayload = {
  sub: string; // userId
  orgId?: string;
  role?: string;
};

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, accessSecret, { expiresIn: accessExp });
}

export function signRefreshToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExp });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, accessSecret) as JwtPayload & AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshSecret) as JwtPayload & AccessTokenPayload;
}
