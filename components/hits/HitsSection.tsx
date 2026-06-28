"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { FEATURED } from "@/data/menu";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types/menu";

function HitCard({ item, index }: { item: MenuItem; index: number }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  function handleAdd() {
    add(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (index % 4) * 0.08 }}
      className="group relative aspect-[3/4] overflow-hidden rounded-[var(--radius-xl2)] bg-espresso"
    >
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.1s] ease-[var(--ease-expo)] group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,#5a3a28,#2a1a12)]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/20 to-transparent" />

      <span className="absolute left-4 top-4 rounded-full bg-gold/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-graphite">
        Хіт
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-xl font-medium leading-tight text-cream">
          {item.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg text-gold-soft">
            {formatPrice(item.price, item.currency)}
          </span>
          <button
            onClick={handleAdd}
            className="translate-y-1 rounded-full bg-cream/95 px-4 py-1.5 text-sm font-medium text-graphite opacity-0 transition-all duration-300 hover:bg-gold group-hover:translate-y-0 group-hover:opacity-100"
          >
            {added ? "Додано ✓" : "Замовити"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function HitsSection() {
  if (FEATURED.length === 0) return null;

  return (
    <section
      id="hits"
      className="relative scroll-mt-24 overflow-hidden bg-graphite px-6 py-24 text-cream sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <p className="eyebrow text-gold-soft">Гості обирають</p>
            <h2 className="mt-4 text-balance font-display text-[length:var(--text-display)] font-medium leading-[var(--text-display--line-height)]">
              Те, за чим повертаються
            </h2>
          </motion.div>
          <a
            href="#menu"
            className="text-sm font-medium text-cream/70 underline-offset-4 transition-colors hover:text-gold hover:underline"
          >
            Усе меню →
          </a>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {FEATURED.map((item, i) => (
            <HitCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
