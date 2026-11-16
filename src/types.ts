/**
 * Shared data types for the map.
 * Content itself lives in src/content/*.json (edited through the CMS at /admin).
 * To add a new historical period, add an id here, an entry in src/content/periods.json,
 * and the new option in public/admin/config.yml.
 */
export type PeriodId = "1850-1899" | "1900-1949" | "1950-1999" | "2000-present";

/** "all" is the timeline's "All Periods" option. */
export type PeriodFilter = PeriodId | "all";

export interface Period {
  id: PeriodId;
  label: string; // e.g. "1850–1899"
  title: string; // short headline
  summary: string; // broader historical context shown when the period is selected
  keyThemes: string[];
  verificationStatus: VerificationStatus;
}

/**
 * How confident we are in an entry.
 * - "verified-secondary": checked against published secondary sources (listed in `sources`),
 *    but not yet reviewed with CHSA.
 * - "needs-review": partly checked; some details conflict between sources or rely on weak sources.
 * - "placeholder": not yet researched — do not present as fact.
 * - "chsa-reviewed": reviewed with our CHSA partners (use once that happens).
 */
export type VerificationStatus = "chsa-reviewed" | "verified-secondary" | "needs-review" | "placeholder";

export interface HistoricalEvent {
  /** Display date. Use "c. 1852" or "1960s" when a date is approximate. */
  date: string;
  period: PeriodId;
  text: string;
  /** Set to true if sources disagree or the claim still needs checking. */
  needsVerification?: boolean;
}

export interface Source {
  title: string;
  publisher?: string;
  url?: string;
  /** Optional note, e.g. "tertiary source — replace with scholarly source". */
  note?: string;
}

export interface LocationImage {
  src: string; // put files in /public/images and use "/images/filename.jpg"
  alt: string;
  credit: string; // photographer / archive
  license: string; // e.g. "CC BY-SA 4.0" or "Courtesy of CHSA, used with permission"
}

export interface Location {
  id: string; // unique, url-safe
  name: string;
  /** Optional name in Chinese characters — only add once verified. */
  chineseName?: string;
  category: string; // e.g. "Community Organization", "Public Space"
  latitude: number;
  longitude: number;
  address: string;
  relevantPeriods: PeriodId[];
  /** Short line shown under the name, e.g. "Founded 1963 · Museum since 2001" */
  dateSummary: string;
  historicalEvents: HistoricalEvent[];
  /** Historical background, written for someone new to Chinatown's history. */
  description: string;
  culturalSignificance: string;
  /** How the site connects to the broader story of Chinatown / Chinese America. */
  broaderConnection: string;
  /** How the site has contributed to cultural preservation. */
  preservationConnection: string;
  image: LocationImage | null;
  sources: Source[];
  verificationStatus: VerificationStatus;
  /** Open questions to bring to CHSA. Shown in the panel as "Research notes". */
  researchNotes?: string[];
}

/** General page text, from src/content/site.json. */
export interface SiteContent {
  siteName: string;
  pageTitle: string;
  pageSubtitle: string;
  allPeriodsHeading: string;
  allPeriodsText: string;
  about: {
    eyebrow: string;
    heading: string;
    /** Supports *italics* and the {verify} token (renders the red "Verify" tag). */
    paragraphs: string[];
    goals: { title: string; body: string }[];
  };
  footer: {
    courseLine: string;
    collaborationLine: string;
    groupMembersHeading: string;
    groupMembers: string[];
    sourcesHeading: string;
    sourcesText: string;
    /** {year} is replaced with the current year. */
    creditsText: string;
  };
}
