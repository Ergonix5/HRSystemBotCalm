import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Designation } from "../../models/designations.model";
import { validateBody } from "../../../lib/validate";
import { designationCreateSchema } from "../../../validators/designation.schema";
import { paginate } from "../../service/pagination.service";

/**
 * GET /api/Designation - Fetch paginated designations with search
 * Query params: page, limit, q (search query)
 */
export async function GET(req: Request) {
  try {
    // Connect to database
    await connectDB();

    // Extract query parameters from URL
    const { searchParams } = new URL(req.url);

    // Parse and validate pagination parameters
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10)));
    const q = (searchParams.get("q") ?? "").trim();

    // Get paginated results with search functionality
    const result = await paginate(Designation, {
      page,
      limit,
      q,
      searchFields: ["title", "description"], // Search in title and description fields
      sortBy: "createdAt",
      sortOrder: -1, // Newest first
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * POST /api/Designation - Create new designation
 * Body: { designation_id, title, description? }
 */
export async function POST(req: Request) {
  try {
    // Connect to database
    await connectDB();

    // Validate request body against schema
    const result = await validateBody(req, designationCreateSchema);
    if (!result.ok) return result.res;

    // Create new designation in database
    const created = await Designation.create(result.data);
    
    // Return success response with created data
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
