import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Organization } from "../../models/organization.model";
import { Employee } from "../../models/employee.model";
import { validateBody } from "../../../lib/validate";
import { organizationCreateSchema } from "../../../validators/organization.schema";
import { paginate } from "../../service/pagination.service";
import { createBulkNotifications } from "../../service/notification.service";

/**
 * GET /api/Designation - Fetch paginated designations with search
 * Query params: page, limit, q (search query)
 */
export async function GET(req: Request)
{
  try
  {
    // Connect to database
    await connectDB();

    // Extract query parameters from URL
    const { searchParams } = new URL(req.url);

    // Parse and validate pagination parameters
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10)));
    const q = (searchParams.get("q") ?? "").trim();

    // Get paginated results with search functionality
    const result = await paginate(Organization, {
      page,
      limit,
      q,
      searchFields: ["title", "description"], // Search in title and description fields
      sortBy: "createdAt",
      sortOrder: -1, // Newest first
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any)
  {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * POST /api/Organization - Create new Organizations
 */
export async function POST(req: Request)
{
  try
  {
    // Connect to database
    await connectDB();

    // Validate request body against schema
    const result = await validateBody(req, organizationCreateSchema);
    if (!result.ok) return result.res;

    // Create new designation in database
    const created = await Organization.create(result.data);

    // Send notification to system administrators
    try
    {
      console.log('Creating organization notification...');

      // Find all active employees and populate their roles
      const employees = await Employee.find({
        employment_status: 'Active'
      })
        .populate('role', 'role_name')
        .select('_id organization role');

      console.log(`Found ${employees.length} active employees`);

      // Filter for admins based on populated role_name
      const admins = employees.filter((emp: any) =>
      {
        const roleName = emp.role?.role_name;
        return roleName && ['Admin', 'Super Admin', 'HR Manager'].includes(roleName);
      });

      console.log(`👥 Found ${admins.length} admin users:`, admins.map((a: any) => ({
        id: a._id,
        role: a.role?.role_name
      })));

      if (admins.length > 0)
      {
        console.log('📤 Sending notifications to each admin...');

        // Send notification to each admin individually using their organization
        for (const admin of admins)
        {
          try
          {
            await createBulkNotifications({
              organizationId: (admin as any).organization.toString(),
              recipientIds: [(admin as any)._id.toString()],
              type: 'system',
              title: 'New Organization Created',
              message: `Organization "${created.title}" has been created successfully`,
              priority: 'medium',
              metadata: {
                organizationId: created._id.toString(),
                organizationTitle: created.title,
                action: 'created',
                actionUrl: '/dashboard/company'
              },
              sendEmail: false
            });
          } catch (err)
          {
            console.error(`Failed to notify admin ${(admin as any)._id}:`, err);
          }
        }

        console.log('✅ Notifications sent successfully');
      } else
      {
        console.log('⚠️ No admin users found to notify');
      }
    } catch (notifError)
    {
      console.error('❌ Failed to send organization creation notification:', notifError);
      // Don't fail the request if notification fails
    }

    // Return success response with created data
    return NextResponse.json(
      {
        success: true,
        message: "Organization created successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (err: any)
  {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
