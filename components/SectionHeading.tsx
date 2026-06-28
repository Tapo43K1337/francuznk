import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="text-balance font-display text-[length:var(--text-display)] font-medium leading-[var(--text-display--line-height)] text-graphite">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-ink/65 sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
