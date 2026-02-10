import { NextResponse } from "next/server";
import { requirePermission } from "@/src/lib/permissions";

/**
 * Debug endpoint to check current user's permissions
 * Helpful for troubleshooting 403 errors
 */
export async function GET()
{
    try
    {
        // Don't require any permission - just get user info
        const result = await requirePermission();

        if (!result.authorized)
        {
            return result.error || NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        // Return all user info including permissions
        return NextResponse.json({
            success: true,
            user: {
                id: result.user?.id,
                organization_id: result.user?.organization_id,
                designation: result.user?.designation,
                role_id: result.user?.role_id,
                role_name: result.user?.role_name,
                permissions: result.user?.permissions || [],
                permissionCount: result.user?.permissions?.length || 0
            }
        });
    }
    catch (error)
    {
        console.error("Debug permissions error:", error);
        return NextResponse.json(
            { message: "Internal server error", error: String(error) },
            { status: 500 }
        );
    }
}
