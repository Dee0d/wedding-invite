import type { Metadata } from "next";
import Confetti from "@/components/Confetti";
import Countdown from "@/components/Countdown";
import FloatingCta from "@/components/FloatingCta";
import IntroGate from "@/components/IntroGate";
import MusicPlayer from "@/components/MusicPlayer";
import PetalField from "@/components/PetalField";
import PhotoDrop from "@/components/PhotoDrop";
import Reveal from "@/components/Reveal";
import RsvpForm from "@/components/RsvpForm";
import { Divider, FloralBranch, Leaf, Monogram, Sparkle } from "@/components/Decor";
import {
  CalendarIcon,
  ClockIcon,
  EnvelopeIcon,
  HangerIcon,
  LeafIcon,
  PinIcon,
  SparkleIcon,
} from "@/components/Icons";
import { PHRASES, PHOTOS, TIMELINE, WEDDING } from "@/lib/wedding";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Кирилл & Елизавета — приглашение на свадьбу · 28.11.2026",
  description:
    "28 ноября 2026, Курск, Киевская 69, ивент-пространство «Вместе». Подтвердите присутствие и расскажите о напитках и аллергиях.",
};

const MAP_LINKS = [
  {
    label: "Яндекс Карты",
    href: "https://yandex.ru/maps/?text=%D0%9A%D1%83%D1%80%D1%81%D0%BA%20%D0%9A%D0%B8%D0%B5%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%2069",
  },
  {
    label: "Google Maps",
    href: "https://www.google.com/maps/search/?api=1&query=%D0%9A%D1%83%D1%80%D1%81%D0%BA+%D0%9A%D0%B8%D0%B5%D0%B2%D1%81%D0%BA%D0%B0%D1%8F+69",
  },
  {
    label: "2ГИС",
    href: "https://2gis.ru/kursk/search/%D0%9A%D0%B8%D0%B5%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%2069",
  },
];

