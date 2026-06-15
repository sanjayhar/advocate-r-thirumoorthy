type Props = {
  className?: string;
  label?: string;
};

export function PhotoPlaceholder({ className = "", label = "Advocate R. Thirumoorthy" }: Props) {
  return (
    <figure className={`relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-border bg-secondary ${className}`}>
      <img
        src="/assets/advocate-r-thirumoorthy.png"
        alt={label}
        className="h-full w-full object-cover object-top"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-navy/90" aria-hidden />
    </figure>
  );
}
