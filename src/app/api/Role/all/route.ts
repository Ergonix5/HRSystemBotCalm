import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Role } from "../../../models/role.model";         
import { paginate } from "../../../service/pagination.service";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);


    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10)));
    const q = (searchParams.get("q") ?? "").trim();

    //  If your paginate() supports extra filters, pass it.
    // If it doesn't, tell me your paginate service and I’ll adapt exactly.
    const result = await paginate(Role, {
      page,
      limit,
      q,
      searchFields: ["first_name", "last_name", "email", "phone"],
      sortBy: "createdAt",
      sortOrder: -1,
    //   filter: { organization: organizationId }, //  org scoped
 // don’t return hash
    });

    // console.log("Paginated Roles:", result);

    // Populate and select fields for the data
    // const populatedData = await Role.find({ _id: { $in: result.data.map((emp: any) => emp._id) } })
    //   .select("-hash_password")
      
    //   .populate("designation", "title designation_id")
    //   .populate("role", "role_name role_id permissions")
    //   .sort({ createdAt: -1 });

    // result.data = populatedData;

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
