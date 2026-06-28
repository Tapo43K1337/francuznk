import type Lenis from "lenis";

/**
 * Module-level handle to the active Lenis instance so any client component can
 * drive programmatic smooth-scroll (anchor navigation) without prop drilling.
 * `null` when reduced-motion is on (Lenis is disabled) — callers fall back to
 * native scrolling.
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Smooth-scroll an element to just below a fixed offset (sticky header/nav).
 *  `onDone` fires when the scroll actually settles, so callers can release a
 *  "programmatic" guard without racing the animation. */
export function scrollToEl(
  el: HTMLElement,
  offsetPx: number,
  onDone?: () => void
) {
  const lenis = getLenis();
  if (lenis) {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onDone?.();
    };
    lenis.scrollTo(el, { offset: -offsetPx, duration: 1, onComplete: finish });
    // safety net: if the user interrupts the scroll, Lenis may never fire
    // onComplete — release the guard anyway so scrollspy resumes.
    if (onDone) window.setTimeout(finish, 1200);
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - offsetPx;
    window.scrollTo({ top, behavior: "smooth" });
    // native smooth scroll has no completion event — approximate it
    if (onDone) window.setTimeout(onDone, 700);
  }
}
