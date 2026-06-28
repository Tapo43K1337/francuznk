"use client";

import { useState } from "react";
import { APPLICATION_FIELDS, type Vacancy } from "@/lib/vacancies";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

const inputCls =
  "w-full rounded-xl border border-coffee/15 bg-cream px-4 py-3 text-base text-graphite outline-none transition-colors placeholder:text-mocha/50 focus:border-gold";

export function ApplicationForm({ vacancy }: { vacancy: Vacancy }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);
    const fields: Record<string, string> = {};
    for (const f of APPLICATION_FIELDS) {
      fields[f.name] = String(data.get(f.name) ?? "");
    }

    try {
      const res = await fetch("/api/vacancy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: vacancy.slug,
          vacancy: vacancy.title,
          fields,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[var(--radius-xl2)] border border-coffee/10 bg-cream p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-graphite">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 5 5 9-10" />
          </svg>
        </div>
        <h2 className="mt-6 font-display text-2xl font-medium text-graphite">
          Дякуємо! Анкету надіслано
        </h2>
        <p className="mt-3 text-ink/70">
          Ми зв&apos;яжемося з вами щодо вакансії «{vacancy.title}».
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate={false}>
      {APPLICATION_FIELDS.map((f) => (
        <div key={f.name}>
          <label
            htmlFor={f.name}
            className="mb-2 block text-sm font-medium text-graphite"
          >
            {f.label}
            {f.required && <span className="ml-1 text-gold">*</span>}
          </label>
          {f.type === "textarea" ? (
            <textarea
              id={f.name}
              name={f.name}
              required={f.required}
              placeholder={f.placeholder}
              rows={3}
              className={cn(inputCls, "resize-y")}
            />
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type === "date" ? "text" : f.type}
              required={f.required}
              placeholder={f.placeholder}
              className={inputCls}
            />
          )}
        </div>
      ))}

      {status === "error" && (
        <p className="text-sm text-red-700">
          Не вдалося надіслати. Спробуйте ще раз.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="h-14 w-full rounded-full bg-graphite px-8 text-base font-medium text-cream shadow-soft transition-colors hover:bg-espresso disabled:opacity-60"
      >
        {status === "sending" ? "Надсилаємо…" : "Надіслати"}
      </button>
    </form>
  );
}
