import { connectDB } from "./db";
import Log from "../app/models/log.model";
import { getSession } from "./session";
import { AccessTokenPayload } from "./jwt";

/**
 * Logs a user action to the database.
 * Auto-populates user details from the session.
 * 
 * @param action - string identifier for the action (e.g., 'CREATE_ORGANIZATION')
 * @param details - object containing relevant details about the action
 * @param userContext - optional manual user context (useful for login where session is not set yet)
 */
export async function logAction(
    action: string,
    details: Record<string, any> = {},
    userContext?: AccessTokenPayload
) {
    try {
        const session = userContext || await getSession();

        // Only logged-in users can generate logs in this context
        // Adjust logic if system actions (no session) also need logging
        if (!session) {
            console.warn(`logAction: Attempted to log '${action}' but no valid session found.`);
            return;
        }

        await connectDB();

        const username = (session.first_name && session.last_name)
            ? `${session.first_name} ${session.last_name}`
            : (session.first_name || "Unknown");

        const logEntry = new Log({
            userId: session.sub,
            username: username,
            role: session.role || "unknown",
            orgId: session.orgId,
            action: action,
            details: details,
        });

        await logEntry.save();
        console.log(`[LOG] Action '${action}' logged for user '${session.sub}'`);

    } catch (err) {
        console.error("logAction: Error saving log:", err);
        // Don't throw, we don't want logging failure to crash the request
    }
}
