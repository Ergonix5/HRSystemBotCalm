import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Annoucement } from "../../models/annoucement.model";
import { validateBody } from "../../../lib/validate";
import { announcementCreateSchema } from "../../../validators/annoucement.schema";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

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

    // Optional filters
    const priority = (searchParams.get("priority") ?? "").trim();
    const status = (searchParams.get("status") ?? "").trim();

    const filter: any = { organization: organizationId };

    // Search filter
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { details_description: { $regex: q, $options: "i" } },
        { announcement_id: { $regex: q, $options: "i" } },
      ];
    }

    // Priority filter
    if (priority && ["High", "Medium", "Low"].includes(priority)) {
      filter.priority = priority;
    }

    // Status filter
    if (status && ["active", "inactive"].includes(status)) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Annoucement.find(filter)
        .sort({ createdAt: -1 })
        .populate("organization")
        .skip(skip)
        .limit(limit),
      Annoucement.countDocuments(filter),
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
 * POST /api/announcements - Create new announcement
 */
export async function POST(req: Request) {
  try {
    // Connect to database
    await connectDB();

    // Validate request body against schema
    const result = await validateBody(req, announcementCreateSchema);
    if (!result.ok) return result.res;

    // Create new announcement in database
    const created = await Annoucement.create(result.data);

    // Return success response with created data
    return NextResponse.json(
      {
        success: true,
        message: "Announcement created successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * PUT /api/announcements - Update existing announcement
 */
export async function PUT(req: Request) {
  try {
    // Connect to database
    await connectDB();

    // Get announcement ID from query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Announcement ID is required" },
        { status: 400 }
      );
    }

    // Validate request body against schema
    const result = await validateBody(req, announcementCreateSchema);
    if (!result.ok) return result.res;

    // Update announcement in database
    const updated = await Annoucement.findByIdAndUpdate(
      id,
      result.data,
      { new: true, runValidators: true }
    ).populate("organization");

    if (!updated) {
      return NextResponse.json(
        { message: "Announcement not found" },
        { status: 404 }
      );
    }

    // Return success response with updated data
    return NextResponse.json({
      success: true,
      message: "Announcement updated successfully",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * DELETE /api/announcements - Delete announcement
 */
export async function DELETE(req: Request) {
  try {
    // Connect to database
    await connectDB();

    // Get announcement ID from query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Announcement ID is required" },
        { status: 400 }
      );
    }

    // Delete announcement from database
    const deleted = await Annoucement.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Announcement not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
      data: deleted,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}