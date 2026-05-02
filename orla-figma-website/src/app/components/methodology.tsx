import { Reveal } from "./reveal";

const sectionPad = "px-6 md:px-12 lg:px-20 py-28 md:py-36";
const eyebrow = "text-[11px] tracking-[0.24em] uppercase text-stone-400 smallcaps";
const panel: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
};

export function Methodology() {
  const sources = [
    {
      n: "01",
      name: "SAM.gov",
      kind: "Active solicitations · Awards",
      cadence: "Hourly",
      note: "Primary source for active opportunities, set-aside designations, and incumbent identification.",
    },
    {
      n: "02",
      name: "FPDS · USAspending",
      kind: "Historical obligations",
      cadence: "Daily",
      note: "10-year obligation history. Reconciled across reporting lags; we surface the lag explicitly when material.",
    },
    {
      n: "03",
      name: "Agency forecasts",
      kind: "FY procurement plans",
      cadence: "Quarterly",
      note: "Forecasts from 24 cabinet & component agencies, normalized to a common schema and scored for historical accuracy.",
    },
    {
      n: "04",
      name: "GSA eLibrary · Schedules",
      kind: "Vehicles · Ceiling",
      cadence: "Daily",
      note: "Contract vehicles, ceiling values, and category structure. Used to scope addressable share by size bracket.",
    },
    {
      n: "05",
      name: "Recompete intelligence",
      kind: "Period-of-performance signals",
      cadence: "Weekly",
      note: "Derived from historical award terms and option-year exercise patterns. Confidence figure attached to every flagged recompete.",
    },
    {
      n: "06",
      name: "Analyst layer",
      kind: "Human judgment, named",
      cadence: "Weekly",
      note: "Senior federal analysts review machine output before publication. Judgment calls are signed and carry confidence figures.",
    },
  ];

  return (
    <section
      id="methodology"
      className={"relative " + sectionPad}
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      aria-labelledby="methodology-title"
    >
      <Reveal>
        <div className="flex items-center gap-4 mb-6">
          <div className="mono text-[12px] text-stone-500">§&nbsp;04</div>
          <div className="h-px flex-1 max-w-20" style={{ background: "rgba(255,255,255,0.12)" }} />
          <div className={eyebrow}>How we know</div>
        </div>
        <h2
          id="methodology-title"
          className="serif text-stone-50 max-w-4xl mb-6"
          style={{
            fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)",
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
          }}
        >
          Six sources. One reconciled view. Every claim traceable.
        </h2>
        <p className="text-stone-400 max-w-2xl mb-16" style={{ fontSize: "1rem" }}>
          A brief is only as honest as its provenance. Every figure in an Orla Strategy Brief
          resolves to one of the sources below, with the refresh cadence stated and the analyst —
          when one was involved — named.
        </p>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-5">
        {sources.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06}>
            <div className="p-7 md:p-8 h-full rounded-sm panel-hover" style={panel}>
              <div className="flex items-baseline justify-between mb-4">
                <div className="mono text-[11px] text-stone-500">{s.n}</div>
                <div className="mono text-[11px] text-stone-400 tracking-[0.12em] uppercase">
                  Refresh · {s.cadence}
                </div>
              </div>
              <div className="flex items-baseline justify-between mb-3 gap-4">
                <h3
                  className="serif text-stone-50"
                  style={{ fontSize: "1.1875rem", fontWeight: 500 }}
                >
                  {s.name}
                </h3>
                <div className={eyebrow + " text-right"}>{s.kind}</div>
              </div>
              <p
                className="text-stone-300 leading-relaxed"
                style={{ fontSize: "0.9375rem" }}
              >
                {s.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div
          className="mt-10 p-6 md:p-7 rounded-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={panel}
        >
          <p className="text-stone-300" style={{ fontSize: "0.9375rem" }}>
            Every brief ships with a methodology footnote — the exact extraction window, the
            sources consulted, and any judgment calls flagged with a confidence figure.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2.5 rounded-sm text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDB51]/60 transition"
            style={{ border: "1px solid rgba(250,250,249,0.2)", color: "#FAFAF9" }}
          >
            Read the methodology paper
            <span aria-hidden className="mono text-[12px]">→</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
