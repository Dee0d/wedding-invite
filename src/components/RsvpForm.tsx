"use client";

import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import {
  ALLERGY_LABELS,
  ALLERGY_OPTIONS,
  DRINK_GROUPS,
  DRINK_LABELS,
  WEDDING,
} from "@/lib/wedding";
import {
  ALLERGY_ICONS,
  DRINK_ICONS,
  EnvelopeIcon,
  HeartIcon,
  CheckIcon,
  CoupleIcon,
} from "./Icons";
import { describeAllergies, describeDrinks } from "@/lib/rsvp";

type Errors = Record<string, string>;

function Chip({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: (p: { className?: string }) => ReactElement;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`group flex items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-left text-sm transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300 ${
        active
          ? "scale-[1.03] border-sage-500 bg-sage-500 text-white shadow-[0_14px_28px_-16px_rgba(47,74,56,0.9)]"
          : "border-sage-200 bg-white/80 text-forest hover:-translate-y-0.5 hover:border-sage-400 hover:bg-sage-50"
      }`}
    >
      <span
        className={`shrink-0 transition-transform duration-500 ${
          active ? "scale-110" : "group-hover:scale-110"
        }`}
      >
        <Icon />
      </span>
      <span className="leading-tight">{label}</span>
      {active && (
        <svg viewBox="0 0 24 24" className="ml-auto h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#b4553c]">
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16.5v.5" strokeLinecap="round" />
      </svg>
      {message}
    </p>
  );
}

/** Пункты, которые исключают остальные в своей группе */
const EXCLUSIVE_DRINK = "none";
const EXCLUSIVE_ALLERGY = "none";

const inputClass =
  "w-full rounded-2xl border border-sage-200 bg-white/85 px-4 py-3.5 text-forest placeholder:text-forest/35 transition-all duration-300 focus:border-sage-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sage-200";

export default function RsvpForm() {
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [plusOne, setPlusOne] = useState(false);
  const [drinks, setDrinks] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergiesOther, setAllergiesOther] = useState("");
  const [comment, setComment] = useState("");

  // Данные второй половинки
  const [partnerName, setPartnerName] = useState("");
  const [partnerDrinks, setPartnerDrinks] = useState<string[]>([]);
  const [partnerAllergies, setPartnerAllergies] = useState<string[]>([]);
  const [partnerAllergiesOther, setPartnerAllergiesOther] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const successRef = useRef<HTMLDivElement>(null);
  const isAttending = attending === true;

  /**
   * Переключение пункта. У «Не буду пить» и «Аллергии нет» особая роль:
   * выбор одного из них снимает все остальные в своей группе и убирает
   * строку «Другое» — смысла уточнять, если ответ уже однозначный.
   */
  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    id: string,
    exclusiveId?: string,
  ) => {
    setErrors((prev) => {
      if (!prev.drinks && !prev.allergies) return prev;
      const next = { ...prev };
      delete next.drinks;
      delete next.allergies;
      return next;
    });

    if (exclusiveId && id === exclusiveId) {
      // Нажали на эксклюзивный пункт: оставляем только его
      setList(list.includes(id) ? [] : [id]);
      return;
    }

    // Нажали на обычный пункт: эксклюзивный снимается
    const base = exclusiveId ? list.filter((x) => x !== exclusiveId) : list;
    setList(base.includes(id) ? base.filter((x) => x !== id) : [...base, id]);
  };

  const summary = useMemo(
    () => ({
      drinks: describeDrinks({
        fullName,
        attending: isAttending,
        plusOne,
        drinks,
        allergies,
        allergiesOther,
        comment,
      }),
      allergies: describeAllergies({
        fullName,
        attending: isAttending,
        plusOne,
        drinks,
        allergies,
        allergiesOther,
        comment,
      }),
    }),
    [fullName, isAttending, plusOne, drinks, allergies, allergiesOther, comment],
  );

  // Сводка по второй половинке
  const partnerSummary = useMemo(
    () => ({
      drinks: partnerDrinks.map((id) => DRINK_LABELS[id] ?? id).join(", ") || "—",
      allergies:
        [...partnerAllergies.map((id) => ALLERGY_LABELS[id] ?? id), partnerAllergiesOther]
          .filter(Boolean)
          .join(", ") || "—",
    }),
    [partnerDrinks, partnerAllergies, partnerAllergiesOther],
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setErrors({});

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          attending: attending === true,
          plusOne,
          drinks,
            allergies,
          allergiesOther,
          comment,
          partner: plusOne
            ? {
                name: partnerName,
                drinks: partnerDrinks,
                allergies: partnerAllergies,
                allergiesOther: partnerAllergiesOther,
              }
            : undefined,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        setErrors(data?.errors ?? { form: "Что-то пошло не так. Попробуйте ещё раз." });
        setStatus("idle");
        return;
      }

      setStatus("success");
      // Сообщаем плавающей кнопке «Ответить», что ответ уже отправлен —
      // она должна скрыться
      window.dispatchEvent(new CustomEvent("wedding:rsvp-sent"));
      // Панель «Ура, вы с нами!» должна встать по центру экрана
      window.requestAnimationFrame(() => {
        successRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
      window.dispatchEvent(
        new CustomEvent("wedding:confetti", {
          detail: { count: 160, power: 1.25, y: window.innerHeight * 0.45 },
        }),
      );
    } catch {
      setErrors({ form: "Нет связи с сервером. Проверьте интернет и попробуйте снова." });
      setStatus("idle");
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Экран «спасибо»                                                  */
  /* ---------------------------------------------------------------- */
  if (status === "success") {
    return (
      <div
        ref={successRef}
        data-testid="rsvp-success"
        className="paper grain relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-12"
      >
        <div className="relative mx-auto grid h-24 w-24 place-items-center">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-sage-400/50" />
          <span className="relative grid h-20 w-20 animate-pop place-items-center rounded-full bg-gradient-to-br from-sage-500 to-sage-700 text-white shadow-[0_18px_40px_-20px_rgba(47,74,56,0.9)]">
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.6">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <h3 className="mt-6 font-display text-4xl text-forest sm:text-5xl">
          {isAttending ? "Ура, вы с нами!" : "Спасибо, что предупредили"}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-forest/90">
          {isAttending
            ? `${fullName}, мы очень ждём вас на нашей свадьбе!`
            : `${fullName}, жаль, что не сможете прийти, но мы всё понимаем =)`}
        </p>

        <dl className="mx-auto mt-8 grid max-w-lg gap-4 text-left">
          {/* --- Гость --- */}
          <div className="rounded-2xl border border-sage-200 bg-white/80 p-4">
            <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-sage-700">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-400" />
              Гость
            </p>
            <div className="grid gap-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <dt className="w-32 shrink-0 text-xs uppercase tracking-[0.18em] text-sage-700">
                  Имя
                </dt>
                <dd className="font-medium text-forest">{fullName}</dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <dt className="w-32 shrink-0 text-xs uppercase tracking-[0.18em] text-sage-700">
                  Присутствие
                </dt>
                <dd className="font-medium text-forest">
                  {isAttending ? "Обязательно приду" : "К сожалению, не смогу"}
                </dd>
              </div>
              {isAttending && (
                <>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <dt className="w-32 shrink-0 text-xs uppercase tracking-[0.18em] text-sage-700">
                      Напитки
                    </dt>
                    <dd className="font-medium text-forest">{summary.drinks}</dd>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <dt className="w-32 shrink-0 text-xs uppercase tracking-[0.18em] text-sage-700">
                      Аллергии
                    </dt>
                    <dd className="font-medium text-forest">{summary.allergies}</dd>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* --- Вторая половинка --- */}
          {isAttending && plusOne && (
            <div className="rounded-2xl border border-sage-200 bg-sage-50/80 p-4">
              <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-sage-700">
                <CoupleIcon className="h-4 w-4" />
                Вторая половинка
              </p>
              <div className="grid gap-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <dt className="w-32 shrink-0 text-xs uppercase tracking-[0.18em] text-sage-700">
                    Имя
                  </dt>
                  <dd className="font-medium text-forest">{partnerName || "—"}</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <dt className="w-32 shrink-0 text-xs uppercase tracking-[0.18em] text-sage-700">
                    Напитки
                  </dt>
                  <dd className="font-medium text-forest">{partnerSummary.drinks}</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <dt className="w-32 shrink-0 text-xs uppercase tracking-[0.18em] text-sage-700">
                    Аллергии
                  </dt>
                  <dd className="font-medium text-forest">
                    {partnerSummary.allergies}
                  </dd>
                </div>
              </div>
            </div>
          )}

          {/* --- Общий комментарий --- */}
          {comment && (
            <div className="rounded-2xl border border-sage-200 bg-white/80 p-4">
              <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-sage-700">
                <span className="h-1.5 w-1.5 rounded-full bg-sage-400" />
                Комментарий
              </p>
              <dd className="font-medium text-forest">{comment}</dd>
            </div>
          )}
        </dl>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#top"
            className="rounded-full bg-sage-600 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300"
          >
            Вернуться к приглашению
          </a>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Форма                                                            */
  /* ---------------------------------------------------------------- */
  return (
    <form
      onSubmit={submit}
      noValidate
      data-testid="rsvp-form"
      className="paper grain relative overflow-hidden rounded-[2rem] p-6 sm:p-10"
    >
      <div className="relative">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-sage-700">
              Анкета гостя
            </p>
            <h3 className="mt-2 font-display text-3xl text-forest sm:text-4xl">
              Вы придёте?
            </h3>
          </div>
        </div>

        {/* --- Имя --- */}
        <div className="mt-8">
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-forest"
          >
            Имя и фамилия <span className="text-sage-600">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Например, Анна Смирнова"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
          />
          <FieldError message={errors.fullName} />
        </div>

        {/* --- Присутствие --- */}
        <fieldset className="mt-8">
          <legend className="mb-3 text-sm font-medium text-forest">
            Присутствие <span className="text-sage-600">*</span>
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { value: true, title: "Обязательно приду", icon: HeartIcon, hint: "Будем счастливы видеть" },
              { value: false, title: "К сожалению, нет", icon: EnvelopeIcon, hint: "Мы всё понимаем" },
            ].map((option) => {
              const active = attending === option.value;
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setAttending(option.value);
                    setErrors((p) => ({ ...p, attending: "" }));
                  }}
                  className={`group relative overflow-hidden rounded-3xl border p-5 text-left transition-all duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300 ${
                    active
                      ? "scale-[1.02] border-sage-500 bg-gradient-to-br from-sage-500 to-sage-700 text-white shadow-[0_22px_44px_-24px_rgba(47,74,56,0.95)]"
                      : "border-sage-200 bg-white/80 hover:-translate-y-1 hover:border-sage-400 hover:bg-sage-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl transition-transform duration-500 group-hover:scale-110 ${
                        active ? "bg-white/20" : "bg-sage-100"
                      }`}
                    >
                      <option.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-display text-xl leading-tight">
                        {option.title}
                      </span>
                      <span
                        className={`mt-0.5 block text-xs ${active ? "text-white/80" : "text-forest/60"}`}
                      >
                        {option.hint}
                      </span>
                    </span>
                  </span>
                  {active && (
                    <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-white text-sage-700">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3.5">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <FieldError message={errors.attending} />
        </fieldset>

        {/* --- Напитки (только для тех, кто придёт) --- */}
        {isAttending && (
          <div className="mt-8 animate-pop">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="mb-3 block text-sm font-medium text-forest">
                Что будете пить? <span className="text-sage-600">*</span>
              </label>
              <span className="mb-3 text-xs text-forest/80">
                Можно выбрать несколько
              </span>
            </div>

            <div className="space-y-6">
              {DRINK_GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-sage-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sage-400" />
                    {group.title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Chip
                        key={item.id}
                        icon={DRINK_ICONS[item.id]}
                        label={item.label}
                        active={drinks.includes(item.id)}
                        onClick={() => toggle(drinks, setDrinks, item.id, EXCLUSIVE_DRINK)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <FieldError message={errors.drinks} />
          </div>
        )}

        {/* --- Аллергии --- */}
        {isAttending && (
          <div className="mt-8 animate-pop">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="mb-3 block text-sm font-medium text-forest">
                На что у вас аллергия? <span className="text-sage-600">*</span>
              </label>
              <span className="mb-3 text-xs text-forest/80">
                Чтобы каждый мог спокойно поесть
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALLERGY_OPTIONS.map((item) => (
                <Chip
                  key={item.id}
                  icon={ALLERGY_ICONS[item.id]}
                  label={item.label}
                  active={allergies.includes(item.id)}
                  onClick={() => toggle(allergies, setAllergies, item.id, EXCLUSIVE_ALLERGY)}
                />
              ))}
            </div>
            {!allergies.includes(EXCLUSIVE_ALLERGY) && (
              <>
                <label
                  htmlFor="allergiesOther"
                  className="mt-5 mb-2 block text-sm font-medium text-forest"
                >
                  Другое
                </label>
                <textarea
                  id="allergiesOther"
                  rows={3}
                  placeholder="Например, не ем свинину."
                  value={allergiesOther}
                  onChange={(e) => setAllergiesOther(e.target.value)}
                  className={`${inputClass} resize-y`}
                />
              </>
            )}
            <FieldError message={errors.allergies} />
          </div>
        )}

        {/* --- +1 и комментарий --- */}
        {isAttending && (
          <div className="mt-8 animate-pop space-y-6">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-sage-200 bg-white/70 p-4 transition-colors hover:border-sage-400">
              <input
                type="checkbox"
                checked={plusOne}
                onChange={(e) => setPlusOne(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-sage-600"
              />
              <span>
                <span className="flex items-center gap-2 font-medium text-forest">
                  Со мной будет +1
                  <CoupleIcon className="h-5 w-5 text-sage-600" />
                </span>
                <span className="block text-sm text-forest/85">
                  Если будете со своей половинкой
                </span>
              </span>
            </label>

            {/* Поля второй половинки — те же, что у гостя */}
            {plusOne && (
              <div className="animate-pop space-y-6 rounded-2xl border border-sage-200 bg-sage-50/60 p-5">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-sage-800">
                  <CoupleIcon className="h-4 w-4" />
                  Вторая половинка
                </p>

                <div>
                  <label
                    htmlFor="partnerName"
                    className="mb-2 block text-sm font-medium text-forest"
                  >
                    Имя и фамилия
                  </label>
                  <input
                    id="partnerName"
                    type="text"
                    placeholder="Например, Иван Петров"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-forest">Алкоголь</p>
                  <div className="flex flex-wrap gap-2">
                    {DRINK_GROUPS[0].items.map((item) => (
                      <Chip
                        key={`partner-${item.id}`}
                        icon={DRINK_ICONS[item.id]}
                        label={item.label}
                        active={partnerDrinks.includes(item.id)}
                        onClick={() =>
                          toggle(
                            partnerDrinks,
                            setPartnerDrinks,
                            item.id,
                            EXCLUSIVE_DRINK,
                          )
                        }
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-forest">Аллергии</p>
                  <div className="flex flex-wrap gap-2">
                    {ALLERGY_OPTIONS.map((item) => (
                      <Chip
                        key={`partner-${item.id}`}
                        icon={ALLERGY_ICONS[item.id]}
                        label={item.label}
                        active={partnerAllergies.includes(item.id)}
                        onClick={() =>
                          toggle(
                            partnerAllergies,
                            setPartnerAllergies,
                            item.id,
                            EXCLUSIVE_ALLERGY,
                          )
                        }
                      />
                    ))}
                  </div>
                  {!partnerAllergies.includes(EXCLUSIVE_ALLERGY) && (
                    <input
                      type="text"
                      placeholder="Другое"
                      value={partnerAllergiesOther}
                      onChange={(e) => setPartnerAllergiesOther(e.target.value)}
                      className={`${inputClass} mt-3`}
                    />
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="comment" className="mb-2 block text-sm font-medium text-forest">
                Пожелания
              </label>
              <textarea
                id="comment"
                rows={3}
                placeholder="Песня, которая заведёт танцы, или просто тёплые слова"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        )}

        {errors.form && (
          <p className="mt-6 rounded-2xl border border-[#e5b7a8] bg-[#fdf1ec] px-4 py-3 text-sm text-[#a4442c]">
            {errors.form}
          </p>
        )}

        <div className="mt-9 flex flex-col items-center gap-4">
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-glow group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sage-600 to-forest px-9 py-4 font-display text-lg text-white shadow-[0_20px_44px_-22px_rgba(47,74,56,0.95)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_54px_-20px_rgba(47,74,56,0.9)] focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300 disabled:translate-y-0 disabled:opacity-70"
          >
            {status === "sending" ? (
              <>
                <svg viewBox="0 0 24 24" className="h-5 w-5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.2-8.6" strokeLinecap="round" />
                </svg>
                Отправляем…
              </>
            ) : (
              <>
                <EnvelopeIcon className="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5" />
                Отправить ответ
              </>
            )}
          </button>
          <p className="text-xs text-forest/80">
            Ответ попадёт в нашу свадебную таблицу — так мы всё подготовим заранее
          </p>
        </div>
      </div>
    </form>
  );
}
