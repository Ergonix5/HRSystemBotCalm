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
    const { degree, school, year } = await request.json();
    
    if (!degree || !school || !year) {
      return NextResponse.json({ error: "All education fields are required" }, { status: 400 });
    }

    await connectDB();

    const employee = await Employee.findByIdAndUpdate(
      payload.sub,
      { $push: { education: { degree, school, year } } },
      { new: true }
    ).select('education');

    return NextResponse.json({ education: employee?.education }, { status: 200 });
  } catch (error) {
    console.error("Add education error:", error);
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
    const { index, degree, school, year } = await request.json();
    
    if (index === undefined || !degree || !school || !year) {
      return NextResponse.json({ error: "Index and all education fields are required" }, { status: 400 });
    }

    await connectDB();

    const employee = await Employee.findById(payload.sub);
    if (!employee || !employee.education || index >= employee.education.length) {
      return NextResponse.json({ error: "Education record not found" }, { status: 404 });
    }

    employee.education[index] = { degree, school, year };
    await employee.save();

    return NextResponse.json({ education: employee.education }, { status: 200 });
  } catch (error) {
    console.error("Update education error:", error);
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
    if (!employee || !employee.education || index >= employee.education.length) {
      return NextResponse.json({ error: "Education record not found" }, { status: 404 });
    }

    employee.education.splice(index, 1);
    await employee.save();

    return NextResponse.json({ education: employee.education }, { status: 200 });
  } catch (error) {
    console.error("Delete education error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}