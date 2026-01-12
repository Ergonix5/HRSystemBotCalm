import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/src/lib/auth-cookies";
import { verifyAccessToken } from "@/src/lib/jwt";
import { connectDB } from "@/src/lib/db";
import { Employee } from "@/src/app/models/employee.model";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_COOKIE)?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    const { role, company, period, desc } = await request.json();
    
    if (!role || !company || !period) {
      return NextResponse.json({ error: "Role, company, and period are required" }, { status: 400 });
    }

    await connectDB();

    const employee = await Employee.findByIdAndUpdate(
      payload.sub,
      { $push: { experience: { role, company, period, desc: desc || "" } } },
      { new: true }
    ).select('experience');

    return NextResponse.json({ experience: employee?.experience }, { status: 200 });
  } catch (error) {
    console.error("Add experience error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
    const { index, role, company, period, desc } = await request.json();
    
    if (index === undefined || !role || !company || !period) {
      return NextResponse.json({ error: "Index, role, company, and period are required" }, { status: 400 });
    }

    await connectDB();

    const employee = await Employee.findById(payload.sub);
    if (!employee || !employee.experience || index >= employee.experience.length) {
      return NextResponse.json({ error: "Experience record not found" }, { status: 404 });
    }

    employee.experience[index] = { role, company, period, desc: desc || "" };
    await employee.save();

    return NextResponse.json({ experience: employee.experience }, { status: 200 });
  } catch (error) {
    console.error("Update experience error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_COOKIE)?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    const { index } = await request.json();
    
    if (index === undefined) {
      return NextResponse.json({ error: "Index is required" }, { status: 400 });
    }

    await connectDB();

    const employee = await Employee.findById(payload.sub);
    if (!employee || !employee.experience || index >= employee.experience.length) {
      return NextResponse.json({ error: "Experience record not found" }, { status: 404 });
    }

    employee.experience.splice(index, 1);
    await employee.save();

    return NextResponse.json({ experience: employee.experience }, { status: 200 });
  } catch (error) {
    console.error("Delete experience error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}