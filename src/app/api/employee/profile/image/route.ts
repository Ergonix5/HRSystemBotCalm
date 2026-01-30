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
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert to base64 for simple storage (for production, use cloud storage)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    await connectDB();

    const employee = await Employee.findByIdAndUpdate(
      payload.sub,
      { profile_image: base64Image },
      { new: true }
    ).select('profile_image');

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      profile_image: employee.profile_image,
      message: "Profile image updated successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}