import { cn } from "@/lib/utils";
import logoMark from "./logo.png";

/** Wordmark: FRAN + Cyrillic ЦУЗ, matching the brand lettering. */
export function Logo({
  className,
  markClassName,
  showTagline = false,
}: {
  className?: string;
  markClassName?: string;
  showTagline?: boolean;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5 select-none", className)}
      aria-label="ФРАНЦУЗ — кав'ярня та пекарня"
    >
      <img
        src={logoMark.src}
        alt=""
        width={logoMark.width}
        height={logoMark.height}
        className={cn("h-8 w-8 shrink-0 object-contain", markClassName)}
        aria-hidden
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold tracking-[0.04em]">
          FRAN<span className="text-gold">Ц</span>УЗ
        </span>
        {showTagline && (
          <span className="mt-1 text-[0.6rem] uppercase tracking-[0.32em] text-mocha">
            кав&apos;ярня &amp; пекарня
          </span>
        )}
      </span>
    </span>
  );
}
