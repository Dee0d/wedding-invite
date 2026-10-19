import type { ReactElement, ReactNode } from "react";

/**
 * Набор тонких линейных иконок (24×24, stroke=currentColor).
 * Заменяют эмодзи, чтобы оформление выглядело цельно и «по-взрослому».
 */

type IconProps = {
  className?: string;
};

function Icon({
  children,
  className = "h-5 w-5",
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 *  Интерфейсные
 * ------------------------------------------------------------------ */

export const CalendarIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <rect x="3.2" y="5" width="17.6" height="16" rx="2.4" />
    <path d="M3.2 9.6h17.6M8.2 2.8v4M15.8 2.8v4" />
    <path d="M7.6 13.4h2M11 13.4h2M14.4 13.4h2M7.6 17h2M11 17h2" />
  </Icon>
);

export const ClockIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M12 6.8V12l3.6 2.2" />
  </Icon>
);

export const PinIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 21.2s-6.8-6.1-6.8-11A6.8 6.8 0 0 1 18.8 10.2c0 4.9-6.8 11-6.8 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);

export const HangerIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 8.1v1.5" />
    <path d="M12 8.1a1.8 1.8 0 1 1 1.8-1.8" />
    <path d="M12 8.1 3.7 14.5c-1 .7-.5 2.3.7 2.3h15.2c1.2 0 1.7-1.6.7-2.3L12 8.1Z" />
  </Icon>
);

export const EnvelopeIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <rect x="2.6" y="5" width="18.8" height="14" rx="2.4" />
    <path d="M3.4 7.2 12 13.2l8.6-6" />
  </Icon>
);

export const HeartIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 20.2S4.4 15.4 4.4 10.1A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.6 2.8c0 5.3-7.6 10.1-7.6 10.1Z" />
  </Icon>
);

export const LeafIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 3.2C7.2 5.6 4.2 9.2 4.2 14a6 6 0 0 0 12 0c0-4.8-3-8.4-4.2-10.8Z" />
    <path d="M12 20.8V9.4" />
  </Icon>
);

export const CheckIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M5 12.8l4.2 4.2L19 6.6" />
  </Icon>
);

export const UsersIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.4 20.2c0-3.1 2.5-5.2 5.6-5.2s5.6 2.1 5.6 5.2" />
    <circle cx="17.2" cy="9.2" r="2.5" />
    <path d="M16.2 15.2c2.6.3 4.5 2.3 4.5 5" />
  </Icon>
);

export const ArrowDownIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 4.6v14.8M6.2 13.4 12 19.2l5.8-5.8" />
  </Icon>
);

export const CarIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M4 16.4v-3.6l1.9-4.2h12.2L20 12.8v3.6" />
    <path d="M4 16.4h16M9.4 12.8h5.2" />
    <circle cx="7.6" cy="17.6" r="1.8" />
    <circle cx="16.4" cy="17.6" r="1.8" />
  </Icon>
);

export const NoteIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M4.4 19.6l.7-3.4L16 5.3a2 2 0 0 1 2.8 0l.9.9a2 2 0 0 1 0 2.8L8.4 19.6Z" />
    <path d="M14.6 6.7l2.7 2.7" />
  </Icon>
);

export const MusicIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M9.4 17.4V5.6l9.4-1.8v11.8" />
    <circle cx="7" cy="17.6" r="2.4" />
    <circle cx="16.4" cy="15.8" r="2.4" />
  </Icon>
);

export const PlayIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M8.4 5.4 18.6 12l-10.2 6.6Z" />
  </Icon>
);

export const PauseIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M9.2 5.4v13.2M14.8 5.4v13.2" />
  </Icon>
);

export const SparkleIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 3.2l1.9 5.3 5.3 1.9-5.3 1.9L12 17.6l-1.9-5.3L4.8 10.4l5.3-1.9Z" />
    <path d="M18.4 15.4l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" />
  </Icon>
);

/* ------------------------------------------------------------------ *
 *  Напитки
 * ------------------------------------------------------------------ */

