import { getResetPreview, resetAllLeaveBalances, resetOrganizationLeaveBalances, type ResetPolicy } from "@/src/app/service/leaveBalance.service";
import { connectDB } from "@/src/lib/db";
import { NextResponse } from "next/server";


// POST /api/cron/reset-leave-balances
// Reset leave balance for new year
export async function POST(req: Request)
{
    try
    {
        await connectDB();

        const { searchParams } = new URL(req.url);

        // Security: Verify cron secret
        const cronSecret = searchParams.get('cronSecret');
        const expectedSecret = process.env.CRON_SECRET || 'change-this-secret-in-production';

        if (cronSecret !== expectedSecret)
        {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized: Invalid cron secret.'
                },
                { status: 401 }
            )
        }

        // Parse parameters
        const currentYear = new Date().getFullYear();
        const year = Number(searchParams.get('year') || currentYear);
        const organizationId = searchParams.get('organizationId');
        const isPreview = searchParams.get('preview') === 'true';

        // Parse reset policy
        const policy: ResetPolicy = {
            carryForward: searchParams.get('carryForward') === 'true',
            maxCarryFoward: searchParams.get('maxCarryFoward')
                ? Number(searchParams.get('maxCarryFoward'))
                : undefined
        };

        // Validate year
        if (year < 2020 || year > 2100)
        {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid year. Must be between 2020 and 2100'
                },
                { status: 400 }
            )
        }

        // Preview mode = show waht would be reset
        if (isPreview)
        {
            if (!organizationId)
            {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Preview mode required an organizationID parameter.'
                    },
                    { status: 400 }
                )
            }

            const preview = await getResetPreview(organizationId, year, policy);

            return NextResponse.json({
                success: true,
                mode: 'preview',
                year,
                policy,
                organizationId,
                totalRecords: preview.length,
                preview
            })
        }

        // Anctual reset - execute the balance reset
        let result;

        if (organizationId)
        {
            result = await resetOrganizationLeaveBalances(organizationId, year, policy);

            return NextResponse.json({
                success: true,
                mode: 'organization',
                year,
                policy,
                organizationId,
                totalProcessed: result.totalProcessed,
                successful: result.successful,
                failed: result.failed,
                message: `Reset completed for organization. ${result.successful} successful, ${result.failed} failed.`,
                details: result.details
            });
        } else
        {
            // Reset all organizations
            result = await resetAllLeaveBalances(year, policy);

            return NextResponse.json({
                success: true,
                mode: 'all_organizations',
                year,
                policy,
                organizationsProcessed: result.organizationProcessed,
                totalEmployeeLeaveTypes: result.totalEmployeeLeaveTypes,
                successful: result.successful,
                failed: result.failed,
                message: `System-wide reset completed. ${result.successful} successful, ${result.failed} failed across ${result.organizationProcessed} organizations.`,
                organizationDetails: result.details
            });
        }
    } catch (error: any)
    {
        console.error('Error resetting leave balances: ', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error: ' + error.message
            },
            {
                status: 500
            }
        )
    }
}