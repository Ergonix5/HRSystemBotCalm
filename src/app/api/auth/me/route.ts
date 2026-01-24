import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/src/lib/auth-cookies";
import { verifyAccessToken } from "@/src/lib/jwt";
import { connectDB } from "@/src/lib/db";

import { Employee } from "../../../models/employee.model";
import { Role } from "../../../models/role.model";

export async function GET() {
  try {
    const token = (await cookies()).get(ACCESS_COOKIE)?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const payload = verifyAccessToken(token);

    await connectDB();

    const emp = await Employee.findById(payload.sub)
      .select("_id organization designation role")
      .populate("role", "role_id role_name permissions status");

    if (!emp) return NextResponse.json({ user: null }, { status: 200 });

    const role: any = emp.role;

    return NextResponse.json(
      {
        user: {
          id: String(emp._id),
          organization_id: String(emp.organization),
          designation: String(emp.designation),

          role: role?._id ? String(role._id) : null,
          role_id: role?.role_id ?? null,
          role_name: role?.role_name ?? null,
          permissions: role?.permissions ?? [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Auth me error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
