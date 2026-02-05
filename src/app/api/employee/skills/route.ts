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
    const { skill } = await request.json();
    
    if (!skill) {
      return NextResponse.json({ error: "Skill is required" }, { status: 400 });
    }

    await connectDB();

    const employee = await Employee.findByIdAndUpdate(
      payload.sub,
      { $addToSet: { skills: skill } },
      { new: true }
    ).select('skills');

    return NextResponse.json({ skills: employee?.skills }, { status: 200 });
  } catch (error) {
    console.error("Add skill error:", error);
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
    const { skill } = await request.json();
    
    if (!skill) {
      return NextResponse.json({ error: "Skill is required" }, { status: 400 });
    }

    await connectDB();

    const employee = await Employee.findByIdAndUpdate(
      payload.sub,
      { $pull: { skills: skill } },
      { new: true }
    ).select('skills');

    return NextResponse.json({ skills: employee?.skills }, { status: 200 });
  } catch (error) {
    console.error("Remove skill error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}