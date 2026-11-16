import type { VerificationStatus } from "../types";

const STYLES: Record<VerificationStatus, { label: string; cls: string; hint: string }> = {
  "chsa-reviewed": {
    label: "Reviewed with CHSA",
    cls: "bg-jade/10 text-jade border-jade/30",
    hint: "Reviewed with our community partner, the Chinese Historical Society of America.",
  },
  "verified-secondary": {
    label: "Checked against sources",
    cls: "bg-gold-soft text-[#7a5a1c] border-gold/40",
    hint: "Checked against the published sources listed below. Not yet reviewed with CHSA.",
  },
  "needs-review": {
    label: "Draft · needs review",
    cls: "bg-cinnabar-soft text-cinnabar-dark border-cinnabar/25",
    hint: "Some details conflict between sources or rely on weak sources. See research notes.",
  },
  placeholder: {
    label: "Placeholder · research pending",
    cls: "bg-paper-dark text-ink-soft border-line",
    hint: "Placeholder content. Not yet researched — do not cite.",
  },
};

export default function VerificationBadge({ status }: { status: VerificationStatus }) {
  const s = STYLES[status];
  return (
    <span
      title={s.hint}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${s.cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {s.label}
    </span>
  );
}
