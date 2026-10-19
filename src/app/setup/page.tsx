import type { Metadata } from "next";
import { db } from "@/db";
import { appSettings, SETTING_SHEET_URL } from "@/db/schema";
import { eq } from "drizzle-orm";
import SetupClient from "./SetupClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Настройка Google-таблицы — Кирилл & Елизавета",
  robots: { index: false, follow: false },
};

export default async function SetupPage() {
  let currentUrl: string | null = null;

  try {
    const [row] = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, SETTING_SHEET_URL));
    currentUrl = row?.value ?? null;
  } catch {
    // таблица настроек может отсутствовать — тогда просто показываем форму
  }

  return <SetupClient currentUrl={currentUrl} />;
}
