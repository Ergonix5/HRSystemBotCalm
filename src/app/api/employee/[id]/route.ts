import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Employee } from "../../../models/employee.model";

// Type for dynamic route params (Next.js 15+ requires Promise)
type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/employee/[id] - Fetch single employee by ID
 */
export async function GET(req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    
    // Get organizationId from query params
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");
    if (!organizationId) {
      return NextResponse.json({ message: "organizationId is required" }, { status: 400 });
    }
    
    // Find employee by ID and organization
    const employee = await Employee.findOne({ _id: id, organization: organizationId })
      .select("-hash_password")
      
      .populate("designation", "title designation_id")
      .populate("role", "role_name role_id permissions");
    // Return 404 if not found
    if (!employee) return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    return NextResponse.json(employee);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * PUT /api/employee/[id] - Update employee by ID
 */
export async function PUT(req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    // Parse request body
    const data = await req.json();
    
    // Get organizationId from query params
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");
    if (!organizationId) {
      return NextResponse.json({ message: "organizationId is required" }, { status: 400 });
    }
    
    // Convert date strings to Date objects if provided
    if (data.date_of_birth) data.date_of_birth = new Date(data.date_of_birth);
    if (data.join_date) data.join_date = new Date(data.join_date);
    
    // Update employee within organization scope
    const employee = await Employee.findOneAndUpdate(
      { _id: id, organization: organizationId },
      data,
      { new: true }
    )
      .select("-hash_password")
      .populate("designation", "title designation_id")
      .populate("role", "role_name role_id permissions");
    // Return 404 if not found
    if (!employee) return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    return NextResponse.json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * DELETE /api/employee/[id] - Delete employee by ID
 */
export async function DELETE(req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    
    // Get organizationId from query params
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");
    if (!organizationId) {
      return NextResponse.json({ message: "organizationId is required" }, { status: 400 });
    }
    
    // Delete employee within organization scope
    const employee = await Employee.findOneAndDelete({ _id: id, organization: organizationId });
    if (!employee) return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}