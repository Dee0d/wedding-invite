import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsPostgresqlDb?: Database;
};

function createPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required — укажите адрес PostgreSQL в переменных окружения",
    );
  }
  return new Pool({ connectionString: databaseUrl });
}

function resolvePool(): Pool {
  globalForDb.__arenaNextJsPostgresqlPool ??= createPool();
  return globalForDb.__arenaNextJsPostgresqlPool;
}

function resolveDb(): Database {
  globalForDb.__arenaNextJsPostgresqlDb ??= drizzle(resolvePool(), { schema });
  return globalForDb.__arenaNextJsPostgresqlDb;
}

/**
 * Подключение создаётся лениво — при первом обращении, а не при импорте
 * модуля. Иначе `next build` падал на этапе сбора данных страниц: он
 * импортирует все роуты (включая /api/health), а переменная окружения
 * DATABASE_URL на момент сборки может быть ещё не задана.
 */
export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const instance = resolveDb();
    const value = Reflect.get(instance as object, prop);
    return typeof value === "function" ? value.bind(instance) : value;
  },
  has(_target, prop) {
    return prop in (resolveDb() as object);
  },
});

export const pool = new Proxy({} as Pool, {
  get(_target, prop) {
    const instance = resolvePool();
    const value = Reflect.get(instance as object, prop);
    return typeof value === "function" ? value.bind(instance) : value;
  },
  has(_target, prop) {
    return prop in (resolvePool() as object);
  },
});
