"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WEDDING } from "@/lib/wedding";

const APPS_SCRIPT_CODE = `var HEADERS = [
  'Дата ответа', 'Имя и фамилия', 'Присутствие', 'Напитки',
  'Аллергии и предпочтения', '+1 гость', 'Комментарий'
];

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(payload.headers || HEADERS);
      sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
    }

    sheet.appendRow(payload.values);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

export default function SetupClient({ currentUrl }: { currentUrl: string | null }) {
  const [url, setUrl] = useState(currentUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [key, setKey] = useState("");

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<
    { ok: boolean; detail: string } | null
  >(null);

  useEffect(() => {
    setKey(new URLSearchParams(window.location.search).get("key") ?? "");
  }, []);

  const suffix = () => (key ? `?key=${encodeURIComponent(key)}` : "");

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("Не удалось скопировать. Выделите код вручную и скопируйте.");
    }
  };

  const test = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch(`/api/sheet-test${suffix()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await response.json().catch(() => null);
      setTestResult({
        ok: response.ok && data?.ok === true,
        detail: data?.detail ?? "Неизвестный ответ сервера.",
      });
    } catch {
      setTestResult({ ok: false, detail: "Нет связи с сервером." });
    } finally {
      setTesting(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const response = await fetch(`/api/settings${suffix()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "google_sheet_webapp_url", value: url.trim() }),
      });
      const data = await response.json().catch(() => null);
      if (response.ok && data?.ok) {
        setSaved(true);
      } else {
        setError(data?.error ?? "Не удалось сохранить.");
      }
    } catch {
      setError("Нет связи с сервером.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage-50 via-cream to-sage-100 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header>
          <p className="text-xs uppercase tracking-[0.36em] text-sage-700">
            Свадьба {WEDDING.groom} &amp; {WEDDING.bride} · {WEDDING.dateShort}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,6vw,3.25rem)] leading-tight text-forest">
            Подключение Google-таблицы
          </h1>
          <p className="mt-3 text-forest/75">
            Сейчас ответы гостей сохраняются только на сайте. Чтобы они сами
            попадали в таблицу, нужно один раз дать сайту разрешение на запись.
            Ниже — 4 шага, всё делается мышкой, файлы править не надо.
          </p>
        </header>

        {/* ------------------------------- Шаги ------------------------------- */}
        <ol className="mt-10 space-y-5">
          {[
            {
              title: "Откройте свою таблицу",
              body: "Перейдите по ссылке на таблицу, куда должны падать ответы.",
              link: WEDDING.sheetUrl,
              linkLabel: "Открыть Google-таблицу",
            },
            {
              title: "Создайте скрипт",
              body: "В меню таблицы выберите «Расширения» → «Apps Script». Откроется новый редактор с пустой строкой кода.",
            },
            {
              title: "Вставьте готовый код",
              body: "Удалите всё, что там есть, и вставьте код из окошка ниже. Потом нажмите значок дискеты (Сохранить).",
            },
            {
              title: "Опубликуйте и скопируйте ссылку",
              body: "Нажмите синюю кнопку «Начать развёртывание» → «Новое развёртывание» → шестерёнка → «Веб-приложение». В поле «Кто имеет доступ» выберите «Все». Нажмите «Развернуть», разрешите доступ и скопируйте ссылку, которая появится (она заканчивается на /exec).",
            },
          ].map((step, i) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-2xl border border-sage-200 bg-white/80 p-5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage-500 font-display text-xl text-white">
                {i + 1}
              </span>
              <div className="flex-1">
                <h2 className="font-display text-xl text-forest">{step.title}</h2>
                <p className="mt-1.5 text-forest/80">{step.body}</p>
                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-sage-300 bg-sage-50 px-4 py-2 text-sm font-medium text-forest transition-all hover:-translate-y-0.5 hover:border-sage-500"
                  >
                    {step.linkLabel}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* ------------------------------- Код ------------------------------- */}
        <section className="mt-8 rounded-2xl border border-sage-200 bg-white/80 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl text-forest">Код для вставки</h2>
            <button
              type="button"
              onClick={copyCode}
              className="inline-flex items-center gap-2 rounded-full border border-sage-300 bg-sage-50 px-4 py-2 text-sm font-medium text-forest transition-all hover:-translate-y-0.5 hover:border-sage-500"
            >
              {copied ? "Скопировано" : "Скопировать код"}
            </button>
          </div>
          <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-forest p-4 text-xs leading-relaxed text-sage-50">
            <code>{APPS_SCRIPT_CODE}</code>
          </pre>
          {error && (
            <p className="mt-3 text-sm text-[#a4442c]">{error}</p>
          )}
        </section>

        {/* ------------------------------- Ссылка ------------------------------- */}
        <section className="mt-8 rounded-2xl border-2 border-sage-300 bg-sage-50 p-6">
          <h2 className="font-display text-2xl text-forest">
            Вставьте ссылку из шага 4
          </h2>
          <p className="mt-2 text-forest/75">
            Она выглядит так:{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-sm">
              https://script.google.com/macros/s/…/exec
            </code>
          </p>

          <label htmlFor="sheetUrl" className="mt-5 mb-2 block text-sm font-medium text-forest">
            Ссылка на веб-приложение
          </label>
          <input
            id="sheetUrl"
            type="url"
            inputMode="url"
            placeholder="https://script.google.com/macros/s/XXXXXXXX/exec"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-2xl border border-sage-300 bg-white px-4 py-3.5 text-forest placeholder:text-forest/35 focus:border-sage-500 focus:outline-none focus:ring-4 focus:ring-sage-200"
          />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sage-600 to-forest px-7 py-3.5 font-display text-lg text-white transition-transform duration-300 hover:-translate-y-1 disabled:opacity-60"
            >
              {saving ? "Сохраняем…" : "Сохранить"}
            </button>
            <button
              type="button"
              onClick={test}
              disabled={testing || url.trim().length < 10}
              className="inline-flex items-center gap-2 rounded-full border border-sage-400 bg-white px-5 py-3.5 text-sm font-medium text-forest transition-all hover:-translate-y-0.5 hover:bg-sage-100 disabled:opacity-50"
            >
              {testing ? "Проверяем…" : "Проверить связь"}
            </button>
            {currentUrl && (
              <span className="rounded-full bg-sage-100 px-4 py-2 text-sm text-forest">
                Подключение уже настроено
              </span>
            )}
          </div>

          {testResult && (
            <div
              className={`mt-5 rounded-xl border p-4 ${
                testResult.ok
                  ? "border-sage-300 bg-white"
                  : "border-[#e0a35f] bg-[#fff6e8]"
              }`}
            >
              <p className="font-medium text-forest">
                {testResult.ok
                  ? "✅ Связь есть! В таблицу добавлена тестовая строка."
                  : "⚠️ Не получилось записать в таблицу"}
              </p>
              <p className="mt-1 text-sm text-forest/75">{testResult.detail}</p>
              {testResult.ok && (
                <a
                  href={WEDDING.sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-sage-700 underline decoration-sage-400 underline-offset-4"
                >
                  Открыть таблицу и проверить →
                </a>
              )}
            </div>
          )}

          {saved && (
            <div className="mt-5 rounded-xl border border-sage-300 bg-white p-4">
              <p className="font-medium text-forest">
                Готово! Настройка сохранена, перезапуск не нужен.
              </p>
              <p className="mt-1 text-sm text-forest/75">
                Теперь отправьте тестовый ответ на главной странице и проверьте
                таблицу — строка должна появиться через пару секунд.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="rounded-full border border-sage-300 bg-white px-4 py-2 text-sm font-medium text-forest hover:border-sage-500"
                >
                  ← На главную
                </Link>
                <a
                  href="/responses"
                  className="rounded-full border border-sage-300 bg-white px-4 py-2 text-sm font-medium text-forest hover:border-sage-500"
                >
                  Посмотреть ответы →
                </a>
              </div>
            </div>
          )}
        </section>

        <p className="mt-8 text-sm text-forest/60">
          Что-то не получилось? На странице ответов есть кнопка
          «Дослать ответы в таблицу» — она повторит отправку всех сохранённых
          анкет, даже тех, что были заполнены до подключения.
        </p>
      </div>
    </main>
  );
}
