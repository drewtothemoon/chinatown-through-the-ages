import type { ReactNode } from "react";
import type { Location, PeriodFilter } from "../types";
import { periodById } from "../data/periods";
import VerificationBadge from "./VerificationBadge";

interface LocationPanelProps {
  location: Location;
  index: number;
  total: number;
  period: PeriodFilter;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-4">
      <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cinnabar">{title}</h3>
      <div className="text-[15px] leading-relaxed text-ink">{children}</div>
    </section>
  );
}

/** A text section that is hidden when the CMS field is left empty. */
function TextSection({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <Section title={title}>
      <p>{text}</p>
    </Section>
  );
}

function ImagePlaceholder({ name }: { name: string }) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder for ${name}`}
      className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line bg-paper-dark text-center"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-ink-soft/60" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 17l5-4 4 3 3-2 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <p className="px-6 text-xs text-ink-soft">
        Image pending — a properly licensed historical or present-day photograph will be added (e.g., from CHSA
        archives, with permission).
      </p>
    </div>
  );
}

export default function LocationPanel({ location, index, total, period, onClose, onPrev, onNext }: LocationPanelProps) {
  const loc = location;
  const notes = loc.researchNotes ?? [];
  return (
    <article key={loc.id} className="fade-up flex flex-col gap-4" aria-labelledby="location-title">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-ink-soft transition-colors hover:bg-paper-dark hover:text-ink"
        >
          <span aria-hidden>←</span> All sites
        </button>
        <div className="flex items-center gap-1 text-sm text-ink-soft">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous site"
            className="rounded-md px-2 py-1 transition-colors hover:bg-paper-dark hover:text-ink"
          >
            ‹
          </button>
          <span className="tabular-nums">
            {index + 1} / {total}
          </span>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next site"
            className="rounded-md px-2 py-1 transition-colors hover:bg-paper-dark hover:text-ink"
          >
            ›
          </button>
        </div>
      </div>

      <header>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {loc.category && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">{loc.category}</span>
          )}
          <VerificationBadge status={loc.verificationStatus} />
        </div>
        <h2 id="location-title" className="font-serif text-2xl font-semibold leading-tight text-ink">
          {loc.name}
          {loc.chineseName && <span className="ml-2 font-normal text-ink-soft">{loc.chineseName}</span>}
        </h2>
        {loc.dateSummary && <p className="mt-1 text-sm text-ink-soft">{loc.dateSummary}</p>}
        {loc.address && <p className="mt-0.5 text-sm text-ink-soft">{loc.address}</p>}
        {loc.relevantPeriods.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {loc.relevantPeriods.map((p) => (
              <span
                key={p}
                className={`rounded-full border px-2 py-0.5 text-[11px] ${
                  p === period ? "border-cinnabar bg-cinnabar text-paper" : "border-line text-ink-soft"
                }`}
              >
                {periodById[p]?.label ?? p}
              </span>
            ))}
          </div>
        )}
      </header>

      {loc.image ? (
        <figure>
          <img src={loc.image.src} alt={loc.image.alt} className="aspect-[16/9] w-full rounded-md object-cover" />
          {(loc.image.credit || loc.image.license) && (
            <figcaption className="mt-1 text-[11px] text-ink-soft">
              {[loc.image.credit, loc.image.license].filter(Boolean).join(" · ")}
            </figcaption>
          )}
        </figure>
      ) : (
        <ImagePlaceholder name={loc.name} />
      )}

      <TextSection title="Historical background" text={loc.description} />

      {loc.historicalEvents.length > 0 && (
        <Section title="Key moments">
          <ol className="relative ml-1 space-y-3 border-l border-line pl-4">
            {loc.historicalEvents.map((e, i) => {
              const highlight = period !== "all" && e.period === period;
              const faded = period !== "all" && e.period !== period;
              return (
                <li key={i} className={`relative transition-opacity ${faded ? "opacity-55" : ""}`}>
                  <span
                    className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card ${
                      highlight ? "bg-cinnabar" : "bg-gold"
                    }`}
                    aria-hidden
                  />
                  <p className="font-serif text-sm font-semibold text-ink">
                    {e.date}
                    {e.needsVerification && (
                      <span className="ml-2 rounded bg-cinnabar-soft px-1.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wide text-cinnabar-dark">
                        Verify
                      </span>
                    )}
                  </p>
                  <p className="text-sm leading-relaxed text-ink-soft">{e.text}</p>
                </li>
              );
            })}
          </ol>
        </Section>
      )}

      <TextSection title="Cultural significance" text={loc.culturalSignificance} />
      <TextSection title="Connection to Chinatown history" text={loc.broaderConnection} />
      <TextSection title="Contribution to cultural preservation" text={loc.preservationConnection} />

      {notes.length > 0 && (
        <section className="rounded-md border border-gold/40 bg-gold-soft/50 p-3">
          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a5a1c]">
            Research notes · open questions for CHSA
          </h3>
          <ul className="list-disc space-y-1 pl-4 text-sm text-ink-soft">
            {notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      )}

      {loc.sources.length > 0 && (
        <Section title="Sources">
          <ul className="space-y-1.5 text-sm">
            {loc.sources.map((s, i) => (
              <li key={i}>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cinnabar underline decoration-cinnabar/30 underline-offset-2 hover:decoration-cinnabar"
                  >
                    {s.title}
                  </a>
                ) : (
                  <span>{s.title}</span>
                )}
                {s.publisher && <span className="text-ink-soft"> — {s.publisher}</span>}
                {s.note && <span className="block text-xs text-ink-soft/80">{s.note}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
