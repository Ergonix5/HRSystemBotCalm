import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Role } from "../../models/role.model";
import { validateBody } from "../../../lib/validate";
import { roleCreateSchema } from "../../../validators/role.schema";
import { paginate } from "../../service/pagination.service";


export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    // use if condition to get all details to superadmin

    const organizationId = (searchParams.get("organizationId") ?? "").trim();
    if (!organizationId) {
      return NextResponse.json(
        { message: "organizationId is required" },
        { status: 400 }
      );
    }

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10)));
    const q = (searchParams.get("q") ?? "").trim();

    // IMPORTANT: change search fields to match your model
    // role_name + description (you don't have title)
    const filter: any = { organization: organizationId };

    if (q) {
      filter.$or = [
        { role_name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { role_id: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Role.find(filter).sort({ createdAt: -1 }).populate("organization").skip(skip).limit(limit),
      Role.countDocuments(filter),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * POST /api/Role - Create new designation
 
 */
export async function POST(req: Request) {
  try {
    // Connect to database
    await connectDB();

    // Validate request body against schema
    const result = await validateBody(req, roleCreateSchema);
    if (!result.ok) return result.res;

    // Create new designation in database
    const created = await Role.create(result.data);
    
    // Return success response with created data
    return NextResponse.json(
      {
        success:true,
        message: "Role created successfully",
        data: created,
      },
      {status: 201}
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
