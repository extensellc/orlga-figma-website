import { motion, useAnimationFrame } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./reveal";

/* ─────────────────────────────────────────────
   A looping "brief construction" storyboard.
   Four columns: Question → Control → Chart → Summary.
   Autoplays on load; loops through two BD scenarios.
   ───────────────────────────────────────────── */

type Row = { label: string; before: number; after: number; unit?: string; fmt?: (v: number) => string };
type Delta = { label: string; from: number; to: number; fmt: (v: number) => string; tone: "up" | "down" };

type Scenario = {
  question: string;
  controlLabel: string;
  tabs: string[];
  activeTabIdx: number;
  sliderFrom: number; // 0..1
  sliderTo: number; // 0..1
  sliderValueStart: string;
  sliderValueEnd: string;
  rows: Row[];
  deltas: Delta[];
  ring: { from: number; to: number; label: string };
};

const usd = (v: number) => "$" + (v >= 1_000_000 ? (v / 1_000_000).toFixed(1) + "M" : (v / 1000).toFixed(0) + "K");
const pct = (v: number) => v.toFixed(0) + "%";
const pctPlus = (v: number) => (v >= 0 ? "+" : "") + v.toFixed(0) + "%";
const ppPlus = (v: number) => (v >= 0 ? "+" : "") + v.toFixed(1) + "pp";
const dollarsPlus = (v: number) => (v >= 0 ? "+" : "") + usd(Math.abs(v));
const dayUnit = (v: number) => v.toFixed(0) + " days";