export const ChampagneIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M8 3.2h8l-.7 6.8a4.3 4.3 0 0 1-6.6 0Z" />
    <path d="M12 13.6v6.4M8.8 20.4h6.4" />
    <path d="M9.6 8.4h4.8" />
  </Icon>
);

export const WhiteWineIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M7.4 4h9.2c-.4 4.4-2.1 7-4.6 7s-4.2-2.6-4.6-7Z" />
    <path d="M12 11.2v7.6M8.4 19.2h7.2" />
  </Icon>
);

export const RedWineIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M7.2 4h9.6c-.4 5-2.1 8-4.8 8s-4.4-3-4.8-8Z" />
    <path d="M7.2 4h9.6c-.4 5-2.1 8-4.8 8s-4.4-3-4.8-8Z" fill="currentColor" fillOpacity="0.14" />
    <path d="M12 12.2v7M8.4 19.4h7.2" />
  </Icon>
);

export const CocktailIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M4 5.2h16L12 13Z" />
    <path d="M12 13v6.2M8.6 19.4h6.8" />
    <path d="M14.6 6.4a1.5 1.5 0 1 0 2.2 1.9" />
  </Icon>
);

export const StrongIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M6.4 6.6h11.2l-1.1 12.2a2.2 2.2 0 0 1-2.2 2h-4.6a2.2 2.2 0 0 1-2.2-2Z" />
    <path d="M7.4 11.6h9.2" />
    <path d="M9.6 8.4l1.6 1.6M14 8.4l-1.6 1.6" />
  </Icon>
);

export const BeerIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M6.6 8.4h9.8v9.4a2.4 2.4 0 0 1-2.4 2.4H9a2.4 2.4 0 0 1-2.4-2.4Z" />
    <path d="M16.4 10.4h2.2a2.3 2.3 0 0 1 0 4.6h-2.2" />
    <path d="M6.6 8.4c-.9-1.5.4-3 2-2.8.2-1.4 1.7-2 2.8-1.2.5-1.2 2-1.2 2.6 0 1.1-.8 2.6-.2 2.8 1.2 1.6-.2 2.9 1.3 2 2.8" />
  </Icon>
);

export const JuiceIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M7.4 8.6h9.2l-1.2 10a2 2 0 0 1-2 1.8h-2.8a2 2 0 0 1-2-1.8Z" />
    <path d="M8.2 12.4h7.6" />
    <path d="M14.4 8.6 16.6 4.4" />
    <path d="M11.4 5.4a1.7 1.7 0 1 0 1.6-2.4" />
  </Icon>
);

export const LemonadeIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M8 8.4h8l-1 9.6a2 2 0 0 1-2 1.8h-2a2 2 0 0 1-2-1.8Z" />
    <path d="M8.8 12h6.4" />
    <circle cx="12" cy="4.6" r="2.2" />
    <path d="M12 2.4v1.4M9.9 4.6h1.4M12.7 4.6h1.4" />
  </Icon>
);

export const NoDrinkIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M7 4h10l-1.2 12.2a2.2 2.2 0 0 1-2.2 2H9.4a2.2 2.2 0 0 1-2.2-2Z" />
    <path d="M7.6 11.4h8.8" />
    <path d="M4.5 3.5l15 17" />
  </Icon>
);

export const WaterIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 3.4c3.3 4.1 5.6 6.8 5.6 9.7a5.6 5.6 0 1 1-11.2 0C6.4 10.2 8.7 7.5 12 3.4Z" />
    <path d="M9.4 13.6a2.8 2.8 0 0 0 2.2 2.8" />
  </Icon>
);

export const CoffeeIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M5 9.6h11v4.8a4.4 4.4 0 0 1-4.4 4.4H9.4A4.4 4.4 0 0 1 5 14.4Z" />
    <path d="M16 10.8h1.8a2.3 2.3 0 0 1 0 4.6H16" />
    <path d="M3.4 21h14.2" />
    <path d="M9 6.6c0-1 .8-1 .8-2M12 6.6c0-1 .8-1 .8-2" />
  </Icon>
);

