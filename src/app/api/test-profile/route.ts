import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    
    // Get first employee for testing (bypass auth)
    const employee = await mongoose.connection.db?.collection('employees').findOne({});
    
    if (!employee) {
      return NextResponse.json({ error: "No employees found" }, { status: 404 });
    }

    return NextResponse.json({ employee }, { status: 200 });
  } catch (error) {
    console.error("Test profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    
    // Update first employee for testing (bypass auth)
    const result = await mongoose.connection.db?.collection('employees').updateOne(
      {}, // Update first employee
      { 
        $set: {
          phone: body.phone,
          address: body.address,
          bio: body.bio,
          skills: body.skills,
          education: body.education,
          experience: body.experience,
          updatedAt: new Date()
        }
      }
    );

    if (result?.matchedCount === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Get updated employee
    const employee = await mongoose.connection.db?.collection('employees').findOne({});
    
    return NextResponse.json({ 
      employee, 
      message: "Profile updated successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("Test profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}