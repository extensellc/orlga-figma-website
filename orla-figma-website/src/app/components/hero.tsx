import { motion } from "motion/react";
import { Fragment, useEffect, useState } from "react";

type Opp = {
  id: string;
  agency: string;
  title: string;
  ceiling: string;
  capture: number;
  fit: number;
  decision: string;
  hot?: boolean;
};

const opps: Opp[] = [
  { id: "OPP-2418", agency: "DHS", title: "Cyber Mission Mgmt — recompete", ceiling: "$24M",  capture: 0.71, fit: 0.84, decision: "Q3 FY26", hot: true },
  { id: "OPP-3104", agency: "VA",  title: "Health Records continuity",      ceiling: "$38M",  capture: 0.58, fit: 0.79, decision: "Q3 FY26", hot: true },
  { id: "OPP-2750", agency: "DHS", title: "TSA Identity Services BPA",      ceiling: "$17M",  capture: 0.62, fit: 0.74, decision: "Q3 FY26", hot: true },
  { id: "OPP-1882", agency: "DoD", title: "DISA Network Modernization",     ceiling: "$142M", capture: 0.34, fit: 0.61, decision: "Q4 FY26" },
  { id: "OPP-4001", agency: "GSA", title: "Schedule 70 refresh",            ceiling: "$9M",   capture: 0.41, fit: 0.55, decision: "Q4 FY26" },
];

const FUNNEL = [
  { label: "Active opportunities", n: "4,217", sub: "across 24 agencies" },
  { label: "NAICS shortlist",      n: "312",   sub: "in your code set" },
  { label: "Composite watchlist",  n: "47",    sub: "score ≥ 0.60" },
  { label: "This week's brief",    n: "3",     sub: "named recommendations" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen px-6 md:px-12 lg:px-20 pt-8 pb-20 overflow-hidden">
      <OpportunityField />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 22% 46%, rgba(255,255,255,0.035), rgba(255,255,255,0) 60%)",
        }}
      />

      <nav className="relative flex items-center justify-between mb-24 md:mb-28">
        <div />
        <div className="hidden md:flex items-center gap-9 text-[13px] text-stone-300/80">
          <a href="#different" className="hover:text-stone-100 transition">How it works</a>
          <a href="#example" className="hover:text-stone-100 transition">Example brief</a>
          <a href="#methodology" className="hover:text-stone-100 transition">Methodology</a>
          <a href="#pricing" className="hover:text-stone-100 transition">Pricing</a>
        </div>
        <a
          href="#pricing"
          className="text-[13px] px-4 py-2 rounded-sm border border-stone-50/15 text-stone-100 hover:border-stone-50/40 transition"
        >
          Sign in
        </a>
      </nav>

      <div className="relative grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12" style={{ background: "#FFDB51" }} />
            <div className="text-[11px] tracking-[0.24em] uppercase text-stone-400">
              Federal BD Intelligence
            </div>
          </div>
          <h1
            className="serif text-stone-50 leading-[1.04] tracking-[-0.015em] mb-8"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)", fontWeight: 500 }}
          >
            From <span className="mono" style={{ fontSize: "0.92em" }}>$680B</span> in federal spend,
            <br />
            <span className="text-stone-400">the three things worth your week.</span>
          </h1>
          <p className="text-stone-300 max-w-xl leading-relaxed mb-10" style={{ fontSize: "1.0625rem" }}>
            Orla narrows <span className="mono">4,217</span> active opportunities to a Friday brief —
            ranked, scored, written in plain English. The funnel is the product.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm transition"
              style={{ background: "#FFDB51", color: "#141827", fontWeight: 500 }}
            >
              Start your 14-day trial
            </a>
            <a href="#example" className="text-[14px] text-stone-300 hover:text-stone-100 transition">
              See an example brief →
            </a>
          </div>
          <div className="mt-10 text-[12px] text-stone-400">
            <span className="mono">No credit card.</span> Cancel anytime.{" "}
            <span className="mono">60-day</span> retention after cancel.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="flex items-baseline justify-between mb-4">
            <div className="text-[10px] tracking-[0.28em] uppercase text-stone-500 smallcaps">
              Orla · Live scoring
            </div>
            <div className="mono text-[11px] text-stone-400">FY26 · WK 17</div>
          </div>
          <ScoringPanel opps={opps} />
        </motion.div>
      </div>

      <FunnelStrip />
    </section>
  );
}

