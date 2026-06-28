"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { FEATURED } from "@/data/menu";

const PILLARS = [
  {
    n: "01",
    title: "Спешелті кава",
    text: "Обираємо зерно за смаковим профілем і обсмажуємо невеликими партіями.",
  },
  {
    n: "02",
    title: "Власна пекарня",
    text: "Випікаємо щоранку: круасани на маслі 82% та свіжий хліб.",
  },
  {
    n: "03",
    title: "Свіжі інгредієнти",
    text: "Сезонні продукти від локальних виробників — без компромісів.",
  },
  {
    n: "04",
    title: "Атмосфера",
    text: "Простір, у якому хочеться залишитися довше за одну чашку.",
  },
];

export function StorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const heroImage = FEATURED.find((i) => i.image)?.image;

  return (
    <section id="story" className="relative scroll-mt-24 bg-milk px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">Наша історія</p>
            <h2 className="text-balance font-display text-[length:var(--text-display)] font-medium leading-[var(--text-display--line-height)] text-graphite">
              Кав&apos;ярня, що стала ритуалом
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/65 sm:text-lg">
              ФРАНЦУЗ народився з простої ідеї — поєднати французьку культуру
              випічки зі спешелті кавою. Кожна чашка та кожен круасан тут — це
              маленька історія смаку, створена з увагою до деталей.
            </p>
          </Reveal>

          <div
            ref={ref}
            className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl2)] bg-sand shadow-lift"
          >
            {heroImage && (
              <motion.img
                src={heroImage}
                alt="ФРАНЦУЗ"
                style={{ y }}
                className="absolute inset-0 h-[124%] w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-graphite/30 to-transparent" />
          </div>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-[var(--radius-xl2)] border border-coffee/10 bg-coffee/10 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal
              key={p.n}
              delay={i * 0.08}
              className="bg-cream p-8"
            >
              <span className="font-display text-3xl text-gold">{p.n}</span>
              <h3 className="mt-4 font-display text-xl text-graphite">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {p.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
