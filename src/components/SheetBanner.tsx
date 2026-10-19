"use client";

import { useState } from "react";
import Link from "next/link";
import { CarIcon, CheckIcon } from "./Icons";

type Props = {
  configured: boolean;
  synced: number;
  total: number;
};

/** Статус подключения Google-таблицы + кнопка «дослать всё сейчас». */
export default function SheetBanner({ configured, synced, total }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const resync = async () => {
    setState("loading");
    setMessage("");
    try {
      const response = await fetch("/api/sync", { method: "POST" });
      const data = await response.json().catch(() => null);
      if (response.ok && data?.ok) {
        setState("done");
        setMessage(
          data.sent > 0
            ? `Готово! Дописано строк: ${data.sent}. Проверьте таблицу.`
            : "Все ответы уже есть в таблице — новых строк не было.",
        );
      } else {
        setState("error");
        setMessage(data?.error ?? "Не удалось выполнить отправку.");
      }
    } catch {
      setState("error");
      setMessage("Нет связи с сервером.");
    }
  };

  if (!configured) {
    return (
      <div className="mt-6 rounded-2xl border-2 border-[#e0a35f] bg-[#fff6e8] p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="shrink-0 text-sage-700"><CarIcon className="h-8 w-8" /></span>
          <div className="min-w-64 flex-1">
            <h2 className="font-display text-2xl text-forest">
              Google-таблица ещё не подключена
            </h2>
            <p className="mt-2 text-forest/80">
              Именно поэтому таблица пустая. Нужно один раз разрешить сайту писать
              в неё — это делается на отдельной странице и занимает около минуты.
              Перезапускать сервер и править файлы не требуется.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/setup"
                className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sage-600 to-forest px-6 py-3 font-display text-lg text-white transition-transform duration-300 hover:-translate-y-1"
              >
                Настроить подключение
              </Link>
              <p className="self-center text-sm text-forest/60">
                Пока ответы хранятся на сайте — их можно скопировать кнопкой ниже.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-sage-300 bg-sage-50 p-6">
      <div className="flex flex-wrap items-start gap-4">
        <span className="shrink-0 text-sage-600"><CheckIcon className="h-8 w-8" /></span>
        <div className="min-w-64 flex-1">
          <h2 className="font-display text-2xl text-forest">
            Google-таблица подключена
          </h2>
          <p className="mt-2 text-forest/80">
            Каждый новый ответ попадает в таблицу автоматически. Успешно дописано
            строк: <strong>{synced}</strong> из <strong>{total}</strong>.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={resync}
              disabled={state === "loading"}
              className="inline-flex items-center gap-2 rounded-full border border-sage-400 bg-white px-5 py-3 text-sm font-medium text-forest transition-all hover:-translate-y-0.5 hover:bg-sage-100 disabled:opacity-60"
            >
              {state === "loading" ? "Отправляем…" : "Дослать ответы в таблицу"}
            </button>
            <Link
              href="/setup"
              className="text-sm font-medium text-sage-700 underline decoration-sage-400 underline-offset-4 hover:text-forest"
            >
              Изменить настройки
            </Link>
          </div>
          {message && (
            <p
              className={`mt-3 rounded-xl px-4 py-2.5 text-sm ${
                state === "error"
                  ? "bg-[#fdf1ec] text-[#a4442c]"
                  : "bg-sage-100 text-forest"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
