import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VACANCIES, getVacancy } from "@/lib/vacancies";
import { ApplicationForm } from "@/components/vacancies/ApplicationForm";

export function generateStaticParams() {
  return VACANCIES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVacancy(slug);
  return { title: v ? `${v.title} — анкета` : "Вакансія" };
}

export default async function VacancyFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vacancy = getVacancy(slug);
  if (!vacancy) notFound();

  return (
    <div className="min-h-screen bg-milk px-5 pb-24 pt-24 sm:px-6 sm:pt-28">
      <Link
        href="/vacancies"
        className="fixed left-4 top-20 z-20 inline-flex items-center gap-1.5 rounded-full bg-cream/80 px-3.5 py-2 text-sm font-medium text-ink/70 shadow-soft backdrop-blur transition-colors hover:text-graphite sm:left-6 sm:top-24"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 6-6 6 6 6" />
        </svg>
        Усі вакансії
      </Link>

      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coffee">
            Анкета
          </p>
          <h1 className="mt-3 font-display text-[length:var(--text-title)] font-medium leading-[var(--text-title--line-height)] text-graphite">
            {vacancy.title}
          </h1>
          <p className="mt-2 font-display text-lg text-graphite/70">
            {vacancy.salary}
          </p>
        </div>

        <div className="mt-10">
          <ApplicationForm vacancy={vacancy} />
        </div>
      </div>
    </div>
  );
}
