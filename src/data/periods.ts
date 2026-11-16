import type { Period, PeriodId } from "../types";
import raw from "../content/periods.json";
import { arr, isPeriodId, obj, status, str, strList } from "./normalize";

/**
 * TIMELINE PERIODS
 * Content lives in src/content/periods.json — edit it through the CMS at /admin.
 * Order in the JSON = order on the timeline. Period ids must match PeriodId in src/types.ts.
 */
export const periods: Period[] = arr(obj(raw).periods)
  .map(obj)
  .filter((p) => isPeriodId(p.id))
  .map((p) => ({
    id: p.id as PeriodId,
    label: str(p.label),
    title: str(p.title),
    summary: str(p.summary),
    keyThemes: strList(p.keyThemes),
    verificationStatus: status(p.verificationStatus),
  }));

export const periodById = Object.fromEntries(periods.map((p) => [p.id, p])) as Record<PeriodId, Period>;
