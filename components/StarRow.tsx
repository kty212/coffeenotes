// Read-only display of a 0–5 value as five stars with fractional fill.
export default function StarRow({
  value,
  size = "text-base",
}: {
  value: number;
  size?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className={`relative inline-block leading-none ${size}`}
      aria-hidden="true"
    >
      <span className="text-border">★★★★★</span>
      <span
        className="absolute inset-0 overflow-hidden text-accent"
        style={{ width: `${pct}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}
