import type { Metadata } from "next";
import { ContactsSection } from "@/components/contacts/ContactsSection";

export const metadata: Metadata = {
  title: "Контакти",
  description: "Адреса, графік роботи та телефон кав'ярні ФРАНЦУЗ. Завітайте на каву.",
};

export default function ContactsPage() {
  return (
    <div className="flex min-h-[100svh] flex-col bg-milk pt-20 sm:pt-28 lg:min-h-0">
      <ContactsSection />
    </div>
  );
}
