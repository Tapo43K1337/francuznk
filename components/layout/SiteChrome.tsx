"use client";

// Footer + floating UI rendered on every route except the landing splash ("/"),
// which is kept clean (its only job is to lead into the menu).
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function SiteChrome() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return <Footer />;
}
