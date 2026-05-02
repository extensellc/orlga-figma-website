import { Reveal } from "./reveal";
import type { ReactNode } from "react";

const sectionPad = "px-6 md:px-12 lg:px-20 py-28 md:py-36";
const eyebrow = "text-[11px] tracking-[0.24em] uppercase text-tertiary smallcaps";
const h2Style = {
  fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)",
  fontWeight: 500,
  lineHeight: 1.15,
  letterSpacing: "-0.015em",
};

// Shared translucent panel — lets the gradient show through, reads as layered depth
const panel: React.CSSProperties = {
  background:
    "linear-gradient(180deg, var(--panel-from), var(--panel-to))",
  border: "1px solid var(--border-subtle)",
  boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
};

function SectionHeader({
  num,
  kicker,
  title,
  lede,
  wide = false,
  id,
}: {
  num: string;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  wide?: boolean;
  id?: string;
}) {
  return (
    <Reveal>
      <div className="flex items-center gap-4 mb-6">
        <div className="nums text-[12px] text-quaternary">§&nbsp;{num}</div>
        <div className="h-px flex-1 max-w-20" style={{ background: "var(--border-strong)" }} />
        <div className={eyebrow}>{kicker}</div>
      </div>
      <h2
        id={id}
        className={`serif text-primary ${wide ? "max-w-5xl" : "max-w-3xl"} ${lede ? "mb-6" : "mb-16"}`}
        style={h2Style}
      >
        {title}
      </h2>
      {lede && (
        <p className="text-tertiary max-w-2xl mb-16" style={{ fontSize: "1rem" }}>
          {lede}
        </p>
      )}
    </Reveal>
  );
}

/* ─────────────────────────────────────────────
   § 01  What's broken today
   ───────────────────────────────────────────── */
export function Broken() {
  const pains = [
    {
      n: "01",
      t: "Friday afternoons in spreadsheets.",
      b: "You pull NAICS spend across agencies into Excel, sort it three ways, and by 5pm you still cannot tell your partner which two agencies to chase.",
      stat: "5–10 hrs / week",
    },
    {
      n: "02",
      t: "$200 an hour for someone to read FPDS.",
      b: "You pay a consultant to tell you which recompetes matter. It takes two weeks. By the time the deck arrives, the market has moved.",
      stat: "$200 / hour",
    },
    {
      n: "03",
      t: "A $29,000 search box.",
      b: "GovWin IQ returns 4,217 opportunities for your query. None of them are ranked. None are annotated. The interpretation is still your job.",
      stat: "$29,000 / year",
    },
  ];
  return (
    <section id="broken" className={"relative " + sectionPad} aria-labelledby="broken-title">
      <SectionHeader
        id="broken-title"
        num="01"
        kicker="What's broken today"
        title="Federal BD is the last professional function still done in spreadsheets and by the hour."
      />
      <div className="grid md:grid-cols-3 gap-5">
        {pains.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.1}>
            <div className="p-8 md:p-10 h-full rounded-sm panel-hover" style={panel}>
              <div className="nums text-[11px] text-quaternary mb-6">{p.n}</div>
              <h3
                className="serif text-primary mb-4"
                style={{ fontSize: "1.375rem", fontWeight: 500, lineHeight: 1.3 }}
              >
                {p.t}
              </h3>
              <p className="text-secondary leading-relaxed mb-8" style={{ fontSize: "0.9375rem" }}>
                {p.b}
              </p>
              <div className="pt-5" style={{ borderTop: "1px solid var(--border-default)" }}>
                <div className="nums text-[13px]">{p.stat}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   § 07  Privacy & trust — tighter, inline layout
   ───────────────────────────────────────────── */
export function Trust() {
  const items = [
    ["Cancel anytime.", "No annual lock-in. No proration math."],
    ["60 days, then gone.", "Full retention for 60 days after cancellation. Then permanently deleted."],
    ["Comprehensive export.", "Full brief history and firm profile, portable files, anytime."],
    ["No re-engagement emails.", "When you cancel, we stop emailing you. No win-back drip."],
  ];
  return (
    <section
      id="trust"
      aria-labelledby="trust-title"
      className="relative px-6 md:px-12 lg:px-20 py-20 md:py-24"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
        <Reveal>
          <div className="flex items-center gap-4 mb-6">
            <div className="nums text-[12px] text-quaternary">§&nbsp;07</div>
            <div className="h-px flex-1 max-w-20" style={{ background: "var(--border-strong)" }} />
            <div className={eyebrow}>Privacy & trust</div>
          </div>
          <h2 id="trust-title" className="serif text-primary mb-5" style={{ ...h2Style, fontSize: "clamp(1.5rem, 2.6vw, 2rem)" }}>
            Stated plainly, because fine print is how firms get burned.
          </h2>
          <p className="text-tertiary leading-relaxed" style={{ fontSize: "0.9375rem" }}>
            These are not footer links; they are the deal.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <dl style={{ borderColor: "var(--border-default)" }}>
            {items.map(([k, v], i) => (
              <div key={k} className="grid grid-cols-[auto_1fr] gap-8 py-5 first:pt-0 items-baseline" style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border-default)" : undefined }}>
                <dt className="nums text-[11px] text-quaternary w-8">0{i + 1}</dt>
                <dd>
                  <div className="text-primary mb-1" style={{ fontSize: "0.9375rem", fontWeight: 500 }}>
                    {k}
                  </div>
                  <div className="text-tertiary leading-relaxed" style={{ fontSize: "0.9375rem" }}>
                    {v}
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Footer
   ───────────────────────────────────────────── */
export function Footer() {
  return (
    <footer
      className="px-6 md:px-12 lg:px-20 py-14"
      style={{ borderTop: "1px solid var(--panel-border)" }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div
          className="text-primary tracking-[-0.01em]"
          style={{ fontSize: "1.25rem", fontWeight: 600 }}
        >
          Orla
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-tertiary">
          <a href="#" className="hover:text-primary transition">Privacy</a>
          <a href="#" className="hover:text-primary transition">Terms</a>
          <a href="#" className="hover:text-primary transition">Security</a>
          <a href="#" className="hover:text-primary transition">Contact</a>
        </div>
        <div className="nums text-[12px] text-quaternary">© 2026 Orla Intelligence</div>
      </div>
    </footer>
  );
}
