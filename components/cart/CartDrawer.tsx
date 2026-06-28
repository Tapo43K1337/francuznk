"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "./CartProvider";
import { cn, formatPrice } from "@/lib/utils";

type Form = {
  name: string;
  phone: string;
  type: "pickup" | "delivery";
  address: string;
  comment: string;
};

export function CartDrawer() {
  const { lines, count, total, setQty, remove, clear, isOpen, close } =
    useCart();
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Form>({
    name: "",
    phone: "",
    type: "pickup",
    address: "",
    comment: "",
  });

  function handleClose() {
    close();
    setTimeout(() => {
      setStep("cart");
      setError("");
    }, 350);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Вкажіть ім'я та телефон");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            name: l.name,
            qty: l.qty,
            price: l.price,
          })),
          total,
          customer: form,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setOrderId(data.orderId);
        setStep("done");
        clear();
      } else {
        setError("Не вдалося оформити. Спробуйте ще раз.");
      }
    } catch {
      setError("Помилка мережі. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "h-11 w-full rounded-xl border border-coffee/15 bg-cream px-4 text-sm text-graphite outline-none transition-colors placeholder:text-mocha/55 focus:border-gold";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[90] bg-graphite/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[100] flex h-full w-full max-w-md flex-col bg-milk shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-coffee/10 px-6 py-5">
              <h3 className="font-display text-2xl text-graphite">
                {step === "done"
                  ? "Дякуємо!"
                  : step === "checkout"
                    ? "Оформлення"
                    : "Ваше замовлення"}
              </h3>
              <button
                onClick={handleClose}
                aria-label="Закрити"
                className="flex h-9 w-9 items-center justify-center rounded-full text-mocha transition-colors hover:bg-coffee/10"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* ---- DONE ---- */}
            {step === "done" && (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <p className="mt-6 font-display text-xl text-graphite">
                  Замовлення {orderId} прийнято
                </p>
                <p className="mt-2 text-sm text-ink/65">
                  Ми зателефонуємо для підтвердження. Оплата при отриманні.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-8 rounded-full bg-graphite px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-espresso"
                >
                  Готово
                </button>
              </div>
            )}

            {/* ---- EMPTY ---- */}
            {step !== "done" && lines.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <p className="font-display text-xl text-graphite">
                  Кошик порожній
                </p>
                <p className="mt-2 text-sm text-ink/60">
                  Оберіть напої та страви з меню.
                </p>
                <a
                  href="#menu"
                  onClick={handleClose}
                  className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-medium text-graphite transition-colors hover:bg-gold-soft"
                >
                  Перейти до меню
                </a>
              </div>
            )}

            {/* ---- CART LIST ---- */}
            {step === "cart" && lines.length > 0 && (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
                  {lines.map((l) => (
                    <div
                      key={l.id}
                      className="flex gap-3 rounded-2xl border border-coffee/10 bg-cream p-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                        {l.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={l.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-medium text-graphite">
                          {l.name}
                        </span>
                        <span className="text-sm text-mocha">
                          {formatPrice(l.price, l.currency)}
                        </span>
                        <div className="mt-auto flex items-center gap-2">
                          <button
                            onClick={() => setQty(l.id, l.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-coffee/20 text-graphite hover:bg-coffee/10"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{l.qty}</span>
                          <button
                            onClick={() => setQty(l.id, l.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-coffee/20 text-graphite hover:bg-coffee/10"
                          >
                            +
                          </button>
                          <button
                            onClick={() => remove(l.id)}
                            className="ml-auto text-xs text-mocha/70 hover:text-coffee"
                          >
                            Прибрати
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-coffee/10 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink/65">
                      Разом ({count})
                    </span>
                    <span className="font-display text-2xl text-graphite">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <button
                    onClick={() => setStep("checkout")}
                    className="mt-4 w-full rounded-full bg-graphite py-3.5 text-sm font-medium text-cream transition-colors hover:bg-espresso"
                  >
                    Оформити замовлення
                  </button>
                </div>
              </>
            )}

            {/* ---- CHECKOUT ---- */}
            {step === "checkout" && lines.length > 0 && (
              <form
                onSubmit={submit}
                className="flex flex-1 flex-col overflow-y-auto px-6 py-5"
              >
                <div className="space-y-3">
                  <input
                    className={field}
                    placeholder="Ім'я"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    className={field}
                    placeholder="Телефон"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <div className="flex gap-2">
                    {(
                      [
                        ["pickup", "Самовивіз"],
                        ["delivery", "Доставка"],
                      ] as const
                    ).map(([v, label]) => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setForm({ ...form, type: v })}
                        className={cn(
                          "flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors",
                          form.type === v
                            ? "border-gold bg-gold/15 text-graphite"
                            : "border-coffee/15 text-ink/65 hover:border-coffee/30"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {form.type === "delivery" && (
                    <input
                      className={field}
                      placeholder="Адреса доставки"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                    />
                  )}
                  <textarea
                    className={cn(field, "h-20 resize-none py-3")}
                    placeholder="Коментар (необов'язково)"
                    value={form.comment}
                    onChange={(e) =>
                      setForm({ ...form, comment: e.target.value })
                    }
                  />
                </div>

                {error && (
                  <p className="mt-3 text-sm text-red-700">{error}</p>
                )}

                <div className="mt-auto pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-ink/65">До сплати</span>
                    <span className="font-display text-2xl text-graphite">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="mb-3 text-xs text-mocha">
                    Оплата при отриманні
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-gold py-3.5 text-sm font-semibold text-graphite transition-colors hover:bg-gold-soft disabled:opacity-60"
                  >
                    {submitting ? "Надсилаємо…" : "Підтвердити замовлення"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="mt-2 w-full py-2 text-sm text-mocha hover:text-coffee"
                  >
                    ← Назад до кошика
                  </button>
                </div>
              </form>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
