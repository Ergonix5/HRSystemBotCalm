import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "./auth-cookies";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "./jwt";
import { connectDB } from "./db";
import { Employee } from "../app/models/employee.model";





export interface AuthUser
{
    id: string,
    organization_id?: string,
    designation?: string,
    role?: string,
    role_id?: string,
    role_name?: string,
    permissions: string[],
}


export interface PermissionCheckResult
{
    authorized: boolean,
    user?: AuthUser,
    error?: NextResponse,
}


// Verify user has required permission
// param requiredPermission - Single permission string
// param requiredPermissions - Array of permissions (user must have at least one)
// returns PermissionCheckResult with user data if authorized

export async function requirePermission(
    requiredPermission?: string,
    requiredPermissions?: string[],
)
{
    try
    {
        // Get token from cookies
        const token = (await cookies()).get(ACCESS_COOKIE)?.value;

        if (!token)
        {
            return {
                authorized: false,
                error: NextResponse.json(
                    { message: "Authentication required" },
                    { status: 401 }
                )
            }
        }

        // Verify token
        const payload = verifyAccessToken(token);

        await connectDB();

        const emp = await Employee.findById(payload.sub)
            .select("_id organization designation role")
            .populate("role", "role_id role_name permissions status");

        if (!emp)
        {
            return {
                authorized: false,
                error: NextResponse.json(
                    { message: "User not found" },
                    { status: 404 }
                )
            }
        }

        const role: any = emp.role;

        // Build user object
        const user: AuthUser = {
            id: String(emp._id),
            organization_id: String(emp.organization),
            designation: emp.designation ? String(emp.designation) : undefined,
            role: role?._id ? String(role._id) : undefined,
            role_id: role?.role_id ?? undefined,
            role_name: role?.role_name ?? undefined,
            permissions: role?.permissions ?? [],
        };

        if (role?.status !== 'active')
        {
            return {
                authorized: false,
                error: NextResponse.json(
                    { message: "Your role is not active. Please contact administrator." },
                    { status: 403 }
                )
            }
        }

        // Check single permission
        if (requiredPermission)
        {
            const hasPermission = user.permissions.includes(requiredPermission);

            if (!hasPermission)
            {
                console.log("Permission denied - User permissions:", user.permissions);
                console.log("Required permission:", requiredPermission);
                
                return {
                    authorized: false,
                    error: NextResponse.json(
                        {
                            message: "Insufficient permissions",
                            required: requiredPermission,
                            userPermissions: user.permissions
                        },
                        { status: 403 }
                    )
                }
            }
        }

        // Check any of multiple permissions
        if (requiredPermissions && requiredPermissions.length > 0)
        {
            const hasAnyPermission = requiredPermissions.some(perm =>
                user.permissions.includes(perm)
            )

            if (!hasAnyPermission)
            {
                console.log("Permission denied - User permissions:", user.permissions);
                console.log("Required permissions (need at least one):", requiredPermissions);
                
                return {
                    authorized: false,
                    error: NextResponse.json(
                        {
                            message: "Insufficient permissions",
                            required: requiredPermissions,
                            userPermissions: user.permissions
                        },
                        { status: 403 }
                    )
                }
            }
        }

        return {
            authorized: true,
            user,
        }
    }
    catch (error: any)
    {
        console.error("Permission check error:", error);

        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError')
        {
            return {
                authorized: false,
                error: NextResponse.json(
                    {
                        message: "Invalid or expired token. Please log in again."
                    },
                    { status: 401 }
                )
            }
        }

        return {
            authorized: false,
            error: NextResponse.json(
                { message: "Internal server error" },
                { status: 500 }
            )
        }
    }
}

// Check is user has all of the specified permissions
export async function requireAllPermissions(
    requiredPermissions: string[]
): Promise<PermissionCheckResult>
{
    try
    {
        const token = (await cookies()).get(ACCESS_COOKIE)?.value;

        if (!token)
        {
            return {
                authorized: false,
                error: NextResponse.json(
                    { message: "Authentication required" },
                    { status: 401 }
                ),
            };
        }

        const payload = verifyAccessToken(token);
        await connectDB();

        const emp = await Employee.findById(payload.sub)
            .select("_id organization designation role")
            .populate("role", "role_id role_name permissions status");

        if (!emp)
        {
            return {
                authorized: false,
                error: NextResponse.json(
                    { message: "User not found" },
                    { status: 404 }
                ),
            };
        }

        const role: any = emp.role;

        const user: AuthUser = {
            id: String(emp._id),
            organization_id: String(emp.organization),
            designation: emp.designation ? String(emp.designation) : undefined,
            role: role?._id ? String(role._id) : undefined,
            role_id: role?.role_id ?? undefined,
            role_name: role?.role_name ?? undefined,
            permissions: role?.permissions ?? [],
        };

        if (role?.status !== "active")
        {
            return {
                authorized: false,
                error: NextResponse.json(
                    { message: "Your role is not active" },
                    { status: 403 }
                ),
            };
        }

        // Check all permissions
        const hasAllPermissions = requiredPermissions.every(perm =>
            user.permissions.includes(perm)
        );

        if (!hasAllPermissions)
        {
            return {
                authorized: false,
                error: NextResponse.json(
                    {
                        message: "Insufficient permissions",
                        requiredAll: requiredPermissions
                    },
                    { status: 403 }
                ),
            };
        }

        return {
            authorized: true,
            user,
        };

    } catch (error: any)
    {
        console.error("Permission check error:", error);
        return {
            authorized: false,
            error: NextResponse.json(
                { message: "Internal server error" },
                { status: 500 }
            ),
        };
    }
}