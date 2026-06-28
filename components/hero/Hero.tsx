"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false }
);

// Wordmark split into individual glyphs so each one can drop from the sky
// and settle into place. The Cyrillic "Ц" carries the brand accent.
const LETTERS: { ch: string; gold?: boolean }[] = [
  { ch: "F" },
  { ch: "R" },
  { ch: "A" },
  { ch: "N" },
  { ch: "Ц", gold: true },
  { ch: "У" },
  { ch: "З" },
];

export function Hero() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [env, setEnv] = useState({ reduced: false, mobile: false });

  useEffect(() => {
    setEnv({
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      mobile: window.matchMedia("(max-width: 768px)").matches,
    });
  }, []);

  const settleAt = 0.15 + LETTERS.length * 0.11; // when the wordmark is whole

  return (
    <section
      onClick={() => router.push("/menu")}
      role="link"
      tabIndex={0}
      aria-label="Перейти до меню"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push("/menu");
        }
      }}
      className="relative flex h-[100dvh] w-full cursor-pointer items-center justify-center overflow-hidden"
    >
      {/* ---- warm ambient base (light so the beans read) ---- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_34%,#fbf6ec_0%,#efe2cd_52%,#e2cdae_100%)]" />

      {/* ---- floating 3D coffee beans ---- */}
      <div className="absolute inset-0">
        <HeroCanvas reduced={env.reduced} isMobile={env.mobile} />
      </div>

      {/* soft vignette for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(42,26,18,0.22)_100%)]" />

      {/* glow behind the wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(251,246,236,0.78)_0%,rgba(251,246,236,0.32)_50%,rgba(251,246,236,0)_75%)] blur-2xl"
      />

      {/* ---- brand wordmark: glyphs fall from the sky and assemble ---- */}
      <div className="pointer-events-none relative z-10 flex flex-col items-center px-6 text-center">
        <h1 className="flex font-display text-[clamp(4rem,17vw,15rem)] font-semibold leading-[0.9] tracking-[0.02em] text-graphite">
          {LETTERS.map((l, i) =>
            reduceMotion ? (
              <span key={i} className={l.gold ? "text-gold" : undefined}>
                {l.ch}
              </span>
            ) : (
              <motion.span
                key={i}
                initial={{ y: "-115vh", opacity: 0, rotate: i % 2 ? 14 : -14 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 13,
                  mass: 0.9,
                  delay: 0.15 + i * 0.11,
                }}
                className={l.gold ? "text-gold" : undefined}
              >
                {l.ch}
              </motion.span>
            )
          )}
        </h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: settleAt + 0.1 }}
          className="mt-4 text-[0.8rem] uppercase tracking-[0.42em] text-mocha sm:text-sm"
        >
          кав&apos;ярня &amp; пекарня
        </motion.p>

        {/* CTA — real focusable link for a11y; the whole screen is clickable too */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: settleAt + 0.35 }}
          className="pointer-events-auto mt-10"
        >
          <Link
            href="/menu"
            onClick={(e) => e.stopPropagation()}
            className="group relative inline-flex items-center gap-2.5 rounded-sm px-1 py-1 text-[0.72rem] font-medium uppercase tracking-[0.32em] text-graphite transition-colors duration-300 hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:text-[0.8rem]"
          >
            <span className="relative">
              Переглянути меню
              {/* hairline that grows from the start on hover */}
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100"
              />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
