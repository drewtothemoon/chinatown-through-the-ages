import type { SiteContent } from "../types";
import raw from "../content/site.json";
import { arr, obj, str, strList } from "./normalize";

/** General page text — content lives in src/content/site.json (editable at /admin). */
const r = obj(raw);
const about = obj(r.about);
const footer = obj(r.footer);

export const site: SiteContent = {
  siteName: str(r.siteName),
  pageTitle: str(r.pageTitle),
  pageSubtitle: str(r.pageSubtitle),
  allPeriodsHeading: str(r.allPeriodsHeading),
  allPeriodsText: str(r.allPeriodsText),
  about: {
    eyebrow: str(about.eyebrow),
    heading: str(about.heading),
    paragraphs: strList(about.paragraphs),
    goals: arr(about.goals)
      .map(obj)
      .filter((g) => str(g.title) || str(g.body))
      .map((g) => ({ title: str(g.title), body: str(g.body) })),
  },
  footer: {
    courseLine: str(footer.courseLine),
    collaborationLine: str(footer.collaborationLine),
    groupMembersHeading: str(footer.groupMembersHeading),
    groupMembers: strList(footer.groupMembers),
    sourcesHeading: str(footer.sourcesHeading),
    sourcesText: str(footer.sourcesText),
    creditsText: str(footer.creditsText),
  },
};
