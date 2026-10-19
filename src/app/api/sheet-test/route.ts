import { NextRequest, NextResponse } from "next/server";
import { appendRsvpToSheet } from "@/lib/googleSheets";
import { SHEET_HEADERS } from "@/lib/rsvp";

export const dynamic = "force-dynamic";

/**
 * Проверка подключения к Google-таблице: отправляет одну тестовую строку.
 * Нужен, чтобы пользователь сразу понял, работает ли настройка, не отправляя
 * настоящий ответ гостя.
 */
export async function POST(request: NextRequest) {
  const token = process.env.ADMIN_TOKEN;
  if (token && request.nextUrl.searchParams.get("key") !== token) {
    return NextResponse.json(
      { ok: false, error: "Нужен ключ доступа" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const url =
    typeof (body as { url?: unknown } | null)?.url === "string"
      ? (body as { url: string }).url.trim()
      : null;

  if (url && !/^https?:\/\/.+/.test(url)) {
    return NextResponse.json(
      { ok: false, error: "Нужна ссылка, начинающаяся с https://" },
      { status: 400 },
    );
  }

  const result = await appendRsvpToSheet({
    headers: SHEET_HEADERS,
    values: [
      new Date().toISOString(),
      "ПРОВЕРКА СВЯЗИ",
      "Тест",
      "—",
      "—",
      "—",
      "Эту строку можно удалить из таблицы",
    ],
    urlOverride: url,
  });

  return NextResponse.json({
    ok: result.status === "sent",
    status: result.status,
    detail: result.detail,
  });
}
