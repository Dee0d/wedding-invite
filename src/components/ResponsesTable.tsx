"use client";

import { useMemo, useState } from "react";
import { ALLERGY_LABELS, DRINK_LABELS, WEDDING } from "@/lib/wedding";
import { SHEET_HEADERS } from "@/lib/rsvp";
import { CheckIcon } from "./Icons";

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

const HEADERS = [...SHEET_HEADERS];

function toCsvValue(value: string) {
  const escaped = value.replace(/"/g, '""');
  return /[";\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

function formatDrinks(row: Row) {
  const parts = row.drinks.map((id) => DRINK_LABELS[id] ?? id);
  if (row.drinkOther) parts.push(`свой вариант: ${row.drinkOther}`);
  return parts.join(", ") || "—";
}

function formatAllergies(row: Row) {
  const parts = row.allergies.map((id) => ALLERGY_LABELS[id] ?? id);
  return parts.join(", ") || "—";
}

function buildValues(row: Row) {
  return [
    new Date(row.createdAt).toISOString(),
    row.fullName,
    row.attending ? "Приду" : "Не смогу прийти",
    formatDrinks(row),
    formatAllergies(row),
    row.plusOne ? "Да" : "Нет",
    row.comment || "—",
  ];
}

export default function ResponsesTable({
  rows,
  sheetUrl,
}: {
  rows: Row[];
  sheetUrl: string;
}) {
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [copied, setCopied] = useState(false);

  const visible = useMemo(
    () =>
      rows.filter((row) =>
        filter === "all" ? true : filter === "yes" ? row.attending : !row.attending,
      ),
    [rows, filter],
  );

  const tsv = useMemo(() => {
    const head = HEADERS.join("\t");
    const body = rows.map((row) => buildValues(row).join("\t")).join("\n");
    return `${head}\n${body}`;
  }, [rows]);

  const csv = useMemo(() => {
    const head = HEADERS.join(";");
    const body = rows
      .map((row) => buildValues(row).map(toCsvValue).join(";"))
      .join("\n");
    return `${head}\n${body}`;
  }, [rows]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const download = () => {
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `otvety-gostey-${WEDDING.dateShort}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: `Все (${rows.length})` },
              {
                id: "yes",
                label: `Придут (${rows.filter((r) => r.attending).length})`,
              },
              {
                id: "no",
                label: `Не смогут (${rows.filter((r) => !r.attending).length})`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-full border px-4 py-2 text-sm transition-all ${
                filter === tab.id
                  ? "border-sage-500 bg-sage-500 text-white"
                  : "border-sage-200 bg-white/80 text-forest hover:border-sage-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full border border-sage-300 bg-white/85 px-4 py-2 text-sm font-medium text-forest transition-all hover:-translate-y-0.5 hover:border-sage-500"
          >
            <CheckIcon className="h-4 w-4" />
            {copied ? "Скопировано" : "Скопировать для таблицы"}
          </button>
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center gap-2 rounded-full border border-sage-300 bg-white/85 px-4 py-2 text-sm font-medium text-forest transition-all hover:-translate-y-0.5 hover:border-sage-500"
          >
            ⬇️ Скачать CSV
          </button>
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sage-600 to-forest px-4 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
          >
            Открыть Google-таблицу
          </a>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-sage-200 bg-white/70 px-6 py-12 text-center text-forest/60">
          Пока ни одного ответа. Как только гости начнут заполнять анкету, они
          появятся здесь.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-sage-200 bg-white/85">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-sage-100/80 text-xs uppercase tracking-[0.14em] text-sage-700">
                {HEADERS.map((header) => (
                  <th key={header} className="whitespace-nowrap px-4 py-3.5 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-sage-100 transition-colors hover:bg-sage-50/70"
                >
                  <td className="whitespace-nowrap px-4 py-3.5 text-forest/60">
                    {new Date(row.createdAt).toLocaleString("ru-RU", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-forest">
                    {row.fullName}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        row.attending
                          ? "bg-sage-100 text-sage-700"
                          : "bg-[#fdf1ec] text-[#a4442c]"
                      }`}
                    >
                      {row.attending ? "Приду" : "Не смогу"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-forest/80">{formatDrinks(row)}</td>
                  <td className="px-4 py-3.5 text-forest/80">
                    {formatAllergies(row)}
                  </td>
                  <td className="px-4 py-3.5 text-forest/80">
                    {row.plusOne ? "Да" : "—"}
                  </td>
                  <td className="max-w-xs px-4 py-3.5 text-forest/80">
                    {row.comment || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-forest/55">
        Подсказка: кнопка «Скопировать для таблицы» кладёт данные с заголовками в
        буфер обмена — достаточно вставить их в Google-таблицу.
      </p>
    </section>
  );
}
