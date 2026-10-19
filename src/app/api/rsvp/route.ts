import { NextResponse } from "next/server";
import { db } from "@/db";
import { rsvpResponses } from "@/db/schema";
import { appendRsvpToSheet, isSheetConfigured } from "@/lib/googleSheets";
import {
  buildSheetRow,
  parseRsvpInput,
  SHEET_HEADERS,
  validateRsvp,
} from "@/lib/rsvp";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: "Не удалось прочитать ответ" } },
      { status: 400 },
    );
  }

  const input = parseRsvpInput(body);
  const validation = validateRsvp(input);

  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, errors: validation.errors },
      { status: 422 },
    );
  }

  const data = validation.data;
  const createdAt = new Date();

  // 1. Пытаемся сразу дописать строку в Google-таблицу.
  const sheet = await appendRsvpToSheet({
    values: buildSheetRow(data, createdAt),
    headers: SHEET_HEADERS,
  });

  // 2. Сохраняем ответ в базе как надёжный бэкап / список гостей.
  try {
    await db.insert(rsvpResponses).values({
      fullName: data.fullName,
      attending: data.attending,
      plusOne: data.plusOne,
      drinks: data.drinks,
      allergies: data.allergies,
      comment: data.comment || null,
      sheetSynced: sheet.status === "sent",
      sheetStatus: `${sheet.status}: ${sheet.detail}`,
      createdAt,
    });
  } catch (error) {
    console.error("Не удалось сохранить ответ в базе:", error);
    // Если таблица приняла ответ — считаем приём успешным даже без бэкапа.
    if (sheet.status !== "sent") {
      return NextResponse.json(
        {
          ok: false,
          errors: {
            form: "Сервер не смог сохранить ответ. Попробуйте ещё раз чуть позже.",
          },
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    sheet: {
      status: sheet.status,
      detail: sheet.detail,
      configured: await isSheetConfigured(),
    },
  });
}
