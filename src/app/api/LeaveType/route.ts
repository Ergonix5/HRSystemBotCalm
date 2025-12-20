
import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { paginate } from "../../service/pagination.service";
import { LeaveType } from "../../models/leaveType.model";
import { leaveTypeCreateSchema } from "@/src/validators/leaveType.schema";
import { validateBody } from "../../../lib/validate";
import { Organization } from "../../models/organization.model";
import "@/src/app/models/organization.model";



// GET ALL LEAVE TYPES WITH PAGINATION AND SEARCH
export async function GET(req: Request)
{
    try
    {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const organizationId = (searchParams.get("organizationId") ?? "").trim();
        if (!organizationId)
        {
            return NextResponse.json(
                { message: "organizationId is required" },
                { status: 400 }
            );
        }

        const page = Math.max(1, Number(searchParams.get("page") ?? 1));
        const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10)));
        const q = (searchParams.get('q') ?? "").trim();

        const result = await paginate(LeaveType, {
            page,
            limit,
            q,
            searchFields: ['name', 'description'],
            sortBy: 'createdAt',
            sortOrder: -1,
            filter: { organization: organizationId }, //  org scoped
        })

        const populatedData = await LeaveType.find({ _id: { $in: result.data.map((lt: any) => lt._id) } })
            .select("-__v")
            .populate("organization", "name")
            .sort({ createdAt: -1 });

        result.data = populatedData;

        return NextResponse.json(result, { status: 200 });

    } catch (error: any)
    {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}



// CREATE A NEW LEAVE TYPE

export async function POST(req: Request)
{
    try
    {
        await connectDB();

        const result = await validateBody(req, leaveTypeCreateSchema);
        if (!result.ok) return result.res;

        const data = result.data;

        // Check for duplicate leave_type_id in organization
        const existing = await LeaveType.findOne({
            leave_type_id: data.leave_type_id,
            organization: data.organization,
        });

        if (existing)
        {
            return NextResponse.json(
                { message: "Leave type ID already exists in the organization" },
                { status: 409 }
            );
        }

        const created = await LeaveType.create(data);

        const populate = await LeaveType.findById(created._id)
            .populate("organization", "name");

        return NextResponse.json(
            {
                success: true,
                message: "Leave Type created successfully",
                data: populate,
            },
            { status: 201 }
        );

    } catch (error: any)
    {
        // Handle MongoDB duplicate key error
        if (error?.code === 11000)
        {
            return NextResponse.json(
                { message: "Leave type already exists." },
                { status: 409 }
            )
        }
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}