import { Reveal } from "@/components/motion/Reveal";
import { MapView } from "./MapView";
import { SITE } from "@/lib/site";

const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${SITE.geo.lat},${SITE.geo.lng}`;

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h3l1.5 5-2 1.5a12 12 0 0 0 6 6l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 5 8-5" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}
function IconWifi() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8.5a15 15 0 0 1 20 0" />
      <path d="M5 12a10 10 0 0 1 14 0" />
      <path d="M8.5 15.5a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19" r="0.6" fill="currentColor" />
    </svg>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="mt-0.5 shrink-0 text-graphite">{icon}</span>
      <div>
        <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-coffee">
          {label}
        </dt>
        <dd className="mt-1 text-base text-graphite sm:text-lg">{children}</dd>
      </div>
    </div>
  );
}

export function ContactsSection() {
  return (
    <section id="contacts" className="flex flex-1 px-5 pb-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 lg:gap-9">
        {/* info — no container, flows on the page; centered grid on desktop */}
        <Reveal>
          <p className="mb-7 text-xs font-semibold uppercase tracking-[0.28em] text-coffee lg:mb-10 lg:text-center lg:text-sm">
            Контакти
          </p>
          <dl className="space-y-5 lg:mx-auto lg:grid lg:max-w-4xl lg:grid-cols-3 lg:gap-x-10 lg:gap-y-8 lg:space-y-0">
            <Row icon={<IconPin />} label="Адреса">
              {SITE.address}
            </Row>
            <Row icon={<IconPhone />} label="Телефон">
              <a className="transition-colors hover:text-gold" href={SITE.phoneHref}>
                {SITE.phone}
              </a>
            </Row>
            <Row icon={<IconMail />} label="Email">
              <a className="transition-colors hover:text-gold" href={SITE.emailHref}>
                {SITE.email}
              </a>
            </Row>
            <Row icon={<IconInstagram />} label="Instagram">
              <a
                className="transition-colors hover:text-gold"
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                {SITE.social.instagramHandle}
              </a>
            </Row>
            <Row icon={<IconClock />} label="Графік роботи">
              {SITE.hours}
            </Row>
            <Row icon={<IconWifi />} label="Wi-Fi">
              <span className="text-ink/55">Мережа:</span> {SITE.wifi.name}
              <span className="px-2 text-coffee/30">·</span>
              <span className="text-ink/55">Пароль:</span> {SITE.wifi.pass}
            </Row>
          </dl>
        </Reveal>

        {/* map — clean Google embed, no card frame */}
        <Reveal
          delay={0.1}
          className="relative min-h-[15rem] w-full flex-1 overflow-hidden rounded-2xl lg:h-[22rem] lg:min-h-0 lg:flex-none"
        >
          <MapView />
          {/* Google-Maps-style directions control */}
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-2.5 top-2.5 z-[1] inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-[13px] font-medium text-[#1a73e8] shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] transition-colors hover:bg-[#f6faff] sm:right-4 sm:top-4 sm:rounded-full sm:px-4 sm:py-2 sm:text-sm"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="#1a73e8">
              <path d="M21.71 11.29l-9-9a.996.996 0 0 0-1.41 0l-9 9a.996.996 0 0 0 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 0 0 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />
            </svg>
            Прокласти маршрут
          </a>
        </Reveal>
      </div>
    </section>
  );
}
