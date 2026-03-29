import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import GlowCard from "./GlowCard";

const ease = [0.25, 0.1, 0.25, 1] as const;

interface StatItem {
  endValue: number;
  suffix: string;
  prefix: string;
  label: string;
  decimals?: number;
}

const stats: StatItem[] = [
  { endValue: 2400, suffix: "+", prefix: "", label: "Events Managed" },
  { endValue: 98.5, suffix: "%", prefix: "", label: "On-time Delivery", decimals: 1 },
  { endValue: 150, suffix: "K+", prefix: "", label: "Attendees Tracked" },
  { endValue: 4.9, suffix: "/5", prefix: "", label: "Client Satisfaction", decimals: 1 },
];

function useCountUp(end: number, duration: number, start: boolean, decimals = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start, decimals]);

  return value;
}

const CountUpCard = ({ stat, index }: { stat: StatItem; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(stat.endValue, 2000, isInView, stat.decimals);

  const formatValue = useCallback(() => {
    if (stat.decimals) return count.toFixed(stat.decimals);
    return count.toLocaleString();
  }, [count, stat.decimals]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <GlowCard>
        <div className="p-6 md:p-8 text-center">
          <p className="font-mono text-3xl md:text-4xl font-semibold text-foreground tabular-nums tracking-tight">
            {stat.prefix}{formatValue()}{stat.suffix}
          </p>
          <p className="mt-2 text-sm text-muted-foreground font-medium">{stat.label}</p>
        </div>
      </GlowCard>
    </motion.div>
  );
};

const SocialProof = () => {
  return (
    <section id="proof" className="py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease }}
        className="text-center mb-14"
      >
        <span className="text-sm font-medium text-primary uppercase tracking-wider">Social Proof</span>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mt-3">
          Trusted by professionals
        </h2>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          Numbers that reflect reliability, not marketing.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <CountUpCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
};

export default SocialProof;
