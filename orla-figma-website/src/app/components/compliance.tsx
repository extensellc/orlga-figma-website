import { Reveal } from "./reveal";

const eyebrow = "text-[11px] tracking-[0.24em] uppercase text-stone-400 smallcaps";

export function Compliance() {
  const badges = [
    { k: "SOC 2 Type II", s: "Audited annually · Report on request" },
    { k: "FedRAMP", s: "Moderate · In Process" },
    { k: "CMMC 2.0", s: "Level 2 aligned · L2 certification Q4 2026" },
    { k: "ITAR / EAR", s: "US-person handling · controlled data on request" },
    { k: "Encryption", s: "AES-256 at rest · TLS 1.3 in transit" },
    { k: "Hosting", s: "US-only · AWS GovCloud (US) for regulated tiers" },
  ];

  return (
    <section
      id="compliance"
      aria-labelledby="compliance-title"
      className="px-6 md:px-12 lg:px-20 py-20 md:py-24"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <Reveal>
        <div className="flex items-center gap-4 mb-10">
          <div className={eyebrow}>Compliance & security</div>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          <div id="compliance-title" className="mono text-[11px] text-stone-500">
            Posture · Apr 2026
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <ul
          className="grid grid-cols-2 md:grid-cols-3 gap-px rounded-sm overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {badges.map((b) => (
            <li
              key={b.k}
              className="p-5 md:p-6 panel-hover"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
              }}
            >
              <div
                className="text-stone-50 mb-1.5"
                style={{ fontSize: "0.9375rem", fontWeight: 500 }}
              >
                {b.k}
              </div>
              <div className="text-stone-400 leading-relaxed text-[12.5px]">{b.s}</div>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-6 text-stone-500 text-[12.5px] leading-relaxed max-w-3xl">
          Buyers requiring a current SOC 2 report, security questionnaire, or BAA can request
          documentation from{" "}
          <a
            href="mailto:trust@orla.example"
            className="text-stone-300 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDB51]/60 rounded-sm"
          >
            trust@orla.example
          </a>
          .
        </p>
      </Reveal>
    </section>
  );
}
