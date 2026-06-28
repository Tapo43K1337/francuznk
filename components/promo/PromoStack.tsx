"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PROMOS } from "@/lib/promos";
import { SITE } from "@/lib/site";

/**
 * Premium, non-intrusive promo notifications: a single glass card slides in
 * from the bottom-left after the hero, rotates gently, and can be dismissed.
 */
export function PromoStack() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [armed, setArmed] = useState(false);

  // arm after scrolling past the hero
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 1.1) {
        setArmed(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // show shortly after armed
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, [armed]);

  // rotate while visible
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % PROMOS.length);
        setVisible(true);
      }, 600);
    }, 9000);
    return () => clearTimeout(t);
  }, [visible, index]);

  const promo = PROMOS[index];

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-40 w-[min(20rem,calc(100vw-2.5rem))]">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, x: -24, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass pointer-events-auto relative overflow-hidden rounded-2xl p-5 shadow-lift"
          >
            <span className="absolute left-0 top-0 h-full w-1 bg-gold" />
            <button
              aria-label="Закрити"
              onClick={() => setVisible(false)}
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-mocha transition-colors hover:bg-coffee/10"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <p className="eyebrow text-[0.6rem]">{promo.tag}</p>
            <h4 className="mt-2 font-display text-lg text-graphite">
              {promo.title}
            </h4>
            <p className="mt-1 pr-4 text-sm leading-relaxed text-ink/70">
              {promo.text}
            </p>
            <a
              href={SITE.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-gold underline-offset-4 hover:underline"
            >
              Скористатися →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
