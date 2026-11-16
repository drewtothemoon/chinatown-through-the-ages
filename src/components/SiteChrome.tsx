/** Header, About section and Footer. Text comes from src/content/site.json (editable at /admin). */
import type { ReactNode } from "react";
import { site } from "../data/site";

/**
 * Renders the small amount of formatting allowed in CMS text:
 *   *words*   → italics
 *   {verify}  → the red "Verify" tag used in location panels
 */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*|\{verify\})/g);
  return (
    <>
      {parts.map((part, i): ReactNode => {
        if (part === "{verify}")
          return (
            <span key={i} className="rounded bg-cinnabar-soft px-1 text-xs font-medium text-cinnabar-dark">
              Verify
            </span>
          );
        if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
        return part;
      })}
    </>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-[1100] border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cinnabar" aria-hidden>
            <span className="h-3.5 w-3.5 rounded-full border-2 border-gold" />
          </span>
          <span className="font-serif text-base font-semibold leading-tight text-ink sm:text-lg">{site.siteName}</span>
        </a>
        <nav className="flex items-center gap-1 text-sm">
          <a
            href="#explore"
            className="rounded-md px-3 py-1.5 text-ink-soft transition-colors hover:bg-paper-dark hover:text-ink"
          >
            Explore<span className="hidden sm:inline"> Map</span>
          </a>
          <a
            href="#about"
            className="rounded-md px-3 py-1.5 text-ink-soft transition-colors hover:bg-paper-dark hover:text-ink"
          >
            About<span className="hidden sm:inline"> the Project</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export function About() {
  const { about } = site;
  const goals = about.goals;
  return (
    <section id="about" className="scroll-mt-20 border-t border-line bg-paper-dark/60">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cinnabar">{about.eyebrow}</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-ink">{about.heading}</h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft">
            {about.paragraphs.map((p, i) => (
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {goals.map((g, i) => (
            <li
              key={i}
              // When there is an odd number of cards, the last one spans the full width.
              className={`rounded-lg border border-line bg-card p-4 ${
                goals.length % 2 === 1 && i === goals.length - 1 ? "sm:col-span-2" : ""
              }`}
            >
              <h3 className="font-serif text-base font-semibold text-ink">{g.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{g.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Footer() {
  const { footer } = site;
  const credits = footer.creditsText.replace("{year}", String(new Date().getFullYear()));
  return (
    <footer className="bg-ink text-paper/80">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 text-sm sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-semibold text-paper">{site.siteName}</p>
          {footer.courseLine && <p className="mt-1">{footer.courseLine}</p>}
          {footer.collaborationLine && <p>{footer.collaborationLine}</p>}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">{footer.groupMembersHeading}</p>
          <div className="mt-1">
            {footer.groupMembers.map((m, i) => (
              <p key={i}>{m}</p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">{footer.sourcesHeading}</p>
          <p className="mt-1 leading-relaxed">
            {footer.sourcesText && <>{footer.sourcesText} </>}
            {/* OpenStreetMap attribution is required by its license — keep it in code, not the CMS. */}
            Map data ©{" "}
            <a className="underline underline-offset-2 hover:text-paper" href="https://www.openstreetmap.org/copyright">
              OpenStreetMap
            </a>{" "}
            contributors.{credits && <> {credits}</>}
          </p>
        </div>
      </div>
    </footer>
  );
}
