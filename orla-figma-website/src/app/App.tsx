import { Hero } from "./components/hero";
import {
  Broken,
  Different,
  Example,
  Pricing,
  Personas,
  Trust,
  Footer,
} from "./components/sections";
import { Methodology } from "./components/methodology";
import { Compliance } from "./components/compliance";
import { ProgressRail } from "./components/progress-rail";

export default function App() {
  return (
    <div
      className="min-h-screen w-full text-stone-100 antialiased"
      style={{
        background: "linear-gradient(to bottom right, #050814, #0B1A33)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <a href="#main" className="skip-link">Skip to content</a>
      <ProgressRail />
      <main id="main">
        <Hero />
        <Broken />
        <Different />
        <Example />
        <Methodology />
        <Pricing />
        <Personas />
        <Trust />
      </main>
      <Compliance />
      <Footer />
    </div>
  );
}
