import { Reveal } from "./reveal";
import { motion } from "motion/react";
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
      <div className="space-y-0">
        {pains.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.08}>
            <div 
              className="flex gap-8 md:gap-12 py-12 md:py-16"
              style={{ borderTop: i > 0 ? "1px solid var(--border-subtle)" : undefined }}
            >
              <div className="nums text-[14px] text-quaternary w-8 flex-shrink-0 pt-1">{p.n}</div>
              <div className="flex-1">
                <h3
                  className="serif text-primary mb-4"
                  style={{ fontSize: "1.5rem", fontWeight: 500, lineHeight: 1.3 }}
                >
                  {p.t}
                </h3>
                <p className="text-secondary leading-relaxed max-w-3xl mb-4" style={{ fontSize: "1.0625rem" }}>
                  {p.b}
                </p>
                {p.n === "03" && (
                  <motion.div
                    className="my-6 max-w-3xl"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from({ length: 60 }).map((_, j) => (
                        <span
                          key={j}
                          className="w-1 h-1 rounded-full"
                          style={{ background: "var(--text-quaternary)", opacity: 0.5 }}
                        />
                      ))}
                    </div>
                    <p className="text-[12px] text-quaternary italic mt-3">
                      4,217 opportunities. None ranked.
                    </p>
                  </motion.div>
                )}
                <div className="nums text-[14px] text-primary">{p.stat}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   § 02  How Orla thinks
   ───────────────────────────────────────────── */
export function HowOrlaThinks() {
  const signals = [
    {
      name: "Rules",
      color: "var(--signal-rules)",
      body: "Stated as fact. Set-asides, ceilings, mandatory qualifications, certifications you hold. The unambiguous filter.",
      weight: 40,
    },
    {
      name: "Patterns",
      color: "var(--signal-patterns)",
      body: "Informed assessment. Award cadence shifts. Recompete windows narrowing. Procurement velocity changes that haven't yet shown up in narrative coverage.",
      weight: 35,
    },
    {
      name: "Judgment",
      color: "var(--signal-judgment)",
      body: "Named analyst calls. When a senior federal analyst reads the room and signs their name to a confidence figure, that goes into the composite too.",
      weight: 25,
    },
  ];

  return (
    <section
      id="how-orla-thinks"
      className={"relative " + sectionPad}
      aria-labelledby="how-orla-thinks-title"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <SectionHeader
        id="how-orla-thinks-title"
        num="02"
        kicker="How Orla thinks"
        title="Three signals. One score. The math is named."
        lede={
          <>
            Every Friday, Orla narrows the federal landscape to a handful of opportunities worth your week. Three independent signals —{" "}
            <span className="text-primary">Rules</span>,{" "}
            <span className="text-primary">Patterns</span>, and{" "}
            <span className="text-primary">Judgment</span> — combine into one composite score. Each is named, weighted, and traceable.
          </>
        }
        wide
      />

      <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16">
        {/* Left column — Signal articulations */}
        <Reveal>
          <div className="space-y-8">
            {signals.map((s) => (
              <div key={s.name}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: s.color }}
                  />
                  <h3
                    className="serif text-primary"
                    style={{ fontSize: "1.25rem", fontWeight: 500 }}
                  >
                    {s.name}
                  </h3>
                </div>
                <p
                  className="text-secondary leading-relaxed max-w-md pl-5"
                  style={{ fontSize: "0.9375rem" }}
                >
                  {s.body}
                </p>
              </div>
            ))}
            <motion.p
              className="text-tertiary italic leading-relaxed max-w-md pl-4 mt-8"
              style={{
                fontSize: "0.9375rem",
                borderLeft: "2px solid var(--border-default)",
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              On Tuesdays we re-run Patterns against the new SAM postings; on Wednesdays we walk Rules against the week&apos;s set-aside changes; on Thursdays we sit with Judgment one more time before Friday&apos;s brief goes out. The composite is the analyst&apos;s working answer, not the system&apos;s.
            </motion.p>
          </div>
        </Reveal>

        {/* Right column — Factor weights visualization */}
        <Reveal delay={0.15}>
          <div className="rounded-sm p-8" style={panel}>
            <div className={eyebrow + " mb-6"}>Factor weights</div>
            <div className="space-y-6">
              {signals.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.2,
                    ease: [0.2, 0.7, 0.2, 1],
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: s.color }}
                      />
                      <span
                        className="text-primary"
                        style={{ fontSize: "0.9375rem", fontWeight: 500 }}
                      >
                        {s.name}
                      </span>
                    </div>
                    <span className="nums text-primary" style={{ fontSize: "0.9375rem" }}>
                      {s.weight}%
                    </span>
                  </div>
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: "var(--border-default)", opacity: 0.65 }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: s.color, opacity: 0.75 }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.weight}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.2 + 0.3,
                        ease: [0.2, 0.7, 0.2, 1],
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="mt-6 pt-5"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <span className="nums text-[11px] text-quaternary">
                Composite = Σ (signal × weight)
              </span>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   § 03  What an Orla insight looks like
   ───────────────────────────────────────────── */
