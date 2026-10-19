import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rsvpResponses } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Список всех полученных ответов.
 * Если задана переменная окружения ADMIN_TOKEN, требуется ?key=<ADMIN_TOKEN>.
 */
export async function GET(request: NextRequest) {
  const token = process.env.ADMIN_TOKEN;
  const provided = request.nextUrl.searchParams.get("key");

  if (token && provided !== token) {
    return NextResponse.json(
      { ok: false, error: "Нужен ключ доступа" },
      { status: 401 },
    );
  }

  try {
    const rows = await db
      .select()
      .from(rsvpResponses)
      .orderBy(desc(rsvpResponses.createdAt))
      .limit(500);

    return NextResponse.json({ ok: true, rows });
  } catch (error) {
    console.error("responses error", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось загрузить ответы" },
      { status: 500 },
    );
  }
}
