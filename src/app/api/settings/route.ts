import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { appSettings, SETTING_SHEET_URL } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const ALLOWED_KEYS = [SETTING_SHEET_URL] as const;

function requireAccess(request: NextRequest) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return true;
  return request.nextUrl.searchParams.get("key") === token;
}

export async function GET() {
  try {
    const rows = await db.select().from(appSettings);
    return NextResponse.json({
      ok: true,
      settings: Object.fromEntries(rows.map((r) => [r.key, r.value])),
    });
  } catch {
    return NextResponse.json({ ok: false, settings: {} });
  }
}

export async function POST(request: NextRequest) {
  if (!requireAccess(request)) {
    return NextResponse.json(
      { ok: false, error: "Нужен ключ доступа" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось прочитать данные" },
      { status: 400 },
    );
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const key = typeof raw.key === "string" ? raw.key : "";
  const value = typeof raw.value === "string" ? raw.value.trim() : "";

  if (!ALLOWED_KEYS.includes(key as (typeof ALLOWED_KEYS)[number])) {
    return NextResponse.json(
      { ok: false, error: "Неизвестная настройка" },
      { status: 400 },
    );
  }

  if (value && !/^https?:\/\/.+/.test(value)) {
    return NextResponse.json(
      { ok: false, error: "Нужна ссылка, начинающаяся с https://" },
      { status: 400 },
    );
  }

  try {
    if (value) {
      await db
        .insert(appSettings)
        .values({ key, value })
        .onConflictDoUpdate({ target: appSettings.key, set: { value } });
    } else {
      await db.delete(appSettings).where(eq(appSettings.key, key));
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить настройку" },
      { status: 500 },
    );
  }
}