export const BerryDrinkIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M8.6 8.6h6.8l-1 10a2 2 0 0 1-2 1.8h-.8a2 2 0 0 1-2-1.8Z" />
    <path d="M9.4 12.2h5.2" />
    <circle cx="9.4" cy="5.6" r="1.5" />
    <circle cx="12.6" cy="4.6" r="1.7" />
    <circle cx="15.2" cy="6.2" r="1.3" />
  </Icon>
);

export const MocktailIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M7.4 6.4h9.2l-1.2 11.6a2.2 2.2 0 0 1-2.2 2h-2.4a2.2 2.2 0 0 1-2.2-2Z" />
    <path d="M8.4 10.2h7.2" />
    <path d="M14.8 6.4 17 2.8" />
    <circle cx="17.8" cy="4.6" r="1.2" />
  </Icon>
);

/* ------------------------------------------------------------------ *
 *  Аллергии и предпочтения
 * ------------------------------------------------------------------ */

export const NutsIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 3.4c-3.6 0-6.6 3.3-6.6 7.4 0 4.5 3 8.2 6.6 8.2s6.6-3.7 6.6-8.2c0-4.1-3-7.4-6.6-7.4Z" />
    <path d="M12 3.4v15.6M8 8.2c1.3 1.1 2.5 1.6 4 1.6s2.7-.5 4-1.6M8 13c1.3 1.1 2.5 1.6 4 1.6s2.7-.5 4-1.6" />
  </Icon>
);

export const LactoseIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M10 3h4v2.6l1.6 2.2V20a1.6 1.6 0 0 1-1.6 1.6h-4A1.6 1.6 0 0 1 8.4 20V7.8L10 5.6Z" />
    <path d="M8.4 12.4h7.2M10 3h4" />
  </Icon>
);

export const GlutenIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 21V8.4" />
    <path d="M12 8.4C9.4 8.4 8 6.9 8 4.4c2.6 0 4 1.5 4 4Z" />
    <path d="M12 8.4c2.6 0 4-1.5 4-4-2.6 0-4 1.5-4 4Z" />
    <path d="M12 13.6c-2.6 0-4-1.5-4-4 2.6 0 4 1.5 4 4Z" />
    <path d="M12 13.6c2.6 0 4-1.5 4-4-2.6 0-4 1.5-4 4Z" />
    <path d="M12 18.8c-2.6 0-4-1.5-4-4 2.6 0 4 1.5 4 4Z" />
    <path d="M12 18.8c2.6 0 4-1.5 4-4-2.6 0-4 1.5-4 4Z" />
  </Icon>
);

export const CitrusIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 3.6v16.8M3.6 12h16.8M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const HoneyIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 2.8v4.4" />
    <path d="M9.2 7.4h5.6l-1.1 3a3 3 0 0 1-3.4 0Z" />
    <path d="M8.8 10.6 7.4 13M12 10.8v2.4M15.2 10.6l1.4 2.4" />
    <path d="M7.4 16.4h9.2v3a1.6 1.6 0 0 1-1.6 1.6H9a1.6 1.6 0 0 1-1.6-1.6Z" />
  </Icon>
);

export const SeafoodIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 20.4c-4.2 0-7.4-3.2-7.4-7.4 0-4.6 3.2-8.2 7.4-8.2s7.4 3.6 7.4 8.2c0 4.2-3.2 7.4-7.4 7.4Z" />
    <path d="M12 4.8v15.6M5.4 12.6c2 1.6 4.2 1.6 6.6 0s4.6-1.6 6.6 0M7 8.4c1.6 1.3 3.2 1.3 5 0s3.4-1.3 5 0" />
  </Icon>
);

export const StrawberryIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 7.4c-3.4 0-5.8 2.8-5.8 6.2 0 3.7 2.7 6.8 5.8 6.8s5.8-3.1 5.8-6.8c0-3.4-2.4-6.2-5.8-6.2Z" />
    <path d="M12 7.4V4.6" />
    <path d="M12 7.4c-.6-1.9.1-3.6 1.9-4.4-.2 1.7-.7 2.9-1.9 4.4Z" />
    <path d="M12 7.4c.6-1.9-.1-3.6-1.9-4.4.2 1.7.7 2.9 1.9 4.4Z" />
    <path d="M10.2 11.4h.01M13.8 11.4h.01M12 14.4h.01M10.2 17h.01M13.8 17h.01" strokeWidth="2.2" />
  </Icon>
);