const scenarios: Scenario[] = [
  {
    question: "What if we shifted 30% of capture time from DoD to DHS?",
    controlLabel: "Capture allocation · DHS",
    tabs: ["DoD", "DHS", "VA", "GSA"],
    activeTabIdx: 1,
    sliderFrom: 0.15,
    sliderTo: 0.45,
    sliderValueStart: "15%",
    sliderValueEnd: "45%",
    rows: [
      { label: "Active pursuits", before: 4, after: 11, fmt: (v) => v.toFixed(0) },
      { label: "Shortlist rate", before: 22, after: 31, fmt: pct },
      { label: "Expected wins (4Q)", before: 3, after: 5, fmt: (v) => v.toFixed(0) },
      { label: "Pipeline value", before: 8_400_000, after: 14_200_000, fmt: usd },
      { label: "Win-weighted $", before: 1_850_000, after: 4_400_000, fmt: usd },
    ],
    deltas: [
      { label: "Expected awards", from: 0, to: 62, fmt: pctPlus, tone: "up" },
      { label: "Win rate", from: 0, to: 4.2, fmt: ppPlus, tone: "up" },
      { label: "Pipeline value", from: 0, to: 5_800_000, fmt: dollarsPlus, tone: "up" },
    ],
    ring: { from: 0, to: 0.68, label: "Allocation fit" },
  },
  {
    question: "What if we moved the Q3 DHS recompete up by 60 days?",
    controlLabel: "Capture window start",
    tabs: ["Q1", "Q2", "Q3", "Q4"],
    activeTabIdx: 1,
    sliderFrom: 0.72,
    sliderTo: 0.42,
    sliderValueStart: "JUL 15",
    sliderValueEnd: "MAY 17",
    rows: [
      { label: "Capture readiness", before: 58, after: 94, fmt: pct },
      { label: "Proposal hours", before: 240, after: 144, fmt: (v) => v.toFixed(0) + " hrs" },
      { label: "Competitive exposure", before: 41, after: 22, fmt: pct },
      { label: "Incumbent overlap", before: 67, after: 38, fmt: pct },
      { label: "Lead time", before: 34, after: 94, fmt: dayUnit },
    ],
    deltas: [
      { label: "Readiness", from: 0, to: 36, fmt: pctPlus, tone: "up" },
      { label: "Proposal hours", from: 0, to: -40, fmt: pctPlus, tone: "down" },
      { label: "Confidence", from: 0, to: 0.3, fmt: (v) => (v >= 0 ? "+" : "") + v.toFixed(2), tone: "up" },
    ],
    ring: { from: 0, to: 0.82, label: "Capture readiness" },
  },
  {
    question: "What if we responded to every RFI in our tracked set?",
    controlLabel: "RFI response rate",
    tabs: ["Sources Sought", "RFI", "Draft RFP", "RFP"],
    activeTabIdx: 1,
    sliderFrom: 0.30,
    sliderTo: 1.00,
    sliderValueStart: "30%",
    sliderValueEnd: "100%",
    rows: [
      { label: "RFIs responded", before: 18, after: 62, fmt: (v) => v.toFixed(0) },
      { label: "Shortlist rate", before: 14, after: 27, fmt: pct },
      { label: "Relationship touchpoints", before: 41, after: 118, fmt: (v) => v.toFixed(0) },
      { label: "Proposal hours", before: 180, after: 540, fmt: (v) => v.toFixed(0) + " hrs" },
      { label: "Avg lead time", before: 52, after: 94, fmt: dayUnit },
    ],
    deltas: [
      { label: "Shortlist rate", from: 0, to: 13, fmt: ppPlus, tone: "up" },
      { label: "Pipeline depth", from: 0, to: 6_200_000, fmt: dollarsPlus, tone: "up" },
      { label: "Team load", from: 0, to: 200, fmt: pctPlus, tone: "down" },
    ],
    ring: { from: 0, to: 0.74, label: "Sourcing strength" },
  },
  {
    question:
      "What if we teamed with a large prime on the VA EHR recompete instead of bidding solo?",
    controlLabel: "Revenue share retained",
    tabs: ["Solo", "Prime", "Sub", "JV"],
    activeTabIdx: 2,
    sliderFrom: 1.00,
    sliderTo: 0.35,
    sliderValueStart: "100%",
    sliderValueEnd: "35%",
    rows: [
      { label: "Win probability", before: 18, after: 47, fmt: pct },
      { label: "Expected revenue", before: 4_200_000, after: 6_800_000, fmt: usd },
      { label: "Past-perf fit", before: 62, after: 89, fmt: pct },
      { label: "Gross margin", before: 22, after: 14, fmt: pct },
      { label: "Team capacity load", before: 72, after: 48, fmt: pct },
    ],
    deltas: [
      { label: "Win probability", from: 0, to: 29, fmt: ppPlus, tone: "up" },
      { label: "Expected revenue", from: 0, to: 2_600_000, fmt: dollarsPlus, tone: "up" },
      { label: "Gross margin", from: 0, to: -8, fmt: ppPlus, tone: "down" },
    ],
    ring: { from: 0, to: 0.79, label: "Strategic fit" },
  },
  {
    question: "What if we narrowed DoD capture to SOCOM components only?",
    controlLabel: "Component focus",
    tabs: ["Army", "Navy", "AF", "SOCOM"],
    activeTabIdx: 3,
    sliderFrom: 0.12,
    sliderTo: 0.68,
    sliderValueStart: "12%",
    sliderValueEnd: "68%",
    rows: [
      { label: "Award frequency / yr", before: 4, after: 11, fmt: (v) => v.toFixed(0) },
      { label: "Avg contract value", before: 2_100_000, after: 5_400_000, fmt: usd },
      { label: "Small-biz share", before: 22, after: 41, fmt: pct },
      { label: "Opportunity count", before: 120, after: 38, fmt: (v) => v.toFixed(0) },
      { label: "Cycle time", before: 180, after: 240, fmt: dayUnit },
    ],
    deltas: [
      { label: "Avg contract value", from: 0, to: 3_300_000, fmt: dollarsPlus, tone: "up" },
      { label: "Small-biz share", from: 0, to: 19, fmt: ppPlus, tone: "up" },
      { label: "Opportunity count", from: 0, to: -68, fmt: pctPlus, tone: "down" },
    ],
    ring: { from: 0, to: 0.71, label: "Component fit" },
  },
  {
    question: "What if we no-bid everything below 25% win confidence?",
    controlLabel: "Confidence threshold",
    tabs: ["10%", "20%", "25%", "35%"],
    activeTabIdx: 2,
    sliderFrom: 0.10,
    sliderTo: 0.25,
    sliderValueStart: "10%",
    sliderValueEnd: "25%",
    rows: [
      { label: "Bids submitted", before: 42, after: 18, fmt: (v) => v.toFixed(0) },
      { label: "Expected wins", before: 5.1, after: 5.8, fmt: (v) => v.toFixed(1) },
      { label: "Proposal hours", before: 1680, after: 720, fmt: (v) => v.toFixed(0) + " hrs" },
      { label: "Bid-to-win ratio", before: 8.2, after: 3.1, fmt: (v) => v.toFixed(1) + ":1" },
      { label: "Team load", before: 94, after: 52, fmt: pct },
    ],
    deltas: [
      { label: "Expected wins", from: 0, to: 14, fmt: pctPlus, tone: "up" },
      { label: "Team load", from: 0, to: -45, fmt: pctPlus, tone: "up" },
      { label: "Pipeline volume", from: 0, to: -57, fmt: pctPlus, tone: "down" },
    ],
    ring: { from: 0, to: 0.66, label: "Bid discipline" },
  },
];

