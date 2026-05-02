import { Hero } from "./components/hero";
import { Broken, Trust, Footer } from "./components/sections";
import { ProgressRail } from "./components/progress-rail";

export default function App() {
  return (
    <div
      className="min-h-screen w-full text-stone-100 antialiased"
      style={{
        background: "linear-gradient(to bottom right, var(--bg-from), var(--bg-to))",
        fontFamily: "var(--font-sans)",
      }}
    >
      <a href="#main" className="skip-link">Skip to content</a>
      <ProgressRail />
      <main id="main">
        <Hero />
        <Broken />
        <Trust />
      </main>
      <Footer />
    </div>
  );
}
