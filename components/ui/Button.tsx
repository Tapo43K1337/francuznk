import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "outlineLight" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-[background,color,border-color,transform,box-shadow] duration-300 ease-[var(--ease-expo)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-milk disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-graphite text-cream hover:bg-espresso shadow-soft hover:shadow-lift",
  gold: "bg-gold text-graphite hover:bg-gold-soft shadow-gold",
  outline:
    "border border-coffee/25 text-ink hover:border-gold hover:text-gold bg-transparent",
  outlineLight:
    "border border-cream/40 text-cream hover:border-gold hover:text-gold bg-transparent",
  ghost: "text-ink hover:text-gold bg-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & { href: string; external?: boolean };

export function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, external } = props;
    const isHash = href.startsWith("#");
    if (external || isHash) {
      return (
        <a
          href={href}
          className={classes}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as AsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
