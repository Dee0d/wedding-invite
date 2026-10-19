/**
 * Интеграция с Google-таблицей.
 *
 * Самый простой и безопасный способ писать в чужую таблицу без серверных
 * ключей — развернуть Google Apps Script как веб-приложение (« anyone with
 * the link») и отправлять на его URL POST-запросы. Скрипт на той стороне
 * делает `sheet.appendRow(...)`.
 *
 * URL можно задать двумя способами:
 *   1. переменной окружения GOOGLE_SHEET_WEBAPP_URL (см. .env.example)
 *   2. на странице /setup — тогда значение хранится в базе и перезапуск
 *      сервера не нужен
 *
 * Если URL не задан, ответ всё равно сохраняется в PostgreSQL и остаётся
 * доступен на странице /responses (оттуда его можно скопировать или
 * выгрузить CSV).
 */

import { db } from "@/db";
import { appSettings, SETTING_SHEET_URL } from "@/db/schema";
import { eq } from "drizzle-orm";

const WEBHOOK_ENV_KEYS = [
  "GOOGLE_SHEET_WEBAPP_URL",
  "GOOGLE_SHEETS_WEBAPP_URL",
  "GOOGLE_SHEET_WEBHOOK_URL",
  "GOOGLE_SHEETS_WEBHOOK_URL",
] as const;

export type SheetSync =
  | { status: "sent"; detail: string }
  | { status: "skipped"; detail: string }
  | { status: "failed"; detail: string };

async function resolveWebhookUrl(): Promise<string | null> {
  // 1. Переменная окружения имеет приоритет
  for (const key of WEBHOOK_ENV_KEYS) {
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }

  // 2. Значение, сохранённое через страницу /setup
  try {
    const [row] = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, SETTING_SHEET_URL));
    if (row?.value && row.value.trim()) return row.value.trim();
  } catch (error) {
    console.error("Не удалось прочитать настройки из базы:", error);
  }

  return null;
}

export async function isSheetConfigured(): Promise<boolean> {
  return (await resolveWebhookUrl()) !== null;
}

/**
 * Дописывает готовый ответ гостя в Google-таблицу.
 * `urlOverride` позволяет проверить ещё несохранённую ссылку (страница /setup).
 * Никогда не бросает исключение — сбой синхронизации не должен ломать приём ответов.
 */
export async function appendRsvpToSheet(payload: {
  values: string[];
  headers: readonly string[];
  urlOverride?: string | null;
}): Promise<SheetSync> {
  const url = payload.urlOverride?.trim() || (await resolveWebhookUrl());

  if (!url) {
    return {
      status: "skipped",
      detail:
        "Google-таблица не подключена. Откройте страницу /setup и следуйте инструкции.",
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      signal: controller.signal,
      body: JSON.stringify({
        event: "wedding-rsvp",
        headers: [...payload.headers],
        values: payload.values,
      }),
    });

    const text = await response.text().catch(() => "");

    if (!response.ok) {
      return {
        status: "failed",
        detail: `Google-таблица ответила ${response.status}: ${text.slice(0, 200)}`,
      };
    }

    // Apps Script иногда отвечает HTML-страницей ошибки — учитываем это
    if (text.includes("<HTML>") || text.includes("<!DOCTYPE")) {
      return {
        status: "failed",
        detail:
          "Google вернул страницу вместо данных. Проверьте, что доступ к веб-приложению открыт для «Anyone».",
      };
    }

    return { status: "sent", detail: "Строка добавлена в Google-таблицу" };
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError"
        ? "таймаут запроса"
        : error instanceof Error
          ? error.message
          : "неизвестная ошибка";
    return {
      status: "failed",
      detail: `Не удалось записать в таблицу: ${reason}`,
    };
  } finally {
    clearTimeout(timer);
  }
}
