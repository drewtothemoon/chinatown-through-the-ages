import { useCallback, useEffect, useRef, useState } from "react";
import type { PeriodFilter } from "./types";
import { locations } from "./data/locations";
import { periodById } from "./data/periods";
import { site } from "./data/site";
import MapView from "./components/MapView";
import Timeline from "./components/Timeline";
import LocationPanel from "./components/LocationPanel";
import LocationList from "./components/LocationList";
import { About, Footer, Header } from "./components/SiteChrome";

export default function App() {
  const [period, setPeriod] = useState<PeriodFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedIndex = locations.findIndex((l) => l.id === selectedId);
  const selected = selectedIndex >= 0 ? locations[selectedIndex] : undefined;
  const activePeriod = period === "all" ? null : (periodById[period] ?? null);

  const select = useCallback((id: string) => {
    setSelectedId(id);
    // On small screens the panel sits below the map — bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, []);

  // Reset panel scroll when the selection changes
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [selectedId]);

  // Honor #about / #explore links when the page first loads
  useEffect(() => {
    if (window.location.hash) document.querySelector(window.location.hash)?.scrollIntoView();
  }, []);

  // Escape closes the panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const step = (dir: 1 | -1) => {
    const n = locations.length;
    const i = selectedIndex < 0 ? 0 : (selectedIndex + dir + n) % n;
    setSelectedId(locations[i].id);
  };

  return (
    <div id="top" className="min-h-screen">
      <Header />

      <main id="explore" className="mx-auto max-w-[1400px] scroll-mt-16 px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
        <div className="mb-5 max-w-3xl">
          <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            {site.pageTitle}
          </h1>
          {site.pageSubtitle && <p className="mt-2 text-base text-ink-soft sm:text-lg">{site.pageSubtitle}</p>}
        </div>

        <Timeline value={period} onChange={setPeriod} locations={locations} />

        {/* Period context */}
        <div
          key={period}
          className="fade-up mt-3 rounded-lg border border-line border-l-4 border-l-gold bg-card px-4 py-3 sm:px-5"
          aria-live="polite"
        >
          {activePeriod ? (
            <>
              <p className="font-serif text-base font-semibold text-ink">
                {activePeriod.label}: {activePeriod.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{activePeriod.summary}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {activePeriod.keyThemes.map((t) => (
                  <span key={t} className="rounded-full bg-paper-dark px-2 py-0.5 text-[11px] text-ink-soft">
                    {t}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-ink-soft">
              {site.allPeriodsHeading && (
                <span className="font-serif text-base font-semibold text-ink">{site.allPeriodsHeading} </span>
              )}
              {site.allPeriodsText}
            </p>
          )}
        </div>

        {/* Map + panel */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="relative h-[58vh] min-h-[380px] overflow-hidden rounded-lg border border-line shadow-sm lg:h-[calc(100vh-150px)] lg:max-h-[820px] lg:min-h-[560px]">
            <MapView locations={locations} period={period} selectedId={selectedId} onSelect={select} />
            <div className="pointer-events-none absolute right-3 top-3 z-[500] hidden rounded-md border border-line bg-card/95 px-3 py-2 text-xs text-ink-soft shadow-sm sm:block">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-cinnabar" /> In selected period
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#a39887] opacity-60" /> Other periods
              </div>
            </div>
          </div>

          <aside
            ref={panelRef}
            className="scroll-mt-20 rounded-lg border border-line bg-card p-4 shadow-sm sm:p-5 lg:h-[calc(100vh-150px)] lg:max-h-[820px] lg:min-h-[560px] lg:overflow-y-auto"
            aria-label="Location details"
          >
            {selected ? (
              <LocationPanel
                location={selected}
                index={selectedIndex}
                total={locations.length}
                period={period}
                onClose={() => setSelectedId(null)}
                onPrev={() => step(-1)}
                onNext={() => step(1)}
              />
            ) : (
              <LocationList
                locations={locations}
                period={period}
                query={query}
                onQueryChange={setQuery}
                onSelect={select}
              />
            )}
          </aside>
        </div>
      </main>

      <About />
      <Footer />
    </div>
  );
}
