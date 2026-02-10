import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Organization } from "../../../models/organization.model";
import { Employee } from "../../../models/employee.model";
import { createBulkNotifications } from "../../../service/notification.service";
import { logAction } from "@/src/lib/logger";

// Type for dynamic route params (Next.js 15+ requires Promise)
// Type for dynamic route params (Next.js 15+ requires Promise)
type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/Organization/[id] - Fetch single designation by ID
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;
    // Find designation by MongoDB ObjectId
    const Organizations = await Organization.findById(id);
    // Return 404 if not found
    if (!Organizations) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(Organizations);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * PUT /api/Organization/[id] - Update Organizations by ID
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
    const Organizations = await Organization.findByIdAndUpdate(id, data, { new: true });
    // Return 404 if not found
    if (!Organizations) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Send notification to system administrators
    try {
      const employees = await Employee.find({
        employment_status: 'Active'
      })
        .populate('role', 'role_name')
        .select('_id organization role');

      // Filter for admins based on populated role_name
      const admins = employees.filter((emp: any) => {
        const roleName = emp.role?.role_name;
        return roleName && ['Admin', 'Super Admin', 'HR Manager'].includes(roleName);
      });

      if (admins.length > 0) {
        await createBulkNotifications({
          organizationId: Organizations._id.toString(),
          recipientIds: admins.map(admin => admin._id.toString()),
          type: 'system',
          title: '🔄 Organization Updated',
          message: `Organization "${Organizations.name}" has been updated`,
          priority: 'low',
          metadata: {
            organizationId: Organizations._id.toString(),
            organizationTitle: Organizations.name,
            action: 'updated',
            actionUrl: '/admin/organizations'
          },
          sendEmail: false
        });
      }
    } catch (notifError) {
      console.error('Failed to send organization update notification:', notifError);
    }

    // Log the update
    await logAction("ORGANIZATION_UPDATE", {
      organizationId: Organizations._id,
      updatedFields: Object.keys(data),
      name: Organizations.name
    });

    return NextResponse.json({
      success: true,
      message: "Organization updated successfully",
      data: Organizations,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

/**
 * DELETE /api/Organization/[id] - Delete Organizations by ID
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    // Connect to database
    await connectDB();
    // Extract ID from dynamic route params
    const { id } = await params;

    // Get organization details before deletion for notification
    const organization = await Organization.findById(id);
    if (!organization) {
      return NextResponse.json({ message: "Organization not found" }, { status: 404 });
    }

    // Delete designation from database
    await Organization.findByIdAndDelete(id);

    // Send notification to system administrators
    try {
      const employees = await Employee.find({
        employment_status: 'Active'
      })
        .populate('role', 'role_name')
        .select('_id organization role');

      // Filter for admins based on populated role_name
      const admins = employees.filter((emp: any) => {
        const roleName = emp.role?.role_name;
        return roleName && ['Admin', 'Super Admin', 'HR Manager'].includes(roleName);
      });

      if (admins.length > 0) {
        await createBulkNotifications({
          organizationId: organization._id.toString(),
          recipientIds: admins.map(admin => admin._id.toString()),
          type: 'alert',
          title: '⚠️ Organization Deleted',
          message: `Organization "${organization.name}" has been permanently deleted`,
          priority: 'high',
          metadata: {
            organizationId: organization._id.toString(),
            organizationTitle: organization.name,
            action: 'deleted',
            actionUrl: '/admin/organizations'
          },
          sendEmail: true
        });
      }
    } catch (notifError) {
      console.error('Failed to send organization deletion notification:', notifError);
    }

    // Log the deletion
    await logAction("ORGANIZATION_DELETE", {
      organizationId: organization._id,
      name: organization.name
    });

    return NextResponse.json({ message: "Organization Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}