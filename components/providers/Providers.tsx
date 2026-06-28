"use client";

import { MotionConfig } from "motion/react";
import { SmoothScroll } from "./SmoothScroll";
import { CartProvider } from "@/components/cart/CartProvider";

/** App-wide client providers: reduced-motion, smooth scroll, cart. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </CartProvider>
    </MotionConfig>
  );
}
