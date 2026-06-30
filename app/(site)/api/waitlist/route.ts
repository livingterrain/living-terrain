import { NextResponse } from "next/server";
import { subscribeToWaitlist } from "@/lib/newsletter";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email as string;
    const source = (body.source as "observatory" | "newsletter") ?? "observatory";

    const result = await subscribeToWaitlist({ email, source });

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400 },
    );
  }
}
