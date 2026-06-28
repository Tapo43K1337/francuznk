import { Logo } from "@/components/brand/Logo";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative bg-graphite text-cream/85">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="text-cream">
              <Logo showTagline />
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/60">
              {SITE.description}
            </p>
          </div>

          <div>
            <h4 className="eyebrow text-gold-soft">Контакти</h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/75">
              <li>{SITE.address}</li>
              <li>
                <a className="hover:text-gold" href={SITE.phoneHref}>
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a className="hover:text-gold" href={SITE.emailHref}>
                  {SITE.email}
                </a>
              </li>
              <li>{SITE.hours}</li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-gold-soft">Wi-Fi</h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/75">
              <li>
                <span className="text-cream/45">Мережа:</span> {SITE.wifi.name}
              </li>
              <li>
                <span className="text-cream/45">Пароль:</span> {SITE.wifi.pass}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/45 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {SITE.name}. Усі права захищені.
          </span>
          <span>Створено з любов&apos;ю до кави</span>
        </div>
      </div>
    </footer>
  );
}
