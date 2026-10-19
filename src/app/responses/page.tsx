import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { rsvpResponses } from "@/db/schema";
import { desc } from "drizzle-orm";
import ResponsesTable from "@/components/ResponsesTable";
import SheetBanner from "@/components/SheetBanner";
import { EnvelopeIcon, HeartIcon, NoteIcon, PinIcon, UsersIcon } from "@/components/Icons";
import { ALLERGY_LABELS, DRINK_LABELS, WEDDING } from "@/lib/wedding";
import { isSheetConfigured } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ответы гостей — Кирилл & Елизавета",
  robots: { index: false, follow: false },
};

type Row = {
  id: number;
  fullName: string;
  attending: boolean;
  plusOne: boolean;
  drinks: string[];
  drinkOther: string | null;
  allergies: string[];
  comment: string | null;
  sheetSynced: boolean;
  sheetStatus: string | null;
  createdAt: Date;
};

export default async function ResponsesPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const token = process.env.ADMIN_TOKEN;

  if (token && key !== token) {
    return (
      <main className="grid min-h-screen place-items-center bg-cream px-6">
        <div className="paper max-w-md rounded-3xl p-10 text-center">
          <span className="text-sage-600"><PinIcon className="h-10 w-10" /></span>
          <h1 className="mt-4 font-display text-3xl text-forest">
            Нужен ключ доступа
          </h1>
          <p className="mt-3 text-forest/70">
            Добавьте <code className="rounded bg-sage-100 px-1.5 py-0.5">?key=…</code>{" "}
            к адресу страницы, чтобы посмотреть ответы гостей.
          </p>
        </div>
      </main>
    );
  }

  let rows: Row[] = [];
  let dbError: string | null = null;

  try {
    const data = await db
      .select()
      .from(rsvpResponses)
      .orderBy(desc(rsvpResponses.createdAt))
      .limit(500);
    rows = data as Row[];
  } catch (error) {
    console.error(error);
    dbError = "Не удалось загрузить ответы из базы данных.";
  }

  const attending = rows.filter((r) => r.attending).length;
  const declined = rows.length - attending;
  const plusOnes = rows.filter((r) => r.plusOne).length;
  const synced = rows.filter((r) => r.sheetSynced).length;

  const drinkCounts = new Map<string, number>();
  for (const row of rows) {
    for (const drink of row.drinks) {
      drinkCounts.set(drink, (drinkCounts.get(drink) ?? 0) + 1);
    }
  }
  const allergyCounts = new Map<string, number>();
  for (const row of rows) {
    for (const allergy of row.allergies) {
      allergyCounts.set(allergy, (allergyCounts.get(allergy) ?? 0) + 1);
    }
  }

  const topList = (map: Map<string, number>, labels: Record<string, string>) =>
    [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([id, count]) => ({ label: labels[id] ?? id, count }));

  const sheetConfigured = await isSheetConfigured();

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage-50 via-cream to-sage-100 px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-sage-700">
              Свадьба {WEDDING.groom} &amp; {WEDDING.bride} · {WEDDING.dateShort}
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-tight text-forest">
              Ответы гостей
            </h1>
            <p className="mt-2 max-w-2xl text-forest/70">
              Каждый отправленный ответ сохраняется здесь и дописывается в{" "}
              <a
                href={WEDDING.sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sage-700 underline decoration-sage-400 underline-offset-4 hover:text-forest"
              >
                Google-таблицу
              </a>
              .
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-sage-300 bg-white/85 px-5 py-3 text-sm font-medium text-forest transition-all hover:-translate-y-0.5 hover:border-sage-500"
          >
            ← К приглашению
          </Link>
        </header>

        {dbError && (
          <p className="mt-8 rounded-2xl border border-[#e5b7a8] bg-[#fdf1ec] px-4 py-3 text-sm text-[#a4442c]">
            {dbError}
          </p>
        )}

        {/* Статистика */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Всего ответов", value: rows.length, icon: EnvelopeIcon },
            { label: "Придут", value: attending, icon: HeartIcon },
            { label: "С +1", value: plusOnes, icon: UsersIcon },
            { label: "Не смогут", value: declined, icon: NoteIcon },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-sage-200 bg-white/80 p-5 shadow-[0_20px_44px_-34px_rgba(47,74,56,0.9)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.22em] text-sage-700">
                  {stat.label}
                </p>
                <stat.icon className="h-6 w-6 text-sage-700" />
              </div>
              <p className="mt-3 font-display text-4xl text-forest">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Популярные напитки и аллергии */}
        {(drinkCounts.size > 0 || allergyCounts.size > 0) && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-sage-200 bg-white/80 p-6">
              <h2 className="font-display text-2xl text-forest">Что пить будем</h2>
              <ul className="mt-4 space-y-2">
                {topList(drinkCounts, DRINK_LABELS).map((item) => (
                  <li key={item.label} className="flex items-center gap-3">
                    <span className="w-44 shrink-0 truncate text-sm text-forest/80">
                      {item.label}
                    </span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-sage-100">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600"
                        style={{
                          width: `${(item.count / (drinkCounts.size ? Math.max(...drinkCounts.values()) : 1)) * 100}%`,
                        }}
                      />
                    </span>
                    <span className="w-8 text-right font-display text-lg text-forest">
                      {item.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-sage-200 bg-white/80 p-6">
              <h2 className="font-display text-2xl text-forest">На что обратить внимание</h2>
              <ul className="mt-4 space-y-2">
                {topList(allergyCounts, ALLERGY_LABELS).map((item) => (
                  <li key={item.label} className="flex items-center gap-3">
                    <span className="w-44 shrink-0 truncate text-sm text-forest/80">
                      {item.label}
                    </span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-sage-100">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-blush to-peach"
                        style={{
                          width: `${(item.count / (allergyCounts.size ? Math.max(...allergyCounts.values()) : 1)) * 100}%`,
                        }}
                      />
                    </span>
                    <span className="w-8 text-right font-display text-lg text-forest">
                      {item.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Статус интеграции с Google-таблицей */}
        <SheetBanner
          configured={sheetConfigured}
          synced={synced}
          total={rows.length}
        />

        {/* Таблица */}
        <ResponsesTable rows={rows} sheetUrl={WEDDING.sheetUrl} />
      </div>
    </main>
  );
}
