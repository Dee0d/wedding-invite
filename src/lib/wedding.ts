/** Общие данные торжества — используются и на сервере, и на клиенте. */

export const WEDDING = {
  groom: "Кирилл",
  bride: "Елизавета",
  /** 28 ноября 2026, 17:00 (Курск, UTC+3) */
  dateISO: "2026-11-28T17:00:00+03:00",
  dateLabel: "28 ноября 2026",
  dateShort: "28.11.2026",
  timeLabel: "17:00",
  city: "Курск",
  venue: "Ивент-пространство «Вместе»",
  address: "Киевская, 69",
  dressCode: null as string | null,
  sheetUrl:
    "https://docs.google.com/spreadsheets/d/1F8no9k6y2IaXTN5jOQ8PfImMX8_8I4VoEW_wALs4MrM/edit?gid=0#gid=0",
  /** Фоновая музыка (файл лежит в public/audio) */
  music: "/audio/background.mp3",
  musicTitle: "Привет — Женя Трофимов, Комната культуры",
} as const;

export type DrinkOption = {
  id: string;
  label: string;
};

export const DRINK_GROUPS: { id: string; title: string; hint: string; items: DrinkOption[] }[] = [
  {
    id: "alcohol",
    title: "Алкогольные",
    hint: "Отметьте то, что будете пить",
    items: [
      { id: "champagne", label: "Шампанское" },
      { id: "wine", label: "Вино" },
      { id: "strong", label: "Крепкий алкоголь" },
      { id: "none", label: "Не буду пить" },
    ],
  },
];

export const ALL_DRINKS: DrinkOption[] = DRINK_GROUPS.flatMap((g) => g.items);

export const DRINK_LABELS: Record<string, string> = Object.fromEntries(
  ALL_DRINKS.map((d) => [d.id, d.label]),
);

export const ALLERGY_OPTIONS: DrinkOption[] = [
  { id: "nuts", label: "Орехи" },
  { id: "lactose", label: "Лактоза" },
  { id: "gluten", label: "Глютен" },
  { id: "citrus", label: "Цитрусовые" },
  { id: "honey", label: "Мёд" },
  { id: "seafood", label: "Морепродукты" },
  { id: "berries", label: "Ягоды" },
  { id: "eggs", label: "Яйца" },
  { id: "vegan", label: "Вегетарианец / веган" },
  { id: "none", label: "Аллергии нет" },
];

export const ALLERGY_LABELS: Record<string, string> = Object.fromEntries(
  ALLERGY_OPTIONS.map((a) => [a.id, a.label]),
);

/**
 * Программа дня.
 * Пока подтверждён только сбор гостей в 17:00 на месте банкета.
 */
export const TIMELINE: { time: string; title: string; text: string }[] = [
  {
    time: "17:00",
    title: "Встреча гостей",
    text: "Ждём вас на месте банкета — ивент-пространство «Вместе», Киевская, 69.",
  },
];

/**
 * Милые фразы для бегущей строки: про любовь и краткие цитаты поэтов.
 */
export const PHRASES: string[] = [
  "«Мы совпали с тобой, совпали...» — Роберт Рождественский",
  "«Без любви жить легче. Но без неё нет смысла» — Л. Н. Толстой",
  "«Люблю тебя сейчас, не тайно — напоказ» — Е. А. Евтушенко",
  "«Она шла — и становилось светлее» — М. Цветаева",
  "«В её улыбке — целый мир» — А. Блок",
  "«Если любишь, то любишь всего человека» — Л. Н. Толстой",
  "«Когда любишь, столько нежности открываешь в себе» — А. П. Чехов",
  "«Надо верить тому, кого любишь, — в этом высшее доказательство любви» — А. Грин",
  "«Истина без любви — ложь» — Ф. М. Достоевский",
  "«Счастье — любить и быть любимым» — И. А. Бунин",
  "«Её голос — будто песня без слов» — К. Бальмонт",
  "«Она — как тихий рассвет над рекой» — И. А. Бунин",
  "«Рядом с ней даже тишина звучала иначе» — В. Маяковский",
];

/** Фотографии молодожёнов */
/**
 * Порядок показа соответствует позиции: 1, 3, 5 уходят на левый край,
 * 2, 4, 6 — на правый.
 */
export const PHOTOS: string[] = [
  "/photos/photo-1.jpg",
  "/photos/photo-2.jpg",
  "/photos/photo-3.jpg",
  "/photos/photo-4.jpg",
  "/photos/photo-5.jpg",
  "/photos/photo-6.jpg",
];