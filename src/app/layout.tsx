import type { Metadata } from "next";
import "./globals.css";
import Boot from "@/components/Boot";

export const metadata: Metadata = {
  // metadataBase: базовый адрес сайта для абсолютных ссылок в og:image.
  // Берём из переменной окружения, чтобы один конфиг работал на любом
  // хостинге. Относительный путь /og/og-logo.png превращается в полный URL.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://amvera.ru"),
  title: "Кирилл & Елизавета — приглашение на свадьбу 28.11.2026",
  description:
    "Приглашение на свадьбу Кирилла и Елизаветы. 28 ноября 2026, Курск, Киевская 69, ивент-пространство «Вместе».",
  keywords: [
    "свадьба",
    "приглашение",
    "Кирилл и Елизавета",
    "Курск",
    "28.11.2026",
  ],
  openGraph: {
    title: "Кирилл & Елизавета — приглашение на свадьбу",
    description:
      "28 ноября 2026, Курск, Киевская 69, ивент-пространство «Вместе». Подтвердите присутствие и расскажите о напитках и аллергиях.",
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: "/og/og-logo.png",
        width: 1200,
        height: 630,
        alt: "Кирилл & Елизавета — 28.11.2026, Курск",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Кирилл & Елизавета — приглашение на свадьбу",
    description:
      "28 ноября 2026, Курск, Киевская 69, ивент-пространство «Вместе».",
    images: ["/og/og-logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-cream text-forest antialiased">
        <Boot />
        {children}
      </body>
    </html>
  );
}
