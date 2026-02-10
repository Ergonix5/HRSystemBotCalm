import { cookies } from "next/headers";
import { verifyAccessToken, AccessTokenPayload } from "./jwt";
import { ACCESS_COOKIE } from "./auth-cookies";

export async function getSession(): Promise<AccessTokenPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_COOKIE)?.value;

    if (!token) {
        return null;
    }

    try {
        const payload = verifyAccessToken(token);
        return payload;
    } catch (error) {
        console.error("Session verification failed:", error);
        return null;
    }
}
