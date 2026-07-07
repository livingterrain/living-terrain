export default function SiteLoading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      aria-label="Arriving"
      role="status"
    >
      <span className="sr-only">Arriving…</span>
      <div className="h-1 w-1 rounded-full bg-gold/35 animate-pulse-breath" />
    </div>
  );
}
