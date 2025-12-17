import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Designation } from "../../models/designations.model";
import { validateBody } from "../../../lib/validate";
import { designationCreateSchema } from "../../../validators/designation.schema";


export async function GET() {
  try {
    await connectDB();
    const Designations = await Designation.find().sort({ createdAt: -1 });
    return NextResponse.json(Designations);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const result = await validateBody(req, designationCreateSchema);
    if (!result.ok) return result.res;

    const created = await Designation.create(result.data);
    return NextResponse.json(
      {
        success:true,
        message: "Designation created successfully",
        data: created,
      },
      {status: 201}
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
