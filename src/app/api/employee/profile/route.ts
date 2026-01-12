import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/src/lib/auth-cookies";
import { verifyAccessToken } from "@/src/lib/jwt";
import { connectDB } from "@/src/lib/db";
import { Employee } from "@/src/app/models/employee.model";

export async function GET() {
  try {
    console.log("Profile GET request started");
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_COOKIE)?.value;
    
    if (!token) {
      console.log("No token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Token found, verifying...");
    const payload = verifyAccessToken(token);
    console.log("Token verified, connecting to DB...");
    await connectDB();

    console.log("DB connected, finding employee...");
    const employee = await Employee.findById(payload.sub)
      .populate('organization', 'name')
      .populate('designation', 'title')
      .populate('role', 'role_name')
      .select('-hash_password');

    if (!employee) {
      console.log("Employee not found");
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    console.log("Employee found, returning data");
    return NextResponse.json({ employee }, { status: 200 });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error", details: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_COOKIE)?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    const body = await request.json();
    
    // Allow updating profile fields
    const allowedFields = ['phone', 'address', 'bio', 'skills', 'education', 'experience'];
    const updateData: any = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    await connectDB();

    const employee = await Employee.findByIdAndUpdate(
      payload.sub,
      updateData,
      { new: true }
    )
      .populate('organization', 'name')
      .populate('designation', 'name')
      .populate('role', 'name')
      .select('-hash_password');

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ employee, message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}