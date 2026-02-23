import { NextResponse } from "next/server";

/**
 * POST /api/n8n/filter-cvs - Send filtered CVs to n8n webhook
 * Body: { job_position, total_candidates, candidates, timestamp }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.job_position) {
      return NextResponse.json(
        { message: "job_position is required" },
        { status: 400 }
      );
    }

    if (!body.candidates || !Array.isArray(body.candidates)) {
      return NextResponse.json(
        { message: "candidates array is required" },
        { status: 400 }
      );
    }

    // Get n8n webhook URL from environment
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("n8n webhook URL not configured");
      return NextResponse.json(
        { message: "n8n webhook URL not configured" },
        { status: 500 }
      );
    }

    // Send data to n8n webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n webhook error:", errorText);
      return NextResponse.json(
        { 
          message: "Failed to send data to n8n workflow",
          error: errorText 
        },
        { status: response.status }
      );
    }

    // Get response from n8n
    const result = await response.json().catch(() => ({}));

    return NextResponse.json({
      success: true,
      message: `Successfully sent ${body.total_candidates} CVs to n8n workflow`,
      data: result,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error sending to n8n:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error.message 
      },
      { status: 500 }
    );
  }
}