export default function HomePage() {
  return (
    <main id="top" className="relative overflow-hidden">
      <div aria-hidden="true" className="page-bg" data-testid="page-bg" />
      <PetalField />
      <PhotoDrop photos={PHOTOS.map((src) => ({ src }))} />
      <div aria-hidden="true" className="page-vignette" />
      <Confetti />
      <IntroGate />
      <MusicPlayer />
      <FloatingCta />

      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section
        className="relative grid min-h-[100svh] place-items-center px-5 py-20"
      >
        {/* фоновые пятна */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-gradient-to-b from-sage-50/75 via-cream/65 to-sage-100/75"
          />
          <div className="absolute -left-32 top-4 h-[26rem] w-[26rem] animate-blob rounded-full"
            style={{ background: "radial-gradient(circle, rgba(211,232,206,0.55) 0%, rgba(211,232,206,0) 70%)" }} />
          <div
            className="absolute -right-24 top-1/3 h-[30rem] w-[30rem] animate-blob rounded-full "
            style={{ animationDelay: "-7s", background: "radial-gradient(circle, rgba(220,205,242,0.35) 0%, rgba(220,205,242,0) 70%)" }}
          />
          <div
            className="absolute bottom-0 left-1/4 h-[22rem] w-[22rem] animate-blob rounded-full "
            style={{ animationDelay: "-14s", background: "radial-gradient(circle, rgba(249,212,186,0.40) 0%, rgba(249,212,186,0) 70%)" }}
          />
          <div
            className="absolute right-1/4 top-10 h-[18rem] w-[18rem] animate-blob rounded-full "
            style={{ animationDelay: "-21s", background: "radial-gradient(circle, rgba(201,229,243,0.35) 0%, rgba(201,229,243,0) 70%)" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.85),transparent_55%)]" />
        </div>

        <FloralBranch className="pointer-events-none absolute -left-6 top-24 hidden w-56 opacity-80 sm:block" />
        <FloralBranch
          className="pointer-events-none absolute -right-6 bottom-16 hidden w-56 rotate-180 opacity-80 sm:block"
          flip
        />
        <Sparkle className="left-[12%] top-[22%] h-5 w-5" delay={0.2} />
        <Sparkle className="right-[14%] top-[30%] h-4 w-4" delay={1.1} />
        <Sparkle className="left-[20%] bottom-[18%] h-3 w-3" delay={2} />
        <Sparkle className="right-[22%] bottom-[26%] h-5 w-5" delay={0.7} />
        <Leaf className="left-[8%] top-[55%] h-8 w-8" delay={0.4} />
        <Leaf className="right-[9%] top-[62%] h-6 w-6" delay={1.6} />

        <div className="relative flex flex-col items-center text-center">
          <div className="animate-pop">
            <Monogram />
          </div>

          <p
            className="mt-8 animate-pop whitespace-nowrap text-[10px] uppercase tracking-[0.32em] text-sage-800 sm:text-xs sm:tracking-[0.5em]"
            style={{ animationDelay: "120ms" }}
          >
            Приглашение на свадьбу
          </p>

          <h1
            className="mt-5 animate-pop whitespace-nowrap font-display text-[clamp(2.4rem,10.5vw,7.5rem)] font-light leading-[0.95] tracking-tight text-forest"
            style={{ animationDelay: "220ms" }}
          >
            {WEDDING.groom}
            <span className="mx-1 inline-block animate-heartbeat text-sage-500 sm:mx-3">
              &amp;
            </span>
            {WEDDING.bride}
          </h1>

          <div
            className="mt-7 flex animate-pop flex-wrap items-center justify-center gap-x-5 gap-y-2 text-forest/90"
            style={{ animationDelay: "340ms" }}
          >
            <span className="whitespace-nowrap font-display text-xl sm:text-3xl">
              {WEDDING.dateLabel}
            </span>
            <span className="hidden h-1.5 w-1.5 rounded-full bg-sage-400 sm:block" />
            <span className="whitespace-nowrap font-display text-xl text-forest/90 sm:text-3xl">
              {WEDDING.city}
            </span>
          </div>

          <p
            className="mt-6 max-w-xl animate-pop text-base leading-relaxed text-forest/90 sm:text-lg"
            style={{ animationDelay: "440ms" }}
          >
            {WEDDING.venue}, {WEDDING.address}
            <br />
            Мы будем счастливы видеть вас рядом в этот день.
          </p>

          <div className="mt-10 flex animate-pop justify-center" style={{ animationDelay: "560ms" }}>
            {/* Одна кнопка вместо двух: обе вели на анкету */}
            <a
              id="hero-cta"
              href="#rsvp"
              className="btn-glow group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sage-600 to-forest px-8 py-4 font-display text-lg text-white shadow-[0_22px_46px_-22px_rgba(47,74,56,0.95)] transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300"
            >
              <EnvelopeIcon className="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5" />
              Заполнить анкету
            </a>
          </div>
        </div>

      </section>

      {/* ============================================================ */}
      {/*  Бегущая лента                                                */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden border-y border-sage-200/80 bg-sage-100/70 py-3.5">
        <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap font-display text-lg text-forest/90 sm:text-xl">
          {[0, 1].map((half) => (
            <span key={half} className="flex items-center gap-8">
              {PHRASES.map((phrase) => (
                <span key={phrase} className="flex items-center gap-8">
                  <span>{phrase}</span>
                  <SparkleIcon className="h-3.5 w-3.5 text-sage-400" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Приглашение + дресс-код                                      */}
      {/* ============================================================ */}
      <section
        id="invite"
        className="relative px-5 py-24 sm:py-32"
      >
        <Leaf className="left-[6%] top-16 h-10 w-10" delay={0.3} />
        <Leaf className="right-[7%] bottom-20 h-8 w-8" delay={1.4} />

        <div className="mx-auto max-w-3xl text-center">
          <Reveal delay={120}>
            <h2 className="mt-5 font-display text-[clamp(2.25rem,6vw,4rem)] leading-tight text-forest">
              Мы приглашаем вас на нашу свадьбу
            </h2>
          </Reveal>

          <Reveal delay={220}>
            <Divider className="my-9" />
          </Reveal>

          <Reveal delay={300}>
            <div className="space-y-5 text-lg leading-relaxed text-forest/90">
              <p>
                Для нас начинается новая, счастливая глава — и мы хотим написать
                её в кругу самых близких.
              </p>
              <p>
                Ждём вас со счастливыми улыбками, радостными глазами и лёгкими
                танцевальными ногами =)
              </p>
            </div>
          </Reveal>
        </div>

        {/* Дресс-код */}
        <Reveal delay={120} variant="zoom" className="mx-auto mt-16 max-w-3xl">
          <div className="paper grain relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-12">
            <span className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 animate-blob rounded-full bg-butter/40 blur-2xl" />
            <HangerIcon className="mx-auto h-10 w-10 animate-bob text-sage-600" />
            <h3 className="mt-4 font-display text-3xl text-forest sm:text-4xl">
              Дресс-код — Elegant &amp; Comfortable
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-forest/90">
              Ждём вас в вечерних нарядах! Девушки — платья/костюмы, мужчины —{" "}
              <s className="decoration-sage-700/80 decoration-2">платья</s>
              /костюмы. Главное — чтобы вам было удобно танцевать и веселиться!
            </p>
          </div>
        </Reveal>
      </section>

      {/* ============================================================ */}
      {/*  Обратный отсчёт                                              */}
      {/* ============================================================ */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-sage-600 via-sage-700 to-forest px-5 py-12 sm:py-16"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-0 h-72 w-72 animate-blob rounded-full"
            style={{ background: "radial-gradient(circle, rgba(152,197,150,0.30) 0%, rgba(152,197,150,0) 70%)" }} />
          <div
            className="absolute -right-10 bottom-0 h-80 w-80 animate-blob rounded-full "
            style={{ animationDelay: "-9s", background: "radial-gradient(circle, rgba(220,205,242,0.25) 0%, rgba(220,205,242,0) 70%)" }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-64 w-64 animate-blob rounded-full "
            style={{ animationDelay: "-17s", background: "radial-gradient(circle, rgba(249,212,186,0.20) 0%, rgba(249,212,186,0) 70%)" }}
          />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.42em] text-sage-100/85">
              До торжества осталось
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-8">
              <Countdown />
            </div>
          </Reveal>
          <Reveal delay={260}>
            <p className="mt-6 font-display text-2xl text-sage-50 sm:text-3xl">
              {WEDDING.dateLabel} · {WEDDING.timeLabel} · {WEDDING.city}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Программа и место                                           */}
      {/* ============================================================ */}
      <section id="place" className="relative px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-center text-xs uppercase tracking-[0.42em] text-sage-800">
              Как всё пройдёт
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 text-center">
              <p className="font-display text-[clamp(3.5rem,14vw,7rem)] leading-none text-forest">
                {TIMELINE[0].time}
              </p>
              <h2 className="mt-4 font-display text-[clamp(1.75rem,6vw,2.75rem)] leading-tight text-forest">
                {TIMELINE[0].title}
              </h2>

              <h3 className="mt-10 font-display text-[clamp(1.5rem,5.5vw,2.25rem)] leading-tight text-forest">
                {WEDDING.venue}
              </h3>
              <p className="mt-2 text-forest/90">
                {WEDDING.city}, {WEDDING.address}
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {MAP_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-sage-300 bg-white/85 px-5 py-3 text-sm font-medium text-forest transition-all duration-300 hover:-translate-y-1 hover:border-sage-500 hover:bg-sage-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300"
                >
                  <PinIcon className="h-4 w-4" />
                  {link.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  RSVP                                                         */}
      {/* ============================================================ */}
      <section
        id="rsvp"
        className="relative overflow-hidden px-5 pb-32 pt-8 sm:pb-40"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full">
          <div className="absolute left-1/2 top-10 h-[30rem] w-[30rem] -translate-x-1/2 animate-blob rounded-full"
            style={{ background: "radial-gradient(circle, rgba(211,232,206,0.40) 0%, rgba(211,232,206,0) 70%)" }} />
          <div
            className="absolute right-0 top-1/3 h-72 w-72 animate-blob rounded-full "
            style={{ animationDelay: "-11s", background: "radial-gradient(circle, rgba(220,205,242,0.25) 0%, rgba(220,205,242,0) 70%)" }}
          />
          <div
            className="absolute left-0 bottom-10 h-72 w-72 animate-blob rounded-full "
            style={{ animationDelay: "-5s", background: "radial-gradient(circle, rgba(249,212,186,0.30) 0%, rgba(249,212,186,0) 70%)" }}
          />
        </div>

        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="mt-4 text-center font-display text-[clamp(2.25rem,6vw,4rem)] leading-tight text-forest">
              Анкета гостя
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p
              className="mx-auto mt-5 max-w-xl text-center text-lg text-forest/90"
            >
              Нам важно знать, придёте ли вы, что будете пить и от чего лучше
              отказаться за столом. Ответ займёт меньше минуты – а мы подготовим
              всё идеально.
            </p>
          </Reveal>

          <Reveal delay={280} className="mt-12">
            <RsvpForm />
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Подвал                                                       */}
      {/* ============================================================ */}
      <footer
        className="relative overflow-hidden px-5 py-16"
      >
        <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 animate-blob rounded-full"
            style={{ background: "radial-gradient(circle, rgba(211,232,206,0.50) 0%, rgba(211,232,206,0) 70%)" }} />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <LeafIcon className="h-9 w-9 animate-bob text-sage-500" />
          <p className="mt-4 font-display text-4xl text-forest sm:text-5xl">
            {WEDDING.groom} &amp; {WEDDING.bride}
          </p>
          <p className="mt-3 text-forest/90">
            {WEDDING.dateLabel} · {WEDDING.city} · {WEDDING.address}
          </p>
          <Divider className="my-8" />
          <p className="max-w-md text-sm text-forest/85">
            Спасибо, что читаете наше приглашение до конца. До встречи 28 ноября —
            будем счастливы видеть каждый ваш смех и объятия.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-sage-800">
            Сделано с любовью
          </p>
          <a
            href="/instructions/amvera-instruction.docx"
            download
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-sage-300 bg-white/70 px-5 py-2.5 text-sm text-forest/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-sage-500 hover:bg-sage-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300"
          >
            📄 Инструкция по размещению на Amvera (.docx)
          </a>
        </div>
      </footer>
    </main>
  );
}