const CYCLE_MS = 7200;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function BriefConstruction() {
  const [idx, setIdx] = useState(0);
  const [t, setT] = useState(0); // 0..1 within current cycle
  const startRef = useRef<number | null>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  useAnimationFrame((now) => {
    if (startRef.current == null) startRef.current = now;
    const elapsed = now - startRef.current;
    const cycle = Math.min(1, elapsed / CYCLE_MS);
    setT(cycle);
    if (cycle >= 1) {
      startRef.current = now;
      setIdx((i) => (i + 1) % scenarios.length);
    }
  });

  const s = scenarios[idx];

  // Timeline phases within the cycle:
  // 0.00 – 0.10 : settle / question appears
  // 0.10 – 0.45 : slider/tab action
  // 0.25 – 0.75 : bars animate
  // 0.40 – 0.85 : deltas count + ring fills
  // 0.85 – 1.00 : hold

  const sliderT = clamp01((t - 0.1) / 0.35);
  const barT = clamp01((t - 0.25) / 0.5);
  const summaryT = clamp01((t - 0.4) / 0.45);

  const sliderPos =
    s.sliderFrom + (s.sliderTo - s.sliderFrom) * easeInOut(sliderT);
  const sliderLabel =
    sliderT < 0.5 ? s.sliderValueStart : s.sliderValueEnd;

  return (
    <section
      className="relative px-6 md:px-12 lg:px-20 pb-24 md:pb-32"
      style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "5rem" }}
    >
      <Reveal>
        <div className="flex items-center gap-4 mb-10">
          <div className="nums text-[12px] text-quaternary">§&nbsp;00</div>
          <div className="h-px flex-1 max-w-20" style={{ background: "var(--border-strong)" }} />
          <div className="text-[11px] tracking-[0.24em] uppercase text-tertiary smallcaps">
            See Orla think
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          className="rounded-sm p-6 md:p-10"
          style={{
            background:
              "linear-gradient(180deg, var(--panel-from), var(--panel-to))",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {/* Progress bars */}
          <div className="grid grid-cols-4 gap-5 md:gap-7 mb-8">
            {[0, 1, 2, 3].map((col) => (
              <ProgressBar key={col} col={col} t={t} idx={idx} />
            ))}
          </div>

          {/* Four columns */}
          <div className="grid md:grid-cols-4 gap-5 md:gap-7">
            {/* Col 1 — Question */}
            <motion.div
              key={`q-${idx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-[280px]"
            >
              <div className="text-[10px] tracking-[0.24em] uppercase text-quaternary smallcaps mb-4">
                Question
              </div>
              <p
                className="text-primary leading-[1.35]"
                style={{ fontSize: "1rem" }}
              >
                {s.question}
              </p>
            </motion.div>

            {/* Col 2 — Control */}
            <div
              className="rounded-sm p-5 min-h-[280px] flex flex-col"
              style={{
                background: "var(--panel-row-hover)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="h-1.5 w-1.5 rounded-[1px]" style={{ background: "var(--gold-cta)" }} />
                <div className="text-[11px] text-secondary">Agency</div>
              </div>
              <div className="flex gap-0 rounded-[2px] overflow-hidden mb-6" style={{ background: "var(--panel-row-hover)" }}>
                {s.tabs.map((tab, i) => (
                  <div
                    key={tab}
                    className="flex-1 py-1.5 text-center text-[10px] transition"
                    style={{
                      background:
                        i === s.activeTabIdx && sliderT > 0.3
                          ? "rgba(96,165,250,0.15)"
                          : "transparent",
                      color:
                        i === s.activeTabIdx && sliderT > 0.3
                          ? "#93C5FD"
                          : "var(--text-quaternary)",
                      borderRight:
                        i < s.tabs.length - 1 ? "1px solid var(--border-subtle)" : undefined,
                    }}
                  >
                    {tab}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="h-1.5 w-1.5 rounded-[1px]" style={{ background: "#93C5FD" }} />
                <div className="text-[11px] text-secondary">{s.controlLabel}</div>
              </div>
              <div className="relative mt-2 mb-1">
                <div className="h-[2px] w-full rounded-full" style={{ background: "var(--border-default)" }} />
                <div
                  className="absolute top-0 left-0 h-[2px] rounded-full"
                  style={{
                    width: `${sliderPos * 100}%`,
                    background: "var(--signal-patterns)",
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                  style={{
                    left: `calc(${sliderPos * 100}% - 6px)`,
                    background: "var(--text-primary)",
                    boxShadow: "0 0 0 3px rgba(96,165,250,0.25)",
                  }}
                />
                <div
                  className="absolute -bottom-7 mono text-[10px] text-secondary px-1.5 py-0.5 rounded-sm"
                  style={{
                    left: `calc(${sliderPos * 100}% - 14px)`,
                    background: "var(--panel-row-hover)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  {sliderLabel}
                </div>
              </div>

              <div className="mt-auto pt-10 flex items-baseline justify-between">
                <div className="text-[10px] tracking-[0.2em] uppercase text-quaternary">Scope</div>
                <div className="nums text-[11px] text-secondary">FY26 · Q2–Q3</div>
              </div>
            </div>

            {/* Col 3 — Chart */}
            <div className="min-h-[280px]">
              <div className="text-[10px] tracking-[0.24em] uppercase text-quaternary smallcaps mb-4">
                Response
              </div>
              <div className="space-y-3.5">
                {s.rows.map((row, i) => (
                  <BarRow key={`${idx}-${row.label}-${i}`} row={row} progress={barT} delay={i * 0.06} />
                ))}
              </div>
            </div>

            {/* Col 4 — Summary */}
            <div className="min-h-[280px] flex flex-col">
              <div className="text-[10px] tracking-[0.24em] uppercase text-quaternary smallcaps mb-4">
                Summary
              </div>
              <div className="space-y-4">
                {s.deltas.map((d) => (
                  <DeltaRow
                    key={`${idx}-${d.label}`}
                    label={d.label}
                    value={d.from + (d.to - d.from) * easeInOut(summaryT)}
                    fmt={d.fmt}
                    tone={d.tone}
                  />
                ))}
              </div>
              <div className="mt-auto pt-6 flex items-center gap-5">
                <Ring
                  progress={s.ring.from + (s.ring.to - s.ring.from) * easeInOut(summaryT)}
                />
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-quaternary mb-1">
                    {s.ring.label}
                  </div>
                  <div className="nums text-[15px] text-primary">
                    {Math.round(
                      (s.ring.from + (s.ring.to - s.ring.from) * easeInOut(summaryT)) * 100
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario ticker */}
          <div className="mt-10 pt-6 flex items-center justify-between" style={{ borderTop: "1px solid var(--border-default)" }}>
            <div className="flex items-center gap-3">
              {scenarios.map((_, i) => (
                <div
                  key={i}
                  className="h-[2px] w-8 rounded-full transition-colors"
                  style={{
                    background:
                      i === idx ? "var(--signal-patterns)" : "var(--border-strong)",
                  }}
                />
              ))}
              <span className="nums text-[11px] text-quaternary ml-2">
                Scenario {idx + 1} of {scenarios.length}
              </span>
            </div>
            <span className="text-[11px] text-quaternary smallcaps tracking-[0.2em] uppercase">
              Autoplay · Live
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function ProgressBar({ col, t, idx }: { col: number; t: number; idx: number }) {
  // Each column "starts" at a staggered phase
  const starts = [0, 0.1, 0.25, 0.4];
  const ends = [0.2, 0.45, 0.75, 0.85];
  const local = clamp01((t - starts[col]) / (ends[col] - starts[col]));
  return (
    <div className="h-[2px] w-full rounded-full overflow-hidden" style={{ background: "var(--border-subtle)" }}>
      <div
        key={`${idx}-${col}`}
        className="h-full"
        style={{
          width: `${local * 100}%`,
          background: "var(--signal-patterns)",
          transition: "width 120ms linear",
        }}
      />
    </div>
  );
}

function BarRow({ row, progress, delay }: { row: Row; progress: number; delay: number }) {
  const local = clamp01((progress - delay) / (1 - delay || 1));
  const eased = easeInOut(local);
  const value = row.before + (row.after - row.before) * eased;
  // Bar width scales vs max observed after value
  const baseline = row.before;
  const target = row.after;
  const widthPct = Math.min(100, (value / (target * 1.1)) * 100);
  const baselinePct = Math.min(100, (baseline / (target * 1.1)) * 100);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="text-[11px] text-secondary">{row.label}</div>
        <div className="nums text-[11px]">
          {row.fmt ? row.fmt(value) : value.toFixed(0)}
        </div>
      </div>
      <div
        className="relative h-[4px] w-full rounded-full overflow-hidden"
        style={{ background: "var(--border-subtle)" }}
      >
        {/* baseline */}
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            width: `${baselinePct}%`,
            background: "var(--border-strong)",
          }}
        />
        {/* uplift */}
        <div
          className="absolute top-0 h-full"
          style={{
            left: `${baselinePct}%`,
            width: `${Math.max(0, widthPct - baselinePct)}%`,
            background:
              "repeating-linear-gradient(-45deg, var(--signal-patterns) 0 2px, rgba(96,165,250,0.35) 2px 4px)",
          }}
        />
        {/* benchmark tick */}
        <div
          className="absolute top-[-2px] w-[1px] h-[8px]"
          style={{
            left: `${baselinePct}%`,
            background: "var(--text-quaternary)",
          }}
        />
      </div>
    </div>
  );
}

function DeltaRow({
  label,
  value,
  fmt,
  tone,
}: {
  label: string;
  value: number;
  fmt: (v: number) => string;
  tone: "up" | "down";
}) {
  const color =
    tone === "up" ? "#34D399" : "#F87171";
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <span className="text-[13px] text-secondary">{label}</span>
      <span className="nums text-[13px]" style={{ color }}>
        {fmt(value)}
      </span>
    </div>
  );
}

function Ring({ progress }: { progress: number }) {
  const size = 64;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--border-default)"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--signal-patterns)"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        style={{ transition: "stroke-dashoffset 120ms linear" }}
      />
    </svg>
  );
}
