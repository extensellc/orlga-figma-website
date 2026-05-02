import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "./reveal";
import { useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

// Shared weights store — §02 sliders drive §03's featured ranking
type Weights = { rules: number; patterns: number; judgment: number };
const DEFAULT_WEIGHTS: Weights = { rules: 0.40, patterns: 0.35, judgment: 0.25 };
let _weights: Weights = DEFAULT_WEIGHTS;
const _listeners = new Set<() => void>();
const _subscribe = (l: () => void) => {
  _listeners.add(l);
  return () => {
    _listeners.delete(l);
  };
};
const _getSnapshot = () => _weights;
function setSharedWeights(w: Weights) {
  _weights = w;
  _listeners.forEach((l) => l());
}
function useSharedWeights() {
  return useSyncExternalStore(_subscribe, _getSnapshot, _getSnapshot);
}

const sectionPad = "px-6 md:px-12 lg:px-20 py-28 md:py-36";
const eyebrow = "text-[11px] tracking-[0.24em] uppercase text-stone-400 smallcaps";
const h2Style = {
  fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)",
  fontWeight: 500,
  lineHeight: 1.15,
  letterSpacing: "-0.015em",
};

// Shared translucent panel — lets the gradient show through, reads as layered depth
const panel: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))",
  border: "1px solid rgba(255,255,255,0.06)",
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
        <div className="nums text-[12px] text-stone-500">§&nbsp;{num}</div>
        <div className="h-px flex-1 max-w-20" style={{ background: "rgba(255,255,255,0.12)" }} />
        <div className={eyebrow}>{kicker}</div>
      </div>
      <h2
        id={id}
        className={`serif text-stone-50 ${wide ? "max-w-5xl" : "max-w-3xl"} ${lede ? "mb-6" : "mb-16"}`}
        style={h2Style}
      >
        {title}
      </h2>
      {lede && (
        <p className="text-stone-400 max-w-2xl mb-16" style={{ fontSize: "1rem" }}>
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
              <div className="nums text-[11px] text-stone-500 mb-6">{p.n}</div>
              <h3
                className="serif text-stone-50 mb-4"
                style={{ fontSize: "1.375rem", fontWeight: 500, lineHeight: 1.3 }}
              >
                {p.t}
              </h3>
              <p className="text-stone-300 leading-relaxed mb-8" style={{ fontSize: "0.9375rem" }}>
                {p.b}
              </p>
              <div className="pt-5 border-t border-stone-50/10">
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
   § 02  How Orla weighs — interactive factor mechanism
   ───────────────────────────────────────────── */
type WatchOpp = { id: string; a: string; t: string; r: number; p: number; j: number };
const watchOpps: WatchOpp[] = [
  { id: "OPP-2418", a: "DHS", t: "Cyber Mission Mgmt — recompete", r: 0.91, p: 0.78, j: 0.84 },
  { id: "OPP-3104", a: "VA",  t: "Health Records continuity",      r: 0.74, p: 0.86, j: 0.71 },
  { id: "OPP-2750", a: "DHS", t: "TSA Identity Services BPA",      r: 0.81, p: 0.62, j: 0.79 },
  { id: "OPP-1882", a: "DoD", t: "DISA Network Modernization",     r: 0.55, p: 0.71, j: 0.48 },
  { id: "OPP-4001", a: "GSA", t: "Schedule 70 refresh",            r: 0.62, p: 0.49, j: 0.41 },
  { id: "OPP-3812", a: "DOE", t: "Grid Modernization vehicle",     r: 0.45, p: 0.58, j: 0.52 },
];

const FACTORS = [
  { k: "rules" as const,    label: "Rules",    color: "#7DD3FC", desc: "Stated as fact. Set-asides, ceilings, mandatory qualifications." },
  { k: "patterns" as const, label: "Patterns", color: "#60A5FA", desc: "Informed assessment. Award cadence, shifts, anomalies named." },
  { k: "judgment" as const, label: "Judgment", color: "#FFDB51", desc: "Named analyst call, with a confidence figure attached." },
];

export function Different() {
  const w = useSharedWeights();
  const setW = setSharedWeights;
  const dirty =
    w.rules !== DEFAULT_WEIGHTS.rules ||
    w.patterns !== DEFAULT_WEIGHTS.patterns ||
    w.judgment !== DEFAULT_WEIGHTS.judgment;
  const total = w.rules + w.patterns + w.judgment || 1;
  const n = { rules: w.rules / total, patterns: w.patterns / total, judgment: w.judgment / total };

  const scored = useMemo(() => {
    return [...watchOpps]
      .map((o) => ({ ...o, s: o.r * n.rules + o.p * n.patterns + o.j * n.judgment }))
      .sort((a, b) => b.s - a.s);
  }, [n.rules, n.patterns, n.judgment]);

  return (
    <section
      id="different"
      className={"relative " + sectionPad}
      aria-labelledby="different-title"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <SectionHeader
        id="different-title"
        num="02"
        kicker="How Orla weighs"
        title="Three signals. One score. The math is named."
        lede={
          <>
            From <span className="nums">312</span> NAICS-relevant opportunities, Orla derives three
            independent signals — <span className="text-stone-50">Rules</span>,{" "}
            <span className="text-stone-50">Patterns</span>, and{" "}
            <span className="text-stone-50">Judgment</span> — and combines them into one composite.
            Move the weights; the watchlist re-ranks in real time.
          </>
        }
        wide
      />

      <div className="grid lg:grid-cols-[1fr_1.45fr] gap-8 lg:gap-12">
        <Reveal>
          <div className="p-7 md:p-8 rounded-sm h-fit space-y-7" style={panel}>
            <div className="flex items-baseline justify-between">
              <div className={eyebrow}>Factor weights</div>
              <div className="flex items-baseline gap-4">
                {dirty && (
                  <button
                    type="button"
                    onClick={() => setW(DEFAULT_WEIGHTS)}
                    className="text-[11px] text-stone-300 hover:text-stone-50 transition underline-offset-2 hover:underline"
                  >
                    Reset to default
                  </button>
                )}
                <div className="nums text-[11px] text-stone-500">Σ = 1.00</div>
              </div>
            </div>
            {FACTORS.map((f) => (
              <div key={f.k}>
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: f.color }} />
                    <div className="text-stone-100" style={{ fontSize: "0.9375rem", fontWeight: 500 }}>
                      {f.label}
                    </div>
                  </div>
                  <div className="nums text-[12px] text-stone-100">{(n[f.k] * 100).toFixed(0)}%</div>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={w[f.k]}
                    onChange={(e) => setW({ ...w, [f.k]: parseFloat(e.target.value) })}
                    className="w-full relative z-10"
                    style={{ accentColor: f.color }}
                    aria-label={`${f.label} weight`}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-px h-2.5"
                    style={{
                      left: `${DEFAULT_WEIGHTS[f.k] * 100}%`,
                      background: "rgba(255,255,255,0.35)",
                    }}
                  />
                </div>
                <p className="text-[12px] text-stone-400 mt-1.5 leading-relaxed">{f.desc}</p>
              </div>
            ))}
            <div className="pt-5 border-t border-stone-50/10 text-[12px] text-stone-500 leading-relaxed">
              These are the weights a senior analyst would set. Move them; the watchlist follows.
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="rounded-sm p-7 md:p-8" style={panel}>
            <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-stone-50/10">
              <div className={eyebrow}>Composite watchlist · top 6 of 47</div>
              <div className="nums text-[11px] text-stone-500">Updated · live</div>
            </div>
            <motion.ul layout className="space-y-2">
              {scored.map((o, i) => (
                <motion.li
                  layout
                  key={o.id}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  className="grid items-baseline gap-x-4 px-4 py-3 rounded-sm"
                  style={{
                    gridTemplateColumns: "auto auto 1fr auto auto",
                    background: i === 0 ? "rgba(255,219,81,0.06)" : "rgba(255,255,255,0.018)",
                    borderLeft: i === 0 ? "2px solid #FFDB51" : "2px solid transparent",
                  }}
                >
                  <div className="nums text-[12px] text-stone-500 w-6">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="nums text-[11px] text-stone-400 w-10">{o.a}</div>
                  <div className="text-[13px] text-stone-100">{o.t}</div>
                  <div className="hidden md:flex items-center gap-1.5 mr-4">
                    <SegBar v={o.r * n.rules} color="#7DD3FC" />
                    <SegBar v={o.p * n.patterns} color="#60A5FA" />
                    <SegBar v={o.j * n.judgment} color="#FFDB51" />
                  </div>
                  <div className="nums text-[13px]" style={{ color: i === 0 ? "#FFDB51" : "#FAFAF9" }}>
                    {o.s.toFixed(2)}
                  </div>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mt-5 pt-4 border-t border-stone-50/10 flex items-baseline justify-between text-[11px] text-stone-500">
              <span>Composite = Σ (signal × weight)</span>
              <span className="nums">
                Top: {scored[0].id} · {scored[0].s.toFixed(2)}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SegBar({ v, color }: { v: number; color: string }) {
  return (
    <div className="w-7 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
      <motion.div
        animate={{ width: `${Math.min(100, v * 200)}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        style={{ height: "100%", background: color }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   § 03  This week's brief — three opportunities, with charts and analyst notes
   ───────────────────────────────────────────── */
type Brief = {
  rank: number;
  id: string;
  agency: string;
  title: string;
  ceiling: string;
  decision: string;
  composite: number;
  conf: number;
  confRange: [number, number];
  seriesLabel: string;
  series: number[];
  annotation: { idx: number; label: string };
  note: string;
  analyst: string;
  tag: "Pattern" | "Rule" | "Judgment";
};
type BriefData = Omit<Brief, "rank" | "composite">;

const briefsById: Record<string, BriefData> = {
  "OPP-2418": {
    id: "OPP-2418",
    agency: "DHS",
    title: "Cyber Mission Management — recompete",
    ceiling: "$24M",
    decision: "Q3 FY26",
    conf: 0.82,
    confRange: [0.74, 0.88],
    seriesLabel: "DHS cyber line · quarterly obligations ($M)",
    series: [180, 198, 212, 240, 260, 268, 290, 320, 365, 388, 412, 410],
    annotation: { idx: 7, label: "Award cadence Q4 → Q2" },
    note: "DHS cyber procurement has accelerated three cycles running. The incumbent's option year is unlikely to be exercised given the Q4→Q2 shift. Two firms in your size bracket have already signaled intent.",
    analyst: "M.R.",
    tag: "Pattern",
  },
  "OPP-2750": {
    id: "OPP-2750",
    agency: "DHS",
    title: "TSA Identity Services BPA",
    ceiling: "$17M",
    decision: "Q3 FY26",
    conf: 0.71,
    confRange: [0.62, 0.81],
    seriesLabel: "TSA biometrics · quarterly obligations ($M)",
    series: [42, 48, 55, 51, 60, 72, 80, 88, 95, 102, 110, 118],
    annotation: { idx: 4, label: "Set-aside threshold raised" },
    note: "Set-aside threshold puts you inside the eligible bracket for the first time. Two BPAs in this family expire within 90 days of decision date.",
    analyst: "K.L.",
    tag: "Rule",
  },
  "OPP-3104": {
    id: "OPP-3104",
    agency: "VA",
    title: "Health Records continuity",
    ceiling: "$38M",
    decision: "Q3 FY26",
    conf: 0.68,
    confRange: [0.58, 0.79],
    seriesLabel: "VA health IT · quarterly obligations ($M)",
    series: [110, 118, 124, 132, 138, 145, 150, 162, 175, 180, 190, 198],
    annotation: { idx: 9, label: "Continuity language in RFI" },
    note: "Slow-moving but durable. Continuity language in February's RFI signals VA prefers a follow-on over open recompete — favors firms with prior VA presence.",
    analyst: "M.R.",
    tag: "Judgment",
  },
  "OPP-1882": {
    id: "OPP-1882",
    agency: "DoD",
    title: "DISA Network Modernization",
    ceiling: "$142M",
    decision: "Q4 FY26",
    conf: 0.62,
    confRange: [0.52, 0.74],
    seriesLabel: "DISA network ops · quarterly obligations ($M)",
    series: [380, 402, 418, 430, 445, 460, 478, 495, 512, 528, 544, 561],
    annotation: { idx: 6, label: "DISA consolidation announced" },
    note: "Large ceiling, long horizon. Consolidation memo issued in March re-shapes the prime/sub structure — firms with existing DISA past performance are positioned, but the recompete favors a teamed bid.",
    analyst: "K.L.",
    tag: "Pattern",
  },
  "OPP-4001": {
    id: "OPP-4001",
    agency: "GSA",
    title: "Schedule 70 refresh",
    ceiling: "$9M",
    decision: "Q4 FY26",
    conf: 0.55,
    confRange: [0.46, 0.66],
    seriesLabel: "GSA Schedule 70 · quarterly obligations ($M)",
    series: [220, 224, 228, 230, 235, 238, 242, 245, 250, 254, 258, 260],
    annotation: { idx: 7, label: "Category renewed · 5yr" },
    note: "Steady-state vehicle, modest ceiling. Category was renewed for a five-year term in February — opens a predictable on-ramp for firms not currently on Schedule 70.",
    analyst: "M.R.",
    tag: "Rule",
  },
  "OPP-3812": {
    id: "OPP-3812",
    agency: "DOE",
    title: "Grid Modernization vehicle",
    ceiling: "$52M",
    decision: "Q4 FY26",
    conf: 0.61,
    confRange: [0.50, 0.72],
    seriesLabel: "DOE grid programs · quarterly obligations ($M)",
    series: [65, 72, 80, 92, 138, 162, 178, 195, 208, 220, 232, 240],
    annotation: { idx: 4, label: "IIJA funds released" },
    note: "IIJA appropriations flowed in Q1 FY24 and changed the trajectory of this line. Firms with utility-grid integration experience are the natural read; expect a Q3 RFI.",
    analyst: "M.R.",
    tag: "Judgment",
  },
};

export function Example() {
  const w = useSharedWeights();
  const total = w.rules + w.patterns + w.judgment || 1;
  const n = { rules: w.rules / total, patterns: w.patterns / total, judgment: w.judgment / total };

  const top3: Brief[] = useMemo(() => {
    return [...watchOpps]
      .map((o) => ({
        id: o.id,
        s: o.r * n.rules + o.p * n.patterns + o.j * n.judgment,
      }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map((o, i) => {
        const data = briefsById[o.id];
        return { ...data, rank: i + 1, composite: o.s };
      });
  }, [n.rules, n.patterns, n.judgment]);

  const compositeLow = Math.min(...top3.map((b) => b.composite));
  const compositeHigh = Math.max(...top3.map((b) => b.composite));
  const confLow = Math.min(...top3.map((b) => b.conf));
  const confHigh = Math.max(...top3.map((b) => b.conf));

  return (
    <section
      id="example"
      aria-labelledby="example-title"
      className="relative py-28 md:py-36"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="px-6 md:px-12 lg:px-20">
        <SectionHeader
          id="example-title"
          num="03"
          kicker="This week's brief"
          title="Three opportunities. Why each survived."
          lede={
            <>
              From <span className="nums">47</span> on the watchlist, three earned a place in this
              week's brief — each with the chart that explains it and the analyst who signed it.
              Move the weights in <a href="#different" className="underline underline-offset-2 hover:text-stone-100">§02</a>; the brief follows.
            </>
          }
          wide
        />
      </div>

      <Reveal delay={0.1}>
        <div
          className="relative mx-3 md:mx-6 lg:mx-10 p-8 md:p-12 rounded-sm"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 60px 120px -50px rgba(0,0,0,0.7)",
          }}
        >
          {/* Brief masthead */}
          <div className="flex items-baseline justify-between mb-10 pb-6 border-b border-stone-50/10 gap-6 flex-wrap">
            <div>
              <div className={eyebrow + " mb-2"}>Orla Strategy Brief · Issue No. 17</div>
              <h3 className="serif text-stone-50" style={{ fontSize: "1.75rem", fontWeight: 500 }}>
                This week's three
              </h3>
            </div>
            <div className="text-right">
              <div className={eyebrow + " mb-1"}>Composite range</div>
              <div className="nums text-[12px]">
                {compositeLow.toFixed(2)} — {compositeHigh.toFixed(2)} · conf. {confLow.toFixed(2)} — {confHigh.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Featured (rank 1) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={top3[0].id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <BriefEntry b={top3[0]} featured />
            </motion.div>
          </AnimatePresence>

          <div className="my-10 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

          {/* Two compact below */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={top3[1].id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <BriefEntry b={top3[1]} />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={top3[2].id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <BriefEntry b={top3[2]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Connective lead-in to §04 Methodology */}
          <div className="mt-12 pt-6 border-t border-stone-50/10 flex items-baseline justify-between gap-4 flex-wrap">
            <p className="text-stone-400 text-[12.5px] leading-relaxed max-w-2xl">
              Every figure above resolves to a named source, with the refresh cadence stated and
              the analyst — when one was involved — signed.
            </p>
            <a
              href="#methodology"
              className="nums text-[12px] text-stone-300 hover:text-stone-50 transition whitespace-nowrap"
            >
              How we know →
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function BriefEntry({ b, featured = false }: { b: Brief; featured?: boolean }) {
  const tagColor =
    b.tag === "Rule" ? "#7DD3FC" : b.tag === "Pattern" ? "#60A5FA" : "#FFDB51";
  return (
    <div className={featured ? "grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14" : ""}>
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-3">
            <div className="nums text-[12px] text-stone-500">#{b.rank}</div>
            <div className="nums text-[11px] text-stone-400">
              {b.agency} · {b.id}
            </div>
          </div>
          <div
            className="smallcaps text-[10px] tracking-[0.22em]"
            style={{ color: tagColor }}
          >
            {b.tag}
          </div>
        </div>
        <h4
          className="serif text-stone-50 mb-4"
          style={{
            fontSize: featured ? "1.5rem" : "1.125rem",
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          {b.title}
        </h4>
        <div className="grid grid-cols-3 gap-4 mb-5 pb-5 border-b border-stone-50/10">
          <Stat label="Ceiling" v={b.ceiling} />
          <Stat label="Decision" v={b.decision} />
          <Stat label="Composite" v={b.composite.toFixed(2)} highlight />
        </div>
        <p
          className="text-stone-200 leading-relaxed mb-5"
          style={{ fontSize: featured ? "1rem" : "0.9375rem" }}
        >
          {b.note}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <ConfidenceBar conf={b.conf} range={b.confRange} />
          <div className="nums text-[11px] text-stone-400">— {b.analyst}</div>
        </div>
      </div>

      <div className={featured ? "" : "mt-6"}>
        <div className={eyebrow + " mb-3"}>{b.seriesLabel}</div>
        <Sparkline series={b.series} annotation={b.annotation} tall={featured} />
      </div>
    </div>
  );
}

function Stat({
  label,
  v,
  highlight = false,
}: {
  label: string;
  v: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 smallcaps mb-1">
        {label}
      </div>
      <div className="nums text-[14px]" style={highlight ? { color: "#FFDB51" } : undefined}>
        {v}
      </div>
    </div>
  );
}

function ConfidenceBar({
  conf,
  range,
}: {
  conf: number;
  range: [number, number];
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="smallcaps text-[10px] tracking-[0.22em] text-stone-400">Confidence</div>
      <div className="relative w-32 h-3">
        <div
          className="absolute inset-y-1 inset-x-0 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div
          className="absolute inset-y-1 rounded-full"
          style={{
            left: `${range[0] * 100}%`,
            right: `${(1 - range[1]) * 100}%`,
            background: "rgba(125,211,252,0.3)",
          }}
        />
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{ left: `${conf * 100}%`, background: "#7DD3FC" }}
        />
      </div>
      <div className="nums text-[12px] text-stone-100">{conf.toFixed(2)}</div>
    </div>
  );
}

function Sparkline({
  series,
  annotation,
  tall = false,
}: {
  series: number[];
  annotation: { idx: number; label: string };
  tall?: boolean;
}) {
  const w = 480;
  const h = tall ? 200 : 120;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const pad = 14;
  const xStep = (w - pad * 2) / (series.length - 1);
  const yScale = (v: number) =>
    h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
  const path = series
    .map((v, i) => `${i === 0 ? "M" : "L"} ${pad + i * xStep} ${yScale(v)}`)
    .join(" ");
  const area =
    path +
    ` L ${pad + (series.length - 1) * xStep} ${h - pad} L ${pad} ${h - pad} Z`;
  const ann = {
    x: pad + annotation.idx * xStep,
    y: yScale(series[annotation.idx]),
  };
  const last = series[series.length - 1];
  const gradId = `sparkfill-${annotation.idx}-${last}`;

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.018)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto block">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((p) => (
          <line
            key={p}
            x1={pad}
            x2={w - pad}
            y1={pad + p * (h - pad * 2)}
            y2={pad + p * (h - pad * 2)}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="2 4"
          />
        ))}
        <motion.path
          d={area}
          fill={`url(#${gradId})`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
        />
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <line
            x1={ann.x}
            x2={ann.x}
            y1={pad}
            y2={h - pad}
            stroke="#FFDB51"
            strokeOpacity="0.35"
            strokeDasharray="2 3"
          />
          <circle cx={ann.x} cy={ann.y} r="8" fill="#FFDB51" fillOpacity="0.18" />
          <circle cx={ann.x} cy={ann.y} r="3.5" fill="#FFDB51" />
          <text
            x={ann.x + (annotation.idx > series.length / 2 ? -8 : 12)}
            y={pad + 14}
            fill="#FAFAF9"
            fontSize="10"
            fontFamily="IBM Plex Sans, sans-serif"
            textAnchor={annotation.idx > series.length / 2 ? "end" : "start"}
          >
            {annotation.label}
          </text>
        </motion.g>
        <text
          x={w - pad}
          y={yScale(last) - 8}
          fill="#7DD3FC"
          fontSize="11"
          fontFamily="IBM Plex Sans, sans-serif"
          textAnchor="end"
        >
          ${last}M
        </text>
        <text
          x={pad}
          y={h - 4}
          fill="rgba(255,255,255,0.3)"
          fontSize="9"
          fontFamily="IBM Plex Sans, sans-serif"
        >
          Q1 FY23
        </text>
        <text
          x={w - pad}
          y={h - 4}
          fill="rgba(255,255,255,0.3)"
          fontSize="9"
          fontFamily="IBM Plex Sans, sans-serif"
          textAnchor="end"
        >
          Q4 FY25
        </text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   § 04  Pricing — prospectus table, not three cards
   ───────────────────────────────────────────── */
export function Pricing() {
  const tiers = [
    { name: "Starter", price: "$X", featured: false },
    { name: "Professional", price: "$X", featured: true },
    { name: "Team", price: "$X", featured: false },
  ];
  const rows: { k: string; v: [string, string, string] }[] = [
    { k: "Analytical depth", v: ["Template narrative", "Prepared-analyst narrative", "Prepared-analyst narrative"] },
    { k: "Factors surfaced", v: ["12", "48", "96"] },
    { k: "Seats included", v: ["1", "1", "3–10"] },
    { k: "Brief cadence", v: ["Weekly", "Weekly + ad-hoc", "Weekly + ad-hoc"] },
    { k: "Shared firm profile", v: ["—", "—", "Included"] },
    { k: "Export history", v: ["Included", "Included", "Included"] },
  ];

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className={"relative " + sectionPad}
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <SectionHeader
        id="pricing-title"
        num="05"
        kicker="Pricing"
        title="Three tiers, distinguished by analytical depth."
        lede="Not by feature checklists. Professional is the product; Starter is a lighter voice; Team extends it to a shared firm profile."
        wide
      />

      <Reveal>
        <div className="rounded-sm overflow-hidden" style={panel}>
          {/* Header row: tier names + prices */}
          <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] border-b border-stone-50/10">
            <div className={"p-6 md:p-8 " + eyebrow}>Tier</div>
            {tiers.map((t) => (
              <div
                key={t.name}
                className="p-6 md:p-8 relative"
                style={
                  t.featured
                    ? {
                        background: "rgba(255,219,81,0.05)",
                        borderLeft: "1px solid rgba(255,219,81,0.25)",
                        borderRight: "1px solid rgba(255,219,81,0.25)",
                      }
                    : undefined
                }
              >
                {t.featured && (
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "#FFDB51" }}
                  />
                )}
                <div className="flex items-baseline justify-between mb-2">
                  <div
                    className="text-stone-50"
                    style={{ fontSize: "1.125rem", fontWeight: 500 }}
                  >
                    {t.name}
                  </div>
                  {t.featured && (
                    <div
                      className="text-[10px] tracking-[0.2em] uppercase mono"
                      style={{ color: "#FFDB51" }}
                    >
                      Most chosen
                    </div>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="nums-lg text-stone-50"
                    style={{ fontSize: "1.875rem", fontWeight: 500 }}
                  >
                    {t.price}
                  </span>
                  <span className="text-stone-400 text-[13px]">/ month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dimension rows */}
          {rows.map((row, i) => (
            <div
              key={row.k}
              className="grid grid-cols-[1.3fr_1fr_1fr_1fr]"
              style={{
                borderBottom: i === rows.length - 1 ? undefined : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="p-5 md:p-6">
                <div className="text-[12px] tracking-[0.12em] uppercase text-stone-500">
                  {row.k}
                </div>
              </div>
              {row.v.map((cell, idx) => (
                <div
                  key={idx}
                  className="p-5 md:p-6"
                  style={
                    tiers[idx].featured
                      ? {
                          background: "rgba(255,219,81,0.05)",
                          borderLeft: "1px solid rgba(255,219,81,0.15)",
                          borderRight: "1px solid rgba(255,219,81,0.15)",
                        }
                      : undefined
                  }
                >
                  <div className="text-[14px] text-stone-100">
                    {/^[\d.\-–—+]+$/.test(cell) ? (
                      <span className="nums">{cell}</span>
                    ) : (
                      cell
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Footer CTA row */}
          <div
            className="grid grid-cols-[1.3fr_1fr_1fr_1fr] border-t border-stone-50/10"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="p-5 md:p-6 text-[12px] tracking-[0.12em] uppercase text-stone-500">
              To begin
            </div>
            {tiers.map((t) => (
              <div
                key={t.name}
                className="p-5 md:p-6"
                style={
                  t.featured
                    ? {
                        background: "rgba(255,219,81,0.06)",
                        borderLeft: "1px solid rgba(255,219,81,0.2)",
                        borderRight: "1px solid rgba(255,219,81,0.2)",
                      }
                    : undefined
                }
              >
                <a
                  href="#"
                  className="inline-block text-center px-4 py-2.5 rounded-sm transition text-[13px]"
                  style={
                    t.featured
                      ? { background: "#FFDB51", color: "#141827", fontWeight: 500 }
                      : {
                          border: "1px solid rgba(250,250,249,0.2)",
                          color: "#FAFAF9",
                        }
                  }
                >
                  {t.name === "Team" ? "Talk to us" : "Start trial"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────────
   § 05  Who it's for
   ───────────────────────────────────────────── */
export function Personas() {
  const people = [
    {
      who: "The solo founder.",
      stat: "1 person",
      body:
        "You run a small GovCon firm and do BD yourself between delivery and payroll. You need a weekly brief that tells you where to spend your four available hours — not a platform to configure.",
    },
    {
      who: "The part-time BD lead.",
      stat: "~10 hrs / week",
      body:
        "You split your week between capture and other duties. Orla replaces the analysis portion entirely — leaving you the meetings, the relationships, and the proposal work that actually needs a human.",
    },
    {
      who: "The full-time BD professional.",
      stat: "40 hrs / week",
      body:
        "You lead pipeline at a mid-size firm. Orla is the research layer beneath your workflow — the thing that tells you which of your 60 tracked opportunities deserve the next 10 hours of your attention.",
    },
    {
      who: "The coordinated BD team.",
      stat: "3–10 people",
      body:
        "Your firm runs a BD group across multiple capture leads. The Team tier gives you a shared firm profile, consistent factor weighting across seats, and one canonical brief per cycle.",
    },
  ];
  return (
    <section id="who" aria-labelledby="who-title" className={"relative " + sectionPad} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <SectionHeader
        id="who-title"
        num="06"
        kicker="Who it's for"
        title="Built for four kinds of federal BD operator."
      />
      <div className="grid md:grid-cols-2 gap-5">
        {people.map((p, i) => (
          <Reveal key={p.who} delay={i * 0.08}>
            <div className="p-8 md:p-12 h-full rounded-sm panel-hover" style={panel}>
              <div className="flex items-baseline justify-between mb-5">
                <h3
                  className="serif text-stone-50"
                  style={{ fontSize: "1.25rem", fontWeight: 500 }}
                >
                  {p.who}
                </h3>
                <div className="nums text-[12px] text-stone-400">{p.stat}</div>
              </div>
              <p
                className="text-stone-300 leading-relaxed"
                style={{ fontSize: "0.9375rem" }}
              >
                {p.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   § 06  Privacy & trust — tighter, inline layout
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
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
        <Reveal>
          <div className="flex items-center gap-4 mb-6">
            <div className="nums text-[12px] text-stone-500">§&nbsp;07</div>
            <div className="h-px flex-1 max-w-20" style={{ background: "rgba(255,255,255,0.12)" }} />
            <div className={eyebrow}>Privacy & trust</div>
          </div>
          <h2 id="trust-title" className="serif text-stone-50 mb-5" style={{ ...h2Style, fontSize: "clamp(1.5rem, 2.6vw, 2rem)" }}>
            Stated plainly, because fine print is how firms get burned.
          </h2>
          <p className="text-stone-400 leading-relaxed" style={{ fontSize: "0.9375rem" }}>
            These are not footer links; they are the deal.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <dl className="divide-y divide-stone-50/10">
            {items.map(([k, v], i) => (
              <div key={k} className="grid grid-cols-[auto_1fr] gap-8 py-5 first:pt-0 items-baseline">
                <dt className="nums text-[11px] text-stone-500 w-8">0{i + 1}</dt>
                <dd>
                  <div className="text-stone-50 mb-1" style={{ fontSize: "0.9375rem", fontWeight: 500 }}>
                    {k}
                  </div>
                  <div className="text-stone-400 leading-relaxed" style={{ fontSize: "0.9375rem" }}>
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
      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div
          className="text-stone-50 tracking-[-0.01em]"
          style={{ fontSize: "1.25rem", fontWeight: 600 }}
        >
          Orla
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-stone-400">
          <a href="#" className="hover:text-stone-100 transition">Privacy</a>
          <a href="#" className="hover:text-stone-100 transition">Terms</a>
          <a href="#" className="hover:text-stone-100 transition">Security</a>
          <a href="#" className="hover:text-stone-100 transition">Contact</a>
        </div>
        <div className="nums text-[12px] text-stone-500">© 2026 Orla Intelligence</div>
      </div>
    </footer>
  );
}
