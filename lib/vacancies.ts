/** Vacancies + application-form schema. Submission target is wired in
 *  app/api/vacancy/route.ts (Telegram for now; swap later). */

export type Vacancy = {
  slug: string;
  title: string;
  salary: string;
  /** icon key rendered by components/vacancies icons */
  icon: "waiter" | "barista" | "chef";
};

export const VACANCIES: Vacancy[] = [
  {
    slug: "ofitsiant",
    title: "Офіціант",
    salary: "45 000 – 55 000 грн",
    icon: "waiter",
  },
  {
    slug: "prodavets-barista",
    title: "Продавець-бариста",
    salary: "27 000 грн",
    icon: "barista",
  },
  {
    slug: "kukhar",
    title: "Кухар гарячого процесу",
    salary: "40 500 грн",
    icon: "chef",
  },
];

export function getVacancy(slug: string): Vacancy | undefined {
  return VACANCIES.find((v) => v.slug === slug);
}

export type Field = {
  name: string;
  label: string;
  type: "text" | "tel" | "date" | "textarea";
  required?: boolean;
  placeholder?: string;
};

export const APPLICATION_FIELDS: Field[] = [
  { name: "name", label: "Ваше ім'я", type: "text", required: true, placeholder: "Ім'я та Прізвище" },
  { name: "birthDate", label: "Дата народження", type: "text", required: true, placeholder: "00.00.0000" },
  { name: "address", label: "Адреса проживання", type: "text", required: true, placeholder: "Адреса" },
  { name: "phone", label: "Контактний номер", type: "tel", required: true, placeholder: "+38 (___) ___-__-__" },
  { name: "social", label: "Посилання на соцмережі", type: "text", required: true, placeholder: "instagram.com/..." },
  { name: "maritalStatus", label: "Сімейний стан", type: "text" },
  { name: "education", label: "Освіта та спеціальність", type: "text" },
  { name: "sizes", label: "Розмір одягу, взуття, ваш зріст", type: "text" },
  { name: "languages", label: "Якими мовами володієш?", type: "text" },
  { name: "experience", label: "Попередні місця роботи?", type: "textarea" },
  { name: "qualities", label: "Які, на твою думку, найважливіші якості в роботі на цю вакансію?", type: "textarea" },
  { name: "source", label: "Звідки дізнався про нас?", type: "text" },
  { name: "hobbies", label: "Які є хобі / захоплення окрім роботи?", type: "textarea" },
  { name: "habits", label: "Маєш шкідливі звички?", type: "text" },
  { name: "about", label: "Розкажи про себе", type: "textarea" },
  { name: "resume", label: "Додай посилання на резюме (якщо є)", type: "text" },
];
