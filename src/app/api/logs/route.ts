import { connectDB } from "@/src/lib/db";
import { NextResponse } from "next/server";
import Log from "../../models/log.model";

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const orgId = searchParams.get('orgId');
        const action = searchParams.get('action');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const filter: any = {};
        if (userId) filter.userId = userId;
        if (orgId) filter.orgId = orgId;
        if (action) filter.action = action;

        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            Log.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Log.countDocuments(filter)
        ]);

        return NextResponse.json({
            success: true,
            data: logs,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });

    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
