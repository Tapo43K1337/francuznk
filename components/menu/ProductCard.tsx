"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import type { MenuProduct } from "@/types/menu";
import { cn, formatPrice } from "@/lib/utils";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[1.15rem] w-[1.15rem]"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function ShareIcon({ done }: { done: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[1.05rem] w-[1.05rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {done ? (
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      ) : (
        <>
          {/* box with an arrow leaving to the top-right */}
          <path d="M14 4h6v6" />
          <path d="M11 13 20 4" />
          <path d="M19 13.5V19a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 19V7a1.5 1.5 0 0 1 1.5-1.5H11" />
        </>
      )}
    </svg>
  );
}

export function ProductCard({
  product,
  isFav,
  onToggleFav,
  autoOpenId,
}: {
  product: MenuProduct;
  isFav: (id: string) => boolean;
  onToggleFav: (id: string) => void;
  autoOpenId?: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const [copied, setCopied] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const variant = product.variants[sel] ?? product.variants[0];
  const multi = product.variants.length > 1;
  const fav = isFav(variant.id);

  // deep link: open this product (at the shared size) when ?item matches
  useEffect(() => {
    if (!autoOpenId) return;
    const idx = product.variants.findIndex((v) => v.id === autoOpenId);
    if (idx >= 0) {
      setSel(idx);
      setOpen(true);
    }
  }, [autoOpenId, product.variants]);

  async function share(e?: React.MouseEvent) {
    e?.stopPropagation();
    const url = `${window.location.origin}/menu?item=${variant.id}`;
    const data = {
      title: `ФРАНЦУЗ — ${product.name}`,
      text: `${product.name}${multi ? `, ${variant.sizeLabel}` : ""}`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
    } catch {
      return; // user cancelled the native share sheet
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  // lock scroll + close on Escape while the enlarged view is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const rotX = useSpring(useTransform(my, [0, 1], [7, -7]), {
    stiffness: 150,
    damping: 16,
  });
  const rotY = useSpring(useTransform(mx, [0, 1], [-7, 7]), {
    stiffness: 150,
    damping: 16,
  });

  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(220px circle at ${glowX} ${glowY}, rgba(194,147,63,0.22), transparent 65%)`;

  function onMove(e: React.MouseEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  const Placeholder = (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,#e7d8c0,#d8c4a8_70%,#c8b196)]">
      <span className="font-display text-4xl text-coffee/30 sm:text-6xl">
        {product.name.charAt(0)}
      </span>
    </div>
  );

  // size selector — `big` variant used inside the enlarged modal
  function SizePicker({ big }: { big?: boolean }) {
    if (!multi) return null;
    return (
      <div
        className={cn("flex flex-wrap", big ? "mt-4 gap-2" : "mt-2 gap-1.5")}
        onClick={(e) => e.stopPropagation()}
      >
        {product.variants.map((vr, i) => (
          <button
            key={vr.id}
            type="button"
            aria-pressed={i === sel}
            onClick={(e) => {
              e.stopPropagation();
              setSel(i);
            }}
            className={cn(
              "rounded-full border font-medium transition-colors",
              big
                ? "px-3.5 py-1.5 text-sm"
                : "px-2.5 py-0.5 text-[0.7rem] sm:text-xs",
              i === sel
                ? "border-gold bg-gold text-graphite"
                : "border-coffee/20 text-ink/60 hover:border-gold/50 hover:text-graphite"
            )}
          >
            {big ? vr.sizeLabel : vr.ml}
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Переглянути ${product.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-coffee/10 bg-cream shadow-soft transition-shadow duration-500 hover:shadow-lift sm:rounded-[var(--radius-xl2)] [transform-style:preserve-3d]"
      >
        {/* hover glow */}
        <motion.div
          aria-hidden
          style={{ background: glow }}
          className="pointer-events-none absolute inset-0 z-20 hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
        />

        {/* image / placeholder */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-105"
            />
          ) : (
            Placeholder
          )}
        </div>

        {/* content */}
        <div className="relative z-10 flex flex-1 flex-col p-3 sm:p-5">
          <h3 className="font-display text-sm font-medium leading-snug text-graphite sm:text-xl">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1.5 hidden text-sm leading-relaxed text-ink/65 sm:block">
              {product.description}
            </p>
          )}
          {product.composition && (
            <p className="mt-1.5 hidden text-[0.7rem] uppercase tracking-[0.12em] text-mocha/80 sm:mt-2 sm:block sm:text-xs">
              {product.composition}
            </p>
          )}

          <SizePicker />

          <div className="mt-auto flex items-center justify-between gap-2 pt-3 sm:pt-5">
            <div className="font-display text-base text-graphite sm:text-lg">
              {formatPrice(variant.price, product.currency)}
              {multi && (
                <span className="ml-1.5 hidden text-xs text-ink/45 sm:inline">
                  {variant.sizeLabel}
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={share}
                aria-label="Поділитися"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-coffee/20 text-graphite transition-colors hover:border-gold hover:bg-gold/10 sm:h-11 sm:w-11"
              >
                <ShareIcon done={copied} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFav(variant.id);
                }}
                aria-label={fav ? "Прибрати з обраного" : "Додати в обране"}
                aria-pressed={fav}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors sm:h-11 sm:w-11",
                  fav
                    ? "bg-gold text-graphite"
                    : "bg-graphite text-cream hover:bg-gold hover:text-graphite"
                )}
              >
                <HeartIcon filled={fav} />
              </button>
            </div>
          </div>
        </div>
      </motion.article>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpen(false)}
                className="fixed inset-x-0 bottom-0 top-14 z-[40] flex bg-graphite/70 backdrop-blur-sm sm:inset-0 sm:z-[100] sm:items-center sm:justify-center sm:p-6"
              >
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={product.name}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-full w-full overflow-y-auto bg-cream shadow-lift sm:h-auto sm:max-h-[92vh] sm:max-w-lg sm:rounded-3xl"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Закрити"
                    className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-graphite/70 text-cream backdrop-blur transition-colors hover:bg-graphite"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>

                  <div className="aspect-[4/3] w-full overflow-hidden bg-sand">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      Placeholder
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="font-display text-2xl font-medium leading-snug text-graphite sm:text-3xl">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="mt-3 text-base leading-relaxed text-ink/70">
                        {product.description}
                      </p>
                    )}
                    {product.composition && (
                      <p className="mt-3 text-xs uppercase tracking-[0.12em] text-mocha/80">
                        {product.composition}
                      </p>
                    )}

                    <SizePicker big />

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="font-display text-2xl text-graphite">
                        {formatPrice(variant.price, product.currency)}
                        {multi && (
                          <span className="ml-2 text-base text-ink/45">
                            {variant.sizeLabel}
                          </span>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2.5">
                        <button
                          type="button"
                          onClick={share}
                          aria-label="Поділитися"
                          className="flex h-12 w-12 items-center justify-center rounded-full border border-coffee/20 text-graphite transition-colors hover:border-gold hover:bg-gold/10"
                        >
                          <ShareIcon done={copied} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleFav(variant.id)}
                          aria-label={fav ? "Прибрати з обраного" : "Додати в обране"}
                          aria-pressed={fav}
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                            fav
                              ? "bg-gold text-graphite"
                              : "bg-graphite text-cream hover:bg-gold hover:text-graphite"
                          )}
                        >
                          <HeartIcon filled={fav} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
