"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useCart } from "@/components/cart/CartProvider";

/** Persistent cart button that appears after the hero. */
export function FloatingOrder() {
  const { count, total, open } = useCart();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-5 z-50"
        >
          <MagneticButton strength={0.4}>
            <button
              onClick={open}
              className="flex h-14 items-center gap-3 rounded-full bg-gold px-6 font-medium text-graphite shadow-gold transition-colors hover:bg-gold-soft"
            >
              <span className="relative">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M6 6h15l-1.5 9h-12z" />
                  <circle cx="9" cy="20" r="1.4" />
                  <circle cx="18" cy="20" r="1.4" />
                  <path d="M6 6 5 3H2" />
                </svg>
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-graphite px-1 text-[0.7rem] font-semibold text-cream">
                    {count}
                  </span>
                )}
              </span>
              {count > 0 ? `${total} ₴` : "Замовити"}
            </button>
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
