import { motion } from "motion/react";
import { Fragment, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

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

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  useEffect(() => {
    const stored = localStorage.getItem("orla-theme") as "dark" | "light" | null;
    const initial = stored || "dark";
    setTheme(initial);
    if (initial === "light") {
      document.documentElement.dataset.theme = "light";
    } else {
      delete document.documentElement.dataset.theme;
    }
  }, []);
  
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("orla-theme", next);
    if (next === "light") {
      document.documentElement.dataset.theme = "light";
    } else {
      delete document.documentElement.dataset.theme;
    }
  };
  
  return { theme, toggleTheme };
}

export function Hero() {
  const { theme, toggleTheme } = useTheme();
  
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
        <div className="hidden md:flex items-center gap-9 text-[13px] text-secondary">
          <a href="#different" className="hover:text-primary transition">How it works</a>
          <a href="#example" className="hover:text-primary transition">Example brief</a>
          <a href="#methodology" className="hover:text-primary transition">Methodology</a>
          <a href="#pricing" className="hover:text-primary transition">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 cursor-pointer transition-colors"
            style={{ color: "var(--text-primary)" }}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun size={18} className="hover:text-[var(--gold-accent)] transition-colors" />
            ) : (
              <Moon size={18} className="hover:text-[var(--gold-accent)] transition-colors" />
            )}
          </button>
          <a
            href="#pricing"
            className="text-[13px] px-4 py-2 rounded-sm transition"
            style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
          >
            Sign in
          </a>
        </div>
      </nav>

      <div className="relative grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12" style={{ background: "#FFDB51" }} />
            <div className="text-[11px] tracking-[0.24em] uppercase text-tertiary">
              Federal BD Intelligence
            </div>
          </div>
          <h1
            className="serif text-primary leading-[1.04] tracking-[-0.015em] mb-8"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)", fontWeight: 500 }}
          >
            From <span className="nums" style={{ fontSize: "0.92em" }}>$680B</span> in federal spend,
            <br />
            <span className="text-tertiary">the three things worth your week.</span>
          </h1>
          <p className="text-secondary max-w-xl leading-relaxed mb-10" style={{ fontSize: "1.0625rem" }}>
            Orla narrows <span className="nums">4,217</span> active opportunities to a Friday brief —
            ranked, scored, written in plain English. The funnel is the product.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm transition"
              style={{ background: "var(--gold-cta)", color: "var(--cta-text)", fontWeight: 500 }}
            >
              Start your 14-day trial
            </a>
            <a href="#example" className="text-[14px] text-secondary hover:text-primary transition">
              See an example brief →
            </a>
          </div>
          <div className="mt-10 text-[12px] text-tertiary">
            <span className="nums">No credit card.</span> Cancel anytime.{" "}
            <span className="nums">60-day</span> retention after cancel.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="flex items-baseline justify-between mb-4">
            <div className="text-[10px] tracking-[0.28em] uppercase text-quaternary smallcaps">
              Orla · Live scoring
            </div>
            <div className="nums text-[11px] text-tertiary">FY26 · WK 17</div>
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
        background: "linear-gradient(180deg, var(--panel-from), var(--panel-to))",
        border: "1px solid var(--panel-border)",
        boxShadow: "0 60px 120px -50px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.02) inset",
      }}
    >
      <div className="flex items-baseline justify-between px-6 md:px-7 py-5" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="flex items-center gap-3">
          <span className="relative inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--signal-rules)" }}>
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "var(--signal-rules)", opacity: 0.5 }} />
          </span>
          <div className="smallcaps text-[10px] tracking-[0.24em] text-secondary">
            Live · Opportunity scoring
          </div>
        </div>
        <div className="nums text-[10px] text-quaternary">
          Last sync · 14:00 ET · next · {String(47 - (t % 47)).padStart(2, "0")}m
        </div>
      </div>

      <div className="px-6 md:px-7 py-5">
        <div
          className="grid gap-y-3.5 text-[12px]"
          style={{ gridTemplateColumns: "auto 1fr auto auto auto" }}
        >
          <div className="nums text-[9px] uppercase tracking-[0.2em] text-quaternary">ID</div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-quaternary smallcaps">Opportunity</div>
          <div className="nums text-[9px] uppercase tracking-[0.2em] text-quaternary text-right">Cap</div>
          <div className="nums text-[9px] uppercase tracking-[0.2em] text-quaternary text-right pl-3">Fit</div>
          <div className="nums text-[9px] uppercase tracking-[0.2em] text-quaternary text-right pl-4">Dec.</div>

          {opps.map((o, i) => {
            const jitter = Math.sin(t * 0.7 + i * 1.1) * 0.008;
            const cap = Math.max(0, Math.min(1, o.capture + jitter));
            const fit = Math.max(0, Math.min(1, o.fit - jitter * 0.7));
            return (
              <Fragment key={o.id}>
                <div className="nums text-quaternary">{o.id}</div>
                <div className="text-primary leading-tight">
                  <span className="nums text-[11px] text-tertiary mr-2">{o.agency}</span>
                  {o.title}
                </div>
                <div className="nums text-primary text-right">{cap.toFixed(2)}</div>
                <div
                  className="nums text-primary text-right pl-3"
                  style={o.hot ? { color: "var(--gold-cta)" } : undefined}
                >
                  {fit.toFixed(2)}
                </div>
                <div className="nums text-tertiary text-right pl-4">{o.decision}</div>
              </Fragment>
            );
          })}
        </div>

        <div className="mt-6 pt-4 flex items-baseline justify-between" style={{ borderTop: "1px solid var(--border-default)" }}>
          <div className="smallcaps text-[10px] tracking-[0.24em] text-tertiary">Sources synced</div>
          <div className="nums text-[10px] text-tertiary">
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
        <div className="nums text-[11px] text-quaternary">§ 00</div>
        <div className="h-px flex-1 max-w-20" style={{ background: "var(--border-strong)" }} />
        <div className="text-[11px] tracking-[0.24em] uppercase text-tertiary smallcaps">
          The funnel
        </div>
      </div>
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-sm overflow-hidden"
        style={{
          background: "var(--border-default)",
          border: "1px solid var(--border-default)",
        }}
      >
        {FUNNEL.map((s, i) => (
          <div
            key={s.label}
            className="relative px-6 py-7"
            style={{
              background:
                "linear-gradient(180deg, var(--panel-from), var(--panel-to))",
            }}
          >
            <div className="flex items-baseline justify-between mb-3">
              <div className="text-[10px] uppercase tracking-[0.22em] smallcaps text-quaternary">
                {s.label}
              </div>
              <div className="nums text-[10px] text-muted">
                {String(i + 1).padStart(2, "0")}/04
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span
                className="nums text-primary"
                style={{ fontSize: "1.875rem", letterSpacing: "-0.01em" }}
              >
                {s.n}
              </span>
              {i < FUNNEL.length - 1 && (
                <span aria-hidden className="text-muted mono text-[14px]">→</span>
              )}
              {i === FUNNEL.length - 1 && (
                <span
                  aria-hidden
                  className="nums text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: "var(--gold-cta)" }}
                >
                  · brief
                </span>
              )}
            </div>
            <div className="text-[12px] text-tertiary mt-1.5">{s.sub}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
