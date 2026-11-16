import type { Location, PeriodFilter } from "../types";
import { periods } from "../data/periods";

interface TimelineProps {
  value: PeriodFilter;
  onChange: (p: PeriodFilter) => void;
  locations: Location[];
}

export default function Timeline({ value, onChange, locations }: TimelineProps) {
  const options: { id: PeriodFilter; label: string; title: string; count: number }[] = [
    { id: "all", label: "All Periods", title: "1850–Present", count: locations.length },
    ...periods.map((p) => ({
      id: p.id,
      label: p.label,
      title: p.title,
      count: locations.filter((l) => l.relevantPeriods.includes(p.id)).length,
    })),
  ];

  return (
    <nav aria-label="Historical periods" className="relative">
      {/* connecting rule behind the period stops */}
      <div className="pointer-events-none absolute left-4 right-4 top-[22px] hidden h-px bg-line md:block" />
      <ol className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-5 md:gap-3 md:overflow-visible md:px-0">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <li key={o.id} className="snap-start">
              <button
                type="button"
                onClick={() => onChange(o.id)}
                aria-pressed={active}
                className={`group relative flex w-36 flex-col items-start rounded-lg border px-3 pb-2.5 pt-2.5 text-left md:px-4 md:pb-3 md:pt-3 transition-all duration-200 md:w-full ${
                  active
                    ? "border-cinnabar bg-cinnabar text-paper shadow-md"
                    : "border-line bg-card text-ink hover:-translate-y-0.5 hover:border-gold hover:shadow-sm"
                }`}
              >
                <span
                  className={`mb-2 h-2.5 w-2.5 rounded-full ring-4 transition-colors ${
                    active ? "bg-gold ring-cinnabar" : "bg-line ring-card group-hover:bg-gold"
                  }`}
                />
                <span className="font-serif text-base font-semibold leading-tight md:text-lg">{o.label}</span>
                <span className={`mt-0.5 text-xs leading-snug ${active ? "text-paper/85" : "text-ink-soft"}`}>
                  {o.title}
                </span>
                <span
                  className={`mt-2 text-[11px] font-medium uppercase tracking-wider ${
                    active ? "text-gold-soft" : "text-gold"
                  }`}
                >
                  {o.count} {o.count === 1 ? "site" : "sites"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
