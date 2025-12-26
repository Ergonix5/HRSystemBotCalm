import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/src/lib/db";
import { Employee } from "../../../models/employee.model";
import { Types } from "mongoose";

export async function POST() {
  try {
    await connectDB();

    // Check if test user already exists
    const existingUser = await Employee.findOne({ email: "test@example.com" });
    if (existingUser) {
      return NextResponse.json({ message: "Test user already exists" }, { status: 200 });
    }

    // Create dummy ObjectIds for required fields
    const dummyOrgId = new Types.ObjectId();
    const dummyDesignationId = new Types.ObjectId();
    const dummyRoleId = new Types.ObjectId();

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 12);

    // Create test user
    const testUser = new Employee({
      organization: dummyOrgId,
      designation: dummyDesignationId,
      role: dummyRoleId,
      employee_id: "EMP001",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      hash_password: hashedPassword,
      phone: "+1234567890",
      employment_status: "active"
    });

    await testUser.save();

    return NextResponse.json({ 
      message: "Test user created successfully",
      credentials: {
        email: "test@example.com",
        password: "password123"
      }
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}