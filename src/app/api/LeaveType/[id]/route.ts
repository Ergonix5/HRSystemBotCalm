import { LeaveType } from "@/src/app/models/leaveType.model";
import { connectDB } from "@/src/lib/db";
import { validateBody } from "@/src/lib/validate";
import { leaveTypeCreateSchema } from "@/src/validators/leaveType.schema";
import { NextResponse } from "next/server";
import { success } from "zod";



type Params = { params: Promise<{ id: string }> };



export async function GET(req: Request, { params }: Params)
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
        const { id } = await params;

        const leaveType = await LeaveType.findOne({ _id: id, organization: organizationId })
            .populate("organization", "name");

        if (!leaveType)
        {
            return NextResponse.json(
                { message: "Not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(leaveType, { status: 200 });

    } catch (error: any)
    {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}


// PUT /api/LeaveType/[id] - Update Leave Type by ID
export async function PUT(req: Request, { params }: Params)
{
    try
    {
        await connectDB();

        const { id } = await params;

        // Validate request body
        const result = await validateBody(req, leaveTypeCreateSchema);
        if (!result.ok) return result.res;

        const data = result.data;

        // Check if leave type exists and belongs to organization
        const existing = await LeaveType.findOne({
            _id: id,
            organization: data.organization,
        });

        if (!existing)
        {
            return NextResponse.json(
                { message: "Leave Type not found for this organization" },
                { status: 404 }
            );
        }

        // heck duplicate leave_type_id in organization
        if (data.leave_type_id !== existing.leave_type_id)
        {
            const duplicate = await LeaveType.findOne({
                _id: { $ne: id },
                leave_type_id: data.leave_type_id,
                organization: data.organization
            });

            if (duplicate)
            {
                return NextResponse.json(
                    { message: "Leave type ID already exists in this organization" },
                    { status: 409 }
                );
            }
        }

        const updated = await LeaveType.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        ).populate("organization", "name");

        return NextResponse.json({
            success: true,
            message: "Leave type updated successfully",
            data: updated,
        });

    } catch (error: any)
    {
        if (error?.code === 11000)
        {
            return NextResponse.json(
                { message: "Leave type ID already exists in this organization" },
                { status: 409 }
            );
        }

        return NextResponse.json({ message: error.message }, { status: 400 });
    }

}


export async function DELETE(req: Request, { params }: Params)
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

        const { id } = await params;

        // secure: leave type must belong to organization
        const leaveType = await LeaveType.findOne({
            _id: id,
            organization: organizationId
        });

        if (!leaveType)
        {
            return NextResponse.json(
                { message: "Leave type not found in this organization" },
                { status: 404 }
            );
        }

        await LeaveType.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Leave type deleted successfully",
        })

    } catch (error: any)
    {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}