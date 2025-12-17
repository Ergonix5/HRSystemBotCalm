import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Designation } from "../../models/designations.model";
import { validateBody } from "../../../lib/validate";
import { designationCreateSchema } from "../../../validators/designation.schema";
import { paginate } from "../../service/pagination.service";



export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10)));
    const q = (searchParams.get("q") ?? "").trim();

    const result = await paginate(Designation, {
      page,
      limit,
      q,
      searchFields: ["title", "description"],
      sortBy: "createdAt",
      sortOrder: -1,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
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
