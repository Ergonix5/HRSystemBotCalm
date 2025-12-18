import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Designation } from "../../../models/designations.model";

// Type for dynamic route params (Next.js 15+ requires Promise)
// Type for dynamic route params (Next.js 15+ requires Promise)
type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/Designation/[id] - Fetch single designation by ID
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    // Find designation by MongoDB ObjectId
    const Designations = await Designation.findById(id);
    // Return 404 if not found
    if (!Designations) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(Designations);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * PUT /api/Designation/[id] - Update designation by ID
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
    const Designations = await Designation.findByIdAndUpdate(id, data, { new: true });
    // Return 404 if not found
    if (!Designations) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({
      success: true,
      message: "Designation updated successfully",
      data: Designations,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * DELETE /api/Designation/[id] - Delete designation by ID
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    // Delete designation from database
    await Designation.findByIdAndDelete(id);
    return NextResponse.json({ message: "Designation Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}