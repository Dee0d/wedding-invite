import { ALLERGY_LABELS, DRINK_LABELS } from "./wedding";

export type RsvpInput = {
  fullName: string;
  attending: boolean;
  plusOne: boolean;
  drinks: string[];
  allergies: string[];
  allergiesOther: string;
  comment: string;
  /** Данные второй половинки (если гость идёт с кем-то) */
  partner?: {
    name: string;
    drinks: string[];
    allergies: string[];
    allergiesOther: string;
  };
};

export type ValidationResult =
  | { ok: true; data: RsvpInput }
  | { ok: false; errors: Record<string, string> };

const MAX_LEN = {
  fullName: 120,
  allergiesOther: 400,
  comment: 800,
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function parseRsvpInput(body: unknown): RsvpInput {
  const raw = (body ?? {}) as Record<string, unknown>;
  const partnerRaw = (raw.partner ?? {}) as Record<string, unknown>;
  const hasPartner =
    raw.plusOne === true || raw.plusOne === "yes"
      ? {
          name: asString(partnerRaw.name),
          drinks: asStringArray(partnerRaw.drinks),
          allergies: asStringArray(partnerRaw.allergies),
          allergiesOther: asString(partnerRaw.allergiesOther),
        }
      : undefined;

  return {
    partner: hasPartner,
    fullName: asString(raw.fullName).slice(0, MAX_LEN.fullName),
    attending: raw.attending === true || raw.attending === "yes",
    plusOne: raw.plusOne === true || raw.plusOne === "yes",
    drinks: asStringArray(raw.drinks).slice(0, 40),
    allergies: asStringArray(raw.allergies).slice(0, 40),
    allergiesOther: asString(raw.allergiesOther).slice(0, MAX_LEN.allergiesOther),
    comment: asString(raw.comment).slice(0, MAX_LEN.comment),
  };
}

export function validateRsvp(input: RsvpInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (input.fullName.length < 2) {
    errors.fullName = "Пожалуйста, напишите, как к вам обращаться";
  }

  const hasDrinks = input.drinks.length > 0;

  if (input.attending && !hasDrinks) {
    errors.drinks = "Выберите хотя бы один напиток — мы хотим всё подготовить";
  }

  if (
    input.attending &&
    input.allergies.length === 0 &&
    input.allergiesOther.length === 0
  ) {
    errors.allergies = "Отметьте «Аллергии нет» или расскажите о своих пожеланиях";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, data: input };
}

/** Человекочитаемые подписи выбранных вариантов. */
export function describeDrinks(input: RsvpInput): string {
  const picked = input.drinks.map((id) => DRINK_LABELS[id] ?? id);
  return picked.length ? picked.join(", ") : "—";
}

export function describeAllergies(input: RsvpInput): string {
  const picked = input.allergies.map((id) => ALLERGY_LABELS[id] ?? id);
  if (input.allergiesOther) picked.push(input.allergiesOther);
  return picked.length ? picked.join(", ") : "—";
}

/** Заголовки столбцов Google-таблицы. */
export const SHEET_HEADERS = [
  "Дата ответа",
  "Имя и фамилия",
  "Присутствие",
  "Напитки",
  "Аллергии и предпочтения",
  "+1 гость",
  "Имя и фамилия +1",
  "Напитки +1",
  "Аллергии +1",
  "Комментарий",
] as const;

/** Данные второй половинки в виде одной строки для таблицы. */
function describePartnerDrinks(partner: NonNullable<RsvpInput["partner"]>) {
  const picked = partner.drinks.map((id) => DRINK_LABELS[id] ?? id);
  return picked.length ? picked.join(", ") : "—";
}

function describePartnerAllergies(partner: NonNullable<RsvpInput["partner"]>) {
  const picked = partner.allergies.map((id) => ALLERGY_LABELS[id] ?? id);
  if (partner.allergiesOther) picked.push(partner.allergiesOther);
  return picked.length ? picked.join(", ") : "—";
}

/** Готовая строка для Google-таблицы. */
export function buildSheetRow(input: RsvpInput, createdAt: Date): string[] {
  const p = input.partner;
  return [
    createdAt.toISOString(),
    input.fullName,
    input.attending ? "Приду" : "Не смогу прийти",
    describeDrinks(input),
    describeAllergies(input),
    input.plusOne ? "Да" : "Нет",
    p && input.plusOne ? p.name || "—" : "—",
    p && input.plusOne ? describePartnerDrinks(p) : "—",
    p && input.plusOne ? describePartnerAllergies(p) : "—",
    input.comment || "—",
  ];
}
