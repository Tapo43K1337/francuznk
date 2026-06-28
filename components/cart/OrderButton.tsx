"use client";

import { useCart } from "./CartProvider";
import { Button } from "@/components/ui/Button";

type Props = {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "outlineLight" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** Opens the cart/checkout drawer (replaces the old external order link). */
export function OrderButton({ children, variant, size, className }: Props) {
  const { open } = useCart();
  return (
    <Button variant={variant} size={size} className={className} onClick={open}>
      {children}
    </Button>
  );
}
