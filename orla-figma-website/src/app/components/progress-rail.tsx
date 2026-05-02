import { motion, useScroll, useSpring } from "motion/react";

export function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <div className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
      <div
        className="relative h-64 w-px origin-top"
        style={{ background: "var(--border-default)" }}
      >
        <motion.div
          className="absolute top-0 left-0 w-px origin-top"
          style={{ height: "100%", background: "var(--gold-cta)", scaleY }}
        />
      </div>
    </div>
  );
}
