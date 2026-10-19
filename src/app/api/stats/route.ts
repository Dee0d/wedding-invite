import { NextResponse } from "next/server";
import { db } from "@/db";
import { rsvpResponses } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** Публичная агрегированная статистика по ответам. */
export async function GET() {
  try {
    const [row] = await db
      .select({
        total: sql<number>`count(*)::int`,
        attending: sql<number>`count(*) filter (where ${rsvpResponses.attending})::int`,
        plusOnes: sql<number>`count(*) filter (where ${rsvpResponses.plusOne})::int`,
      })
      .from(rsvpResponses);

    return NextResponse.json({
      total: Number(row?.total ?? 0),
      attending: Number(row?.attending ?? 0),
      plusOnes: Number(row?.plusOnes ?? 0),
    });
  } catch (error) {
    console.error("stats error", error);
    return NextResponse.json({ total: 0, attending: 0, plusOnes: 0 });
  }
}
