/**
 * Helpers that turn raw JSON (possibly saved by the CMS with empty strings,
 * missing fields, or numbers as strings) into the strict types in src/types.ts.
 */
import type { PeriodId, VerificationStatus } from "../types";

export const PERIOD_IDS: PeriodId[] = ["1850-1899", "1900-1949", "1950-1999", "2000-present"];
const STATUSES: VerificationStatus[] = ["chsa-reviewed", "verified-secondary", "needs-review", "placeholder"];

export type Raw = Record<string, unknown>;

export const obj = (v: unknown): Raw => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : {});
export const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** Trimmed string, or "" if missing / not a string. */
export const str = (v: unknown): string => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");

/** Trimmed string, or undefined if empty. */
export const optStr = (v: unknown): string | undefined => str(v) || undefined;

/** List of non-empty strings (the CMS can save list items as strings or as {value} objects). */
export const strList = (v: unknown): string[] =>
  arr(v)
    .map((x) => (typeof x === "object" && x !== null ? str(Object.values(x)[0]) : str(x)))
    .filter(Boolean);

export const num = (v: unknown): number => (typeof v === "number" ? v : parseFloat(str(v)));

export const isPeriodId = (v: unknown): v is PeriodId => PERIOD_IDS.includes(v as PeriodId);

export const status = (v: unknown): VerificationStatus =>
  STATUSES.includes(v as VerificationStatus) ? (v as VerificationStatus) : "placeholder";
