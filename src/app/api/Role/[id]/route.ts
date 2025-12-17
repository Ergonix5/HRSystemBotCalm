import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Role } from "../../../models/role.model";

// Type for dynamic route params (Next.js 15+ requires Promise)
// Type for dynamic route params (Next.js 15+ requires Promise)
type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/Role/[id] - Fetch single Role by ID
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    // Find designation by MongoDB ObjectId
    const Roles = await Role.findById(id);
    // Return 404 if not found
    if (!Roles) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(Roles);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * PUT /api/Role/[id] - Update Role by ID
 */
export async function PUT(req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    // Parse request body
    const data = await req.json();
    // Update and return new document
    const Roles = await Role.findByIdAndUpdate(id, data, { new: true });
    // Return 404 if not found
    if (!Roles) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({
      success: true,
      message: "Role updated successfully",
      data: Roles,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * DELETE /api/Role/[id] - Delete Role by ID
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    // Delete designation from database
    await Role.findByIdAndDelete(id);
    return NextResponse.json({ message: "Role Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}