import type { Metadata } from "next";
import { MenuSection } from "@/components/menu/MenuSection";

export const metadata: Metadata = {
  title: "Меню",
  description: "Усе меню ФРАНЦУЗ — напої та страви. Кава, авторські напої, випічка та сніданки.",
};

export default function MenuPage() {
  return <MenuSection />;
}
