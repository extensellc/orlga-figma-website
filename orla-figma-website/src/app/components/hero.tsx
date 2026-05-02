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

export function Hero() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <section className="relative min-h-screen px-6 md:px-12 lg:px-20 pt-8 pb-20 overflow-hidden">
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
        </motion.div>
      </div>
    </section>
  );
}


