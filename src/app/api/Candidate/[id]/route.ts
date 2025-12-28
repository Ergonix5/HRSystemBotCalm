import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Candidate } from "../../../models/candidate.model";

// Type for dynamic route params (Next.js 15+ requires Promise)
// Type for dynamic route params (Next.js 15+ requires Promise)
type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/Candidate/[id] - Fetch single Candidate by ID
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    // Find Candidate by MongoDB ObjectId
    const Candidates = await Candidate.findById(id);
    // Return 404 if not found
    if (!Candidates) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(Candidates);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * PUT /api/Candidate/[id] - Update Candidate by ID
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
    const Candidates = await Candidate.findByIdAndUpdate(id, data, { new: true });
    // Return 404 if not found
    if (!Candidates) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({
      success: true,
      message: "Designation updated successfully",
      data: Candidates,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * DELETE /api/Candidate/[id] - Delete Candidate by ID
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    // Delete Candidate from database
    await Candidate.findByIdAndDelete(id);
    return NextResponse.json({ message: "Candidate Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}