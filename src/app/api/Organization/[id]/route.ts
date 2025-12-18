import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { organization } from "../../../models/organization.model";

// Type for dynamic route params (Next.js 15+ requires Promise)
// Type for dynamic route params (Next.js 15+ requires Promise)
type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/Organization/[id] - Fetch single designation by ID
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    // Find designation by MongoDB ObjectId
    const Organizations = await organization.findById(id);
    // Return 404 if not found
    if (!Organizations) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(Organizations);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * PUT /api/Organization/[id] - Update Organizations by ID
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
    const Organizations = await organization.findByIdAndUpdate(id, data, { new: true });
    // Return 404 if not found
    if (!Organizations) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({
      success: true,
      message: "Organization updated successfully",
      data: Organizations,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * DELETE /api/Organization/[id] - Delete Organizations by ID
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    // Delete designation from database
    await organization.findByIdAndDelete(id);
    return NextResponse.json({ message: "Organization Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}