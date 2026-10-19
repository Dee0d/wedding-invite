import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const dynamic = "force-dynamic";

/**
 * Создаёт таблицы приложения, если их ещё нет.
 * Нужен, чтобы на хостинге не приходилось заходить в консоль:
 * после первого деплоя достаточно открыть /api/setup-db.
 */
export async function GET() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS rsvp_responses (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        attending BOOLEAN NOT NULL,
        plus_one BOOLEAN NOT NULL DEFAULT false,
        drinks TEXT[] NOT NULL DEFAULT '{}',
        drink_other TEXT,
        allergies TEXT[] NOT NULL DEFAULT '{}',
        allergies_other TEXT,
        comment TEXT,
        sheet_synced BOOLEAN NOT NULL DEFAULT false,
        sheet_status TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    return NextResponse.json({ ok: true, message: "Таблицы готовы" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Неизвестная ошибка базы";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