export function ExampleInsight() {
  const series = [180, 198, 212, 240, 260, 268, 290, 320, 365, 388, 412, 410];
  const annotationIdx = 7;

  return (
    <section
      id="example-insight"
      className={"relative " + sectionPad}
      aria-labelledby="example-insight-title"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <SectionHeader
        id="example-insight-title"
        num="03"
        kicker="This week's signal"
        title="What an Orla insight looks like."
        lede={
          <>
            One signal from this week&apos;s brief, prepared as the analyst wrote it. Every figure resolves to a named source. Every interpretation carries an analyst&apos;s initials and a confidence figure.
          </>
        }
        wide
      />

      <Reveal delay={0.1}>
        <div
          className="rounded-sm p-8 md:p-12"
          style={{
            background: "linear-gradient(180deg, var(--panel-from), var(--panel-to))",
            border: "1px solid var(--panel-border)",
          }}
        >
          {/* Top row */}
          <div className="flex items-baseline justify-between mb-4">
            <div className="nums text-[11px] text-tertiary">DHS · OPP-2418</div>
            <div
              className="smallcaps text-[10px] tracking-[0.22em]"
              style={{ color: "var(--signal-patterns)" }}
            >
              Pattern
            </div>
          </div>

          {/* Title */}
          <h3
            className="serif text-primary mb-6"
            style={{ fontSize: "1.5rem", fontWeight: 500, lineHeight: 1.3 }}
          >
            Cyber Mission Management — recompete
          </h3>

          {/* Analyst conclusion */}
          <p
            className="text-secondary leading-relaxed mb-8 max-w-2xl"
            style={{ fontSize: "1rem" }}
          >
            DHS cyber procurement has accelerated three cycles running. The incumbent&apos;s option year is unlikely to be exercised given the Q4→Q2 shift.
          </p>

          {/* Chart */}
          <div className="mb-6">
            <div className={eyebrow + " mb-4"}>DHS Cyber line · Quarterly obligations ($M)</div>
            <InsightSparkline series={series} annotationIdx={annotationIdx} />
          </div>

          {/* Confidence and attribution */}
          <div className="flex items-center justify-between flex-wrap gap-4 mt-6">
            <ConfidenceBar conf={0.82} range={[0.74, 0.88]} />
            <div className="nums text-[11px] text-tertiary">— M.R.</div>
          </div>

          {/* Footer */}
          <div
            className="mt-6 pt-6 flex items-baseline justify-between flex-wrap gap-4"
            style={{ borderTop: "1px solid var(--border-default)" }}
          >
            <p className="text-tertiary text-[12.5px] leading-relaxed">
              One of three in this week&apos;s brief.
            </p>
            <a
              href="#"
              className="nums text-[12px] text-secondary hover:text-primary transition"
            >
              See the full brief →
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function InsightSparkline({
  series,
  annotationIdx,
}: {
  series: number[];
  annotationIdx: number;
}) {
  const w = 480;
  const h = 140;
  const pad = 24;

  const min = Math.min(...series) * 0.9;
  const max = Math.max(...series) * 1.05;
  const yScale = (v: number) => pad + ((max - v) / (max - min)) * (h - pad * 2);
  const xScale = (i: number) => pad + (i / (series.length - 1)) * (w - pad * 2);

  const pathD = series
    .map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${xScale(series.length - 1)} ${h - pad} L ${xScale(0)} ${h - pad} Z`;

  const last = series[series.length - 1];
  const annX = xScale(annotationIdx);
  const annY = yScale(series[annotationIdx]);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxWidth: 480 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--signal-patterns)" stopOpacity={0.28} />
          <stop offset="100%" stopColor="var(--signal-patterns)" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Gridlines */}
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1={pad}
          x2={w - pad}
          y1={pad + p * (h - pad * 2)}
          y2={pad + p * (h - pad * 2)}
          stroke="var(--border-subtle)"
          strokeDasharray="2 4"
        />
      ))}

      {/* Area fill */}
      <motion.path
        d={areaD}
        fill="url(#areaGrad)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.4 }}
      />

      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="var(--signal-patterns)"
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
      />

      {/* Annotation pin */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <line
          x1={annX}
          y1={pad}
          x2={annX}
          y2={h - pad}
          stroke="#FFDB51"
          strokeOpacity={0.35}
          strokeDasharray="2 3"
        />
        <circle cx={annX} cy={annY} r={8} fill="#FFDB51" fillOpacity={0.18} />
        <circle cx={annX} cy={annY} r={3.5} fill="#FFDB51" />
        <text
          x={annX - 8}
          y={pad + 14}
          fill="var(--text-primary)"
          fontSize="10"
          fontFamily="IBM Plex Sans, sans-serif"
          textAnchor="end"
        >
          Award cadence Q4 → Q2
        </text>
      </motion.g>

      {/* Endpoint label */}
      <text
        x={w - pad}
        y={yScale(last) - 8}
        fill="var(--signal-patterns)"
        fontSize="11"
        fontFamily="IBM Plex Sans, sans-serif"
        textAnchor="end"
      >
        ${last}M
      </text>

      {/* X-axis labels */}
      <text
        x={pad}
        y={h - 4}
        fill="var(--text-muted)"
        fontSize="9"
        fontFamily="IBM Plex Sans, sans-serif"
      >
        Q1 FY23
      </text>
      <text
        x={w - pad}
        y={h - 4}
        fill="var(--text-muted)"
        fontSize="9"
        fontFamily="IBM Plex Sans, sans-serif"
        textAnchor="end"
      >
        Q4 FY25
      </text>
    </svg>
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
      <div className="smallcaps text-[10px] tracking-[0.22em] text-tertiary">Confidence</div>
      <div className="relative w-32 h-3">
        <div
          className="absolute inset-y-1 inset-x-0 rounded-full"
          style={{ background: "var(--border-default)", opacity: 0.15 }}
        />
        <div
          className="absolute inset-y-1 rounded-full"
          style={{
            left: `${range[0] * 100}%`,
            right: `${(1 - range[1]) * 100}%`,
            background: "rgba(125,211,252,0.55)",
          }}
        />
        <div
          className="absolute top-0 bottom-0 w-0.5"
          style={{ left: `${conf * 100}%`, background: "var(--gold-cta)" }}
        />
      </div>
      <div className="nums text-[12px] text-primary">{conf.toFixed(2)}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   § 07  Privacy & trust — tighter, inline layout
   ───────────────────────────────────────────── */
export function Trust() {
  const items = [
    ["Your data is yours.", "We never train models on your firm profile or pipeline data. What you put into Orla stays inside Orla."],
    ["Cancel anytime.", "No annual lock-in. No proration math."],
    ["Sixty days, then gone.", "Full retention for 60 days after cancellation. Then permanently deleted."],
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