function OpportunityField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0",
        maskImage:
          "radial-gradient(ellipse 90% 70% at 65% 48%, black 25%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 70% at 65% 48%, black 25%, transparent 80%)",
      }}
    />
  );
}

function ScoringPanel({ opps }: { opps: Opp[] }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setT((x) => x + 1), 2400);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      className="rounded-sm relative backdrop-blur-sm"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012))",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 60px 120px -50px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.02) inset",
      }}
    >
      <div className="flex items-baseline justify-between px-6 md:px-7 py-5 border-b border-stone-50/10">
        <div className="flex items-center gap-3">
          <span className="relative inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#7DD3FC" }}>
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "#7DD3FC", opacity: 0.5 }} />
          </span>
          <div className="smallcaps text-[10px] tracking-[0.24em] text-stone-300">
            Live · Opportunity scoring
          </div>
        </div>
        <div className="mono text-[10px] text-stone-500">
          Last sync · 14:00 ET · next · {String(47 - (t % 47)).padStart(2, "0")}m
        </div>
      </div>

      <div className="px-6 md:px-7 py-5">
        <div
          className="grid gap-y-3.5 text-[12px]"
          style={{ gridTemplateColumns: "auto 1fr auto auto auto" }}
        >
          <div className="mono text-[9px] uppercase tracking-[0.2em] text-stone-500">ID</div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-stone-500 smallcaps">Opportunity</div>
          <div className="mono text-[9px] uppercase tracking-[0.2em] text-stone-500 text-right">Cap</div>
          <div className="mono text-[9px] uppercase tracking-[0.2em] text-stone-500 text-right pl-3">Fit</div>
          <div className="mono text-[9px] uppercase tracking-[0.2em] text-stone-500 text-right pl-4">Dec.</div>

          {opps.map((o, i) => {
            const jitter = Math.sin(t * 0.7 + i * 1.1) * 0.008;
            const cap = Math.max(0, Math.min(1, o.capture + jitter));
            const fit = Math.max(0, Math.min(1, o.fit - jitter * 0.7));
            return (
              <Fragment key={o.id}>
                <div className="mono text-stone-500">{o.id}</div>
                <div className="text-stone-100 leading-tight">
                  <span className="mono text-[11px] text-stone-400 mr-2">{o.agency}</span>
                  {o.title}
                </div>
                <div className="mono text-stone-100 text-right">{cap.toFixed(2)}</div>
                <div
                  className="mono text-stone-100 text-right pl-3"
                  style={o.hot ? { color: "#FFDB51" } : undefined}
                >
                  {fit.toFixed(2)}
                </div>
                <div className="mono text-stone-400 text-right pl-4">{o.decision}</div>
              </Fragment>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-50/10 flex items-baseline justify-between">
          <div className="smallcaps text-[10px] tracking-[0.24em] text-stone-400">Sources synced</div>
          <div className="mono text-[10px] text-stone-400">
            SAM · FPDS · USAspending · 04.26 · 14:00
          </div>
        </div>
      </div>
    </div>
  );
}

function FunnelStrip() {
  return (
    <motion.div
      className="relative mt-20 md:mt-28"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, delay: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="mono text-[11px] text-stone-500">§ 00</div>
        <div className="h-px flex-1 max-w-20" style={{ background: "rgba(255,255,255,0.12)" }} />
        <div className="text-[11px] tracking-[0.24em] uppercase text-stone-400 smallcaps">
          The funnel
        </div>
      </div>
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-sm overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {FUNNEL.map((s, i) => (
          <div
            key={s.label}
            className="relative px-6 py-7"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
            }}
          >
            <div className="flex items-baseline justify-between mb-3">
              <div className="text-[10px] uppercase tracking-[0.22em] smallcaps text-stone-500">
                {s.label}
              </div>
              <div className="mono text-[10px] text-stone-600">
                {String(i + 1).padStart(2, "0")}/04
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span
                className="mono text-stone-50"
                style={{ fontSize: "1.875rem", letterSpacing: "-0.01em" }}
              >
                {s.n}
              </span>
              {i < FUNNEL.length - 1 && (
                <span aria-hidden className="text-stone-600 mono text-[14px]">→</span>
              )}
              {i === FUNNEL.length - 1 && (
                <span
                  aria-hidden
                  className="mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: "#FFDB51" }}
                >
                  · brief
                </span>
              )}
            </div>
            <div className="text-[12px] text-stone-400 mt-1.5">{s.sub}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
