import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rsvpResponses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { appendRsvpToSheet } from "@/lib/googleSheets";
import { buildSheetRow, SHEET_HEADERS } from "@/lib/rsvp";

export const dynamic = "force-dynamic";

/**
 * Досылает в Google-таблицу все ответы, которые ещё не были записаны
 * (например, пока подключение не было настроено).
 */
export async function POST(request: NextRequest) {
  const token = process.env.ADMIN_TOKEN;
  if (token && request.nextUrl.searchParams.get("key") !== token) {
    return NextResponse.json(
      { ok: false, error: "Нужен ключ доступа" },
      { status: 401 },
    );
  }

  let pending;
  try {
    pending = await db
      .select()
      .from(rsvpResponses)
      .where(eq(rsvpResponses.sheetSynced, false))
      .limit(200);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Не удалось загрузить ответы" },
      { status: 500 },
    );
  }

  let sent = 0;
  const problems: string[] = [];

  for (const row of pending) {
    const result = await appendRsvpToSheet({
      values: buildSheetRow(
        {
          fullName: row.fullName,
          attending: row.attending,
          plusOne: row.plusOne,
          drinks: row.drinks ?? [],
          allergies: row.allergies ?? [],
          allergiesOther: "",
          comment: row.comment ?? "",
        },
        row.createdAt,
      ),
      headers: SHEET_HEADERS,
    });

    if (result.status === "sent") {
      sent += 1;
      await db
        .update(rsvpResponses)
        .set({ sheetSynced: true, sheetStatus: `sent: ${result.detail}` })
        .where(eq(rsvpResponses.id, row.id));
    } else {
      problems.push(`${row.fullName}: ${result.detail}`);
      await db
        .update(rsvpResponses)
        .set({ sheetStatus: `${result.status}: ${result.detail}` })
        .where(eq(rsvpResponses.id, row.id));
    }
  }

  return NextResponse.json({
    ok: true,
    sent,
    checked: pending.length,
    problems: problems.slice(0, 5),
  });
}
