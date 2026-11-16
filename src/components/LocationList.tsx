import type { Location, PeriodFilter } from "../types";
import { periodById } from "../data/periods";

interface LocationListProps {
  locations: Location[]; // all locations, in map-number order
  period: PeriodFilter;
  query: string;
  onQueryChange: (q: string) => void;
  onSelect: (id: string) => void;
}

function matches(loc: Location, q: string) {
  if (!q) return true;
  const hay = [loc.name, loc.category, loc.address, loc.description].join(" ").toLowerCase();
  return hay.includes(q.toLowerCase().trim());
}

export default function LocationList({ locations, period, query, onQueryChange, onSelect }: LocationListProps) {
  const visible = locations
    .map((loc, i) => ({ loc, n: i + 1 }))
    .filter(({ loc }) => (period === "all" || loc.relevantPeriods.includes(period)) && matches(loc, query));

  return (
    <div className="fade-up flex flex-col gap-3">
      <div>
        <h2 className="font-serif text-xl font-semibold text-ink">Sites to explore</h2>
        <p className="text-sm text-ink-soft">
          {period === "all" ? "All periods" : (periodById[period]?.label ?? period)} · showing {visible.length} of{" "}
          {locations.length}. Select a site on the map or below.
        </p>
      </div>

      <label className="relative block">
        <span className="sr-only">Search locations</span>
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/70"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search sites, e.g. temple, museum…"
          className="w-full rounded-md border border-line bg-card py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
      </label>

      {visible.length === 0 ? (
        <p className="rounded-md border border-dashed border-line p-4 text-sm text-ink-soft">
          No sites match. Try another search or choose “All Periods.”
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map(({ loc, n }) => (
            <li key={loc.id}>
              <button
                type="button"
                onClick={() => onSelect(loc.id)}
                className="group flex w-full items-start gap-3 rounded-lg border border-line bg-card p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:shadow-sm"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cinnabar text-xs font-semibold text-paper">
                  {n}
                </span>
                <span className="min-w-0">
                  <span className="block font-serif text-[15px] font-semibold leading-snug text-ink group-hover:text-cinnabar">
                    {loc.name}
                  </span>
                  <span className="block text-xs text-ink-soft">
                    {[loc.category, loc.dateSummary].filter(Boolean).join(" · ")}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
