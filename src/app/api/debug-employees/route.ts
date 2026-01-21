import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    
    // Get raw employee data from database
    const employees = await mongoose.connection.db?.collection('employees').find({}).limit(5).toArray();
    
    return NextResponse.json({
      status: "success",
      employees: employees?.map(emp => ({
        _id: emp._id,
        employee_id: emp.employee_id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        email: emp.email,
        phone: emp.phone,
        address: emp.address,
        bio: emp.bio,
        skills: emp.skills,
        education: emp.education,
        experience: emp.experience,
        updatedAt: emp.updatedAt
      })) || []
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: (error as Error).message
    }, { status: 500 });
  }
}