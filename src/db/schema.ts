import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

/**
 * Ответы гостей на приглашение.
 * Каждый ответ дополнительно отправляется в Google-таблицу
 * (см. src/lib/googleSheets.ts), а здесь хранится как надёжный бэкап.
 */
export const rsvpResponses = pgTable("rsvp_responses", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  attending: boolean("attending").notNull(),
  plusOne: boolean("plus_one").notNull().default(false),
  drinks: text("drinks")
    .array()
    .notNull()
    .default([]),
  drinkOther: text("drink_other"),
  allergies: text("allergies")
    .array()
    .notNull()
    .default([]),
  comment: text("comment"),
  /** Удалось ли дописать строку в Google-таблицу */
  sheetSynced: boolean("sheet_synced").notNull().default(false),
  sheetStatus: text("sheet_status"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type RsvpResponse = typeof rsvpResponses.$inferSelect;
export type NewRsvpResponse = typeof rsvpResponses.$inferInsert;

/**
 * Настройки приложения, изменяемые из веб-интерфейса (страница /setup).
 * Так не нужно править .env и перезапускать сервер вручную.
 */
export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type AppSetting = typeof appSettings.$inferSelect;

/** Ключ настройки с URL веб-приложения Google Apps Script. */
export const SETTING_SHEET_URL = "google_sheet_webapp_url";
