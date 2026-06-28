import type { Metadata } from "next";
import { VACANCIES } from "@/lib/vacancies";
import { VacancyCard } from "@/components/vacancies/VacancyCard";

export const metadata: Metadata = {
  title: "Вакансії",
  description:
    "Приєднуйся до команди ФРАНЦУЗ — актуальні вакансії кав'ярні та пекарні в Нікополі.",
};

export default function VacanciesPage() {
  return (
    <div className="min-h-screen bg-milk px-5 pb-24 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="font-display text-[length:var(--text-display)] font-medium leading-[var(--text-display--line-height)] text-graphite">
            Вакансії
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-ink/65">
            Шукаємо людей, які люблять каву та гостинність. Обери позицію й
            заповни анкету — ми зв&apos;яжемося з тобою.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VACANCIES.map((v) => (
            <VacancyCard key={v.slug} vacancy={v} />
          ))}
        </div>
      </div>
    </div>
  );
}