export const EggIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 3.4c3.1 0 5.6 4.8 5.6 8.9a5.6 5.6 0 1 1-11.2 0C6.4 8.2 8.9 3.4 12 3.4Z" />
  </Icon>
);

export const VeganIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 21v-6.8" />
    <path d="M12 14.2c0-3.1-2.1-5.2-5.2-5.2 0 3.1 2.1 5.2 5.2 5.2Z" />
    <path d="M12 14.2c0-3.1 2.1-5.2 5.2-5.2 0 3.1-2.1 5.2-5.2 5.2Z" />
  </Icon>
);

export const NoAllergyIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 20.2S4.4 15.4 4.4 10.1A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.6 2.8c0 5.3-7.6 10.1-7.6 10.1Z" />
    <path d="M9.2 11.6l2 2 3.8-4" />
  </Icon>
);

/* ------------------------------------------------------------------ *
 *  Карта соответствий «ид → иконка»
 * ------------------------------------------------------------------ */

export const DRINK_ICONS: Record<string, (p: IconProps) => ReactElement> = {
  champagne: ChampagneIcon,
  wine: WhiteWineIcon,
  white_wine: WhiteWineIcon,
  red_wine: RedWineIcon,
  cocktails: CocktailIcon,
  strong: StrongIcon,
  none: NoDrinkIcon,
  beer: BeerIcon,
  surprise: SparkleIcon,
  juice: JuiceIcon,
  lemonade: LemonadeIcon,
  water: WaterIcon,
  coffee_tea: CoffeeIcon,
  berry: BerryDrinkIcon,
  mocktail: MocktailIcon,
};

export const ALLERGY_ICONS: Record<string, (p: IconProps) => ReactElement> = {
  nuts: NutsIcon,
  lactose: LactoseIcon,
  gluten: GlutenIcon,
  citrus: CitrusIcon,
  honey: HoneyIcon,
  seafood: SeafoodIcon,
  berries: StrawberryIcon,
  eggs: EggIcon,
  vegan: VeganIcon,
  none: NoAllergyIcon,
};

/* ------------------------------------------------------------------ *
 *  Дополнительные иконки
 * ------------------------------------------------------------------ */

/**
 * Мальчик и девочка — для пункта «+1 гость».
 * Мягкая, «милая» версия: девочка в платьишке-треугольнике с бантом,
 * мальчик в футболке с короткой стрижкой. Фигурки округлые и дружелюбные.
 */
export const CoupleIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    {/* девочка */}
    <circle cx="7.6" cy="5.4" r="2.5" />
    {/* бантик */}
    <path d="M7.6 2.9 5.6 1.9M7.6 2.9l2-1" />
    <circle cx="7.6" cy="2.9" r="0.7" />
    {/* платьице */}
    <path d="M7.6 8v2.4" />
    <path d="M4.3 20.4v-3.6c0-2.3 1.5-3.9 3.3-3.9s3.3 1.6 3.3 3.9v3.6" />
    {/* мальчик */}
    <circle cx="16.4" cy="5.9" r="2.5" />
    {/* стрижка */}
    <path d="M13.9 5.3a2.5 2.5 0 0 1 5 0" />
    <path d="M16.4 8.4v3.2" />
    {/* футболка с рукавами */}
    <path d="M12.6 20.4v-3.9a3.8 3.8 0 0 1 7.6 0v3.9" />
    <path d="M13.2 12.4l-1 1.6M19.6 12.4l1 1.6" />
  </Icon>
);

/** Зелёное сердечко — метка на карте */
export const HeartPinIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 21.4s-7.6-4.8-7.6-10.2A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.6 3.6c0 5.4-7.6 10.2-7.6 10.2Z" />
    <path d="M9.3 11.7l2 2 3.6-3.9" />
  </Icon>
);
