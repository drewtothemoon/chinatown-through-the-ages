import type { HistoricalEvent, Location, Source } from "../types";
import raw from "../content/locations.json";
import { arr, isPeriodId, num, obj, optStr, status, str, strList } from "./normalize";

/**
 * LOCATIONS
 * Content lives in src/content/locations.json — edit it through the CMS at /admin
 * (or directly). The order of the list sets the map marker numbers.
 * This file only validates that JSON and fills in safe defaults.
 */
function toLocation(value: unknown, index: number): Location | null {
  const r = obj(value);
  const name = str(r.name);
  const latitude = num(r.latitude);
  const longitude = num(r.longitude);

  if (!name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    console.warn(`[locations.json] Skipping entry #${index + 1}: it needs a name, latitude and longitude.`, value);
    return null;
  }

  const relevantPeriods = strList(r.relevantPeriods).filter(isPeriodId);

  const historicalEvents: HistoricalEvent[] = arr(r.historicalEvents)
    .map(obj)
    .filter((e) => str(e.text))
    .map((e) => ({
      date: str(e.date),
      period: isPeriodId(e.period) ? e.period : (relevantPeriods[0] ?? "2000-present"),
      text: str(e.text),
      needsVerification: e.needsVerification === true,
    }));

  const sources: Source[] = arr(r.sources)
    .map(obj)
    .filter((s) => str(s.title))
    .map((s) => ({ title: str(s.title), publisher: optStr(s.publisher), url: optStr(s.url), note: optStr(s.note) }));

  const img = obj(r.image);
  const image = str(img.src)
    ? { src: str(img.src), alt: str(img.alt) || name, credit: str(img.credit), license: str(img.license) }
    : null;

  return {
    id: str(r.id) || `location-${index + 1}`,
    name,
    chineseName: optStr(r.chineseName),
    category: str(r.category),
    latitude,
    longitude,
    address: str(r.address),
    relevantPeriods,
    dateSummary: str(r.dateSummary),
    historicalEvents,
    description: str(r.description),
    culturalSignificance: str(r.culturalSignificance),
    broaderConnection: str(r.broaderConnection),
    preservationConnection: str(r.preservationConnection),
    image,
    sources,
    verificationStatus: status(r.verificationStatus),
    researchNotes: strList(r.researchNotes),
  };
}

export const locations: Location[] = arr(obj(raw).locations)
  .map(toLocation)
  .filter((l): l is Location => l !== null);
