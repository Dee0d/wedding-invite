import "dotenv/config";
import type { Config } from "drizzle-kit";

/**
 * Адрес базы берём из переменной окружения.
 *
 * Важно: конфигурация читается и при сборке проекта (next build), когда
 * переменная DATABASE_URL ещё не определена. Чтобы сборка не падала,
 * здесь подставляется адрес-заглушка. Реальное подключение приложение
 * выполняет в рантайме через src/db/index.ts.
 *
 * Миграции на хостинге не запускаются автоматически — таблицы создаются
 * простым открытием адреса /api/setup-db после первого деплоя.
 */
const url =
  process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default {
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: { url },
} satisfies Config;
