import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { submitVisitorObservation } from "@/lib/observatory/visitor-observations.server";
import { invalidateRelationshipGraph } from "@/lib/relationships/graph";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = submitVisitorObservation({
      title: body.title ?? null,
      body: String(body.body ?? ""),
      themeIds: Array.isArray(body.themeIds) ? body.themeIds.map(String) : [],
      terrainLocation: body.terrainLocation ?? null,
      anonymous: body.anonymous !== false,
      contributorName: body.contributorName ?? null,
    });

    if (result.success) {
      invalidateRelationshipGraph();
      revalidatePath("/observatory");
      if (result.observation) {
        revalidatePath(`/observatory/observations/${result.observation.slug}`);
      }
    }

    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch {
    return NextResponse.json(
      { success: false, message: "The observation could not be recorded." },
      { status: 400 },
    );
  }
}

export async function GET() {
  const { getRecentObservations } = await import(
    "@/lib/observatory/visitor-observations.server"
  );
  return NextResponse.json({ observations: getRecentObservations(12) });
}
