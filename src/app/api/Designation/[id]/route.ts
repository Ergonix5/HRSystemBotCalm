import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Designation } from "../../../models/designations.model";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const Designations = await Designation.findById(id);
    if (!Designations) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(Designations);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();
    const Designations = await Designation.findByIdAndUpdate(id, data, { new: true });
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

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    await Designation.findByIdAndDelete(id);
    return NextResponse.json({ message: "Designation Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}