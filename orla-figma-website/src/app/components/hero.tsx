import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

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

function OpportunityField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0",
        maskImage:
          "radial-gradient(ellipse 70% 50% at 30% 50%, black 30%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 50% at 30% 50%, black 30%, transparent 75%)",
      }}
    />
  );
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

      <div className="relative">
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
            Your BD hours are the scarce resource.
            <br />
            <span className="text-tertiary">Your analysis hours shouldn&apos;t be.</span>
          </h1>
          <p className="text-secondary max-w-2xl leading-relaxed mb-10" style={{ fontSize: "1.125rem" }}>
            Prepared analysis of which agencies to target, which to skip, and where the gaps in your firm&apos;s profile are costing you the most pipeline.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm transition"
              style={{ background: "var(--gold-cta)", color: "var(--cta-text)", fontWeight: 500 }}
            >
              Start free trial
            </a>
            <a href="#how-orla-thinks" className="text-[14px] text-secondary hover:text-primary transition">
              See how it works →
            </a>
          </div>
          <div className="mt-10 flex items-center gap-3 text-[12px] text-tertiary">
            <span className="relative inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--signal-rules)" }}>
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "var(--signal-rules)", opacity: 0.5 }} />
            </span>
            <span>
              Updated hourly · Tracking <span className="nums">4,217</span> active opportunities across <span className="nums">24</span> federal agencies
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const FUNNEL_STAGES = [
  { label: "Active opportunities", n: "4,217", sub: "across 24 agencies" },
  { label: "NAICS shortlist",      n: "312",   sub: "in your code set" },
  { label: "Composite watchlist",  n: "47",    sub: "score ≥ 0.60" },
  { label: "This week's brief",    n: "3",     sub: "named recommendations" },
];

export function FunnelStrip() {
  return (
    <section
      className="px-6 md:px-12 lg:px-20 py-16 md:py-20"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.0, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="nums text-[12px] text-quaternary">§ 00</div>
          <div className="h-px flex-1 max-w-20" style={{ background: "var(--border-strong)" }} />
          <div className="text-[11px] tracking-[0.24em] uppercase text-tertiary smallcaps">
            The funnel
          </div>
        </div>

        <div className="grid grid-cols-2 md:flex md:justify-between gap-y-10 gap-x-6">
          {FUNNEL_STAGES.map((stage, i) => (
            <motion.div
              key={stage.label}
              className="flex items-start gap-4 md:gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span
                    className="nums text-primary"
                    style={{ fontSize: "2.5rem", letterSpacing: "-0.01em" }}
                  >
                    {stage.n}
                  </span>
                  {i === FUNNEL_STAGES.length - 1 && (
                    <span
                      className="nums text-[10px] uppercase tracking-[0.18em]"
                      style={{ color: "var(--gold-cta)" }}
                    >
                      · brief
                    </span>
                  )}
                </div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-quaternary smallcaps mt-2">
                  {stage.label}
                </div>
                <div className="text-[12px] text-tertiary mt-1">
                  {stage.sub}
                </div>
              </div>
              {i < FUNNEL_STAGES.length - 1 && (
                <span className="hidden md:block nums text-[18px] text-quaternary mt-3">→</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}


