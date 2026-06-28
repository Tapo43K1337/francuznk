import Link from "next/link";
import type { Vacancy } from "@/lib/vacancies";

function RoleIcon({ icon }: { icon: Vacancy["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
  };
  if (icon === "barista") {
    return (
      <svg {...common}>
        <path d="M4 8h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
        <path d="M17 9h2.5a2.5 2.5 0 0 1 0 5H17" />
        <path d="M8 3v2M11 3v2M14 3v2" />
      </svg>
    );
  }
  if (icon === "chef") {
    return (
      <svg {...common}>
        <path d="M6 14a3.5 3.5 0 0 1-1-6.9A3.5 3.5 0 0 1 12 5a3.5 3.5 0 0 1 7 2.1A3.5 3.5 0 0 1 18 14H6Z" />
        <path d="M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" />
      </svg>
    );
  }
  // waiter — tray
  return (
    <svg {...common}>
      <path d="M3 17h18" />
      <path d="M5 17a7 7 0 0 1 14 0" />
      <path d="M12 10V7" />
      <circle cx="12" cy="5.5" r="1.4" />
    </svg>
  );
}

export function VacancyCard({ vacancy }: { vacancy: Vacancy }) {
  return (
    <Link
      href={`/vacancies/${vacancy.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-coffee/10 bg-cream p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:rounded-[var(--radius-xl2)] sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-medium text-graphite sm:text-2xl">
            {vacancy.title}
          </h3>
          <p className="mt-3 font-display text-lg text-graphite/80">
            {vacancy.salary}
          </p>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-graphite text-cream">
          <RoleIcon icon={vacancy.icon} />
        </span>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm font-medium text-ink/70 transition-colors group-hover:text-graphite">
          Заповнити анкету
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-graphite transition-transform duration-300 group-hover:translate-x-1">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
