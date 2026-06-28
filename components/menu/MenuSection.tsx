"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { MENU_GROUPS, groupItemsBySize } from "@/data/menu";
import { ProductCard } from "./ProductCard";
import { useFavorites } from "./useMenu";
import { scrollToEl } from "@/lib/lenis-store";
import { cn } from "@/lib/utils";

type GroupId = (typeof MENU_GROUPS)[number]["id"];

// Top inset where the sticky menu-nav locks (just under the fixed header) —
// used to offset anchor scrolling / scrollspy.
const HEADER_OFFSET = 56;

export function MenuSection() {
  const [groupId, setGroupId] = useState<GroupId>(MENU_GROUPS[0].id);
  const group = MENU_GROUPS.find((g) => g.id === groupId) ?? MENU_GROUPS[0];
  const [activeCat, setActiveCat] = useState(group.categories[0]?.id ?? "");
  const [autoOpenId, setAutoOpenId] = useState<string | null>(null);
  const { isFav, toggle } = useFavorites();

  // deep link (?item=<variant id>): switch to the right group so the matching
  // ProductCard mounts and opens itself in the enlarged view.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("item");
    if (!id) return;
    for (const g of MENU_GROUPS) {
      const hit = g.categories.some((cat) =>
        groupItemsBySize(cat.items).some((p) =>
          p.variants.some((v) => v.id === id)
        )
      );
      if (hit) {
        setGroupId(g.id);
        setAutoOpenId(id);
        return;
      }
    }
  }, []);

  const navRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);
  const dragMoved = useRef(false);

  const stickyOffset = useCallback(
    () => HEADER_OFFSET + (navRef.current?.offsetHeight ?? 0),
    []
  );

  const scrollToCategory = useCallback(
    (id: string) => {
      programmatic.current = true;
      setActiveCat(id);
      requestAnimationFrame(() => {
        const el = document.getElementById(`cat-${id}`);
        if (el)
          scrollToEl(el, stickyOffset(), () => (programmatic.current = false));
        else programmatic.current = false;
      });
    },
    [stickyOffset]
  );

  function selectGroup(id: GroupId) {
    if (id === groupId) return;
    const g = MENU_GROUPS.find((x) => x.id === id) ?? MENU_GROUPS[0];
    programmatic.current = true;
    setGroupId(id);
    setActiveCat(g.categories[0]?.id ?? "");
    const first = g.categories[0];
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const el = first && document.getElementById(`cat-${first.id}`);
        if (el)
          scrollToEl(el, stickyOffset(), () => (programmatic.current = false));
        else programmatic.current = false;
      })
    );
  }

  // scrollspy: each frame highlight the section that's scrolled under the nav
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (!programmatic.current) {
        const threshold = stickyOffset() + 16;
        let current = group.categories[0]?.id;
        for (const c of group.categories) {
          const el = document.getElementById(`cat-${c.id}`);
          if (!el) continue;
          if (el.getBoundingClientRect().top - threshold <= 0) current = c.id;
          else break;
        }
        if (current) setActiveCat((prev) => (prev === current ? prev : current));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [group, stickyOffset]);

  // keep the active pill centered within the horizontal strip
  useEffect(() => {
    const strip = stripRef.current;
    const pill = strip?.querySelector<HTMLElement>(`[data-cat="${activeCat}"]`);
    if (strip && pill) {
      const target = pill.offsetLeft - strip.clientWidth / 2 + pill.offsetWidth / 2;
      strip.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }
  }, [activeCat]);

  // desktop: vertical wheel scrolls the strip horizontally; click-drag pans it.
  // `data-lenis-prevent` (on the element) stops Lenis from also scrolling.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const onWheel = (e: WheelEvent) => {
      if (strip.scrollWidth <= strip.clientWidth) return;
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const atStart = strip.scrollLeft <= 0;
      const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1;
      if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;
      e.preventDefault();
      strip.scrollLeft += delta;
    };

    let down = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // native touch scroll already works
      down = true;
      dragMoved.current = false;
      startX = e.clientX;
      startLeft = strip.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) dragMoved.current = true;
      strip.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      down = false;
    };

    strip.addEventListener("wheel", onWheel, { passive: false });
    strip.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      strip.removeEventListener("wheel", onWheel);
      strip.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <section id="menu" className="relative bg-milk pb-24 pt-20 sm:pt-24">
      {/* ---- flush sticky navigation: blended into the page like the header,
            stays put while the menu cards scroll underneath it ---- */}
      <div ref={navRef} className="sticky top-[56px] z-30 bg-milk">
        <div className="mx-auto max-w-7xl border-b border-coffee/10 px-6">
          {/* group tabs */}
          <div className="flex items-center justify-center gap-10 pt-3 sm:gap-16">
            {MENU_GROUPS.map((g) => {
              const active = g.id === groupId;
              return (
                <button
                  key={g.id}
                  onClick={() => selectGroup(g.id)}
                  className="relative pb-2.5 font-display text-lg font-semibold tracking-wide sm:text-xl"
                >
                  <span
                    className={cn(
                      "transition-colors",
                      active ? "text-graphite" : "text-ink/40 hover:text-ink/70"
                    )}
                  >
                    {g.label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="menu-group-underline"
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* category pills — single scrollable row */}
          <div
            ref={stripRef}
            role="tablist"
            aria-label="Категорії меню"
            data-lenis-prevent
            className="no-scrollbar relative overflow-x-auto py-3"
          >
            <div className="mx-auto flex w-max cursor-grab gap-1 active:cursor-grabbing">
            {group.categories.map((c) => {
              const active = c.id === activeCat;
              return (
                <button
                  key={c.id}
                  data-cat={c.id}
                  onClick={(e) => {
                    if (dragMoved.current) {
                      e.preventDefault();
                      return;
                    }
                    scrollToCategory(c.id);
                  }}
                  className={cn(
                    "relative shrink-0 whitespace-nowrap px-3.5 pb-2.5 pt-1 text-sm font-medium transition-colors",
                    active
                      ? "text-graphite"
                      : "text-ink/45 hover:text-graphite"
                  )}
                >
                  {c.name}
                  {active && (
                    <motion.span
                      layoutId="menu-cat-underline"
                      className="absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-gold"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          key={groupId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {group.categories.map((cat) => (
            <section
              key={cat.id}
              id={`cat-${cat.id}`}
              className="pt-12 first:pt-6"
            >
              <h2 className="mb-6 font-display text-2xl font-medium text-graphite sm:text-3xl">
                {cat.name}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {groupItemsBySize(cat.items).map((product) => (
                  <ProductCard
                    key={product.key}
                    product={product}
                    isFav={isFav}
                    onToggleFav={toggle}
                    autoOpenId={autoOpenId}
                  />
                ))}
              </div>
            </section>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
