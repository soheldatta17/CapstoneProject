import { motion, useInView } from "framer-motion";
import { Calendar, Users, MapPin, DollarSign, Truck } from "lucide-react";
import { useRef } from "react";
import GlowCard from "./GlowCard";

const ease = [0.25, 0.1, 0.25, 1] as const;

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, className = "", children, delay = 0 }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.97 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, delay, ease }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={className}
  >
    <GlowCard className="h-full">
      <div className="p-6 md:p-8 flex flex-col justify-between h-full">
        <div>
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + 0.15, type: "spring", stiffness: 200 }}
            className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5"
          >
            {icon}
          </motion.div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </GlowCard>
  </motion.div>
);

const AnimatedBars = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const heights = [40, 65, 30, 80, 55, 45, 70];

  return (
    <div ref={ref} className="flex gap-2 items-end h-[80px]">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={isInView ? { height: h } : { height: 0 }}
          transition={{ duration: 0.6, delay: i * 0.08, ease }}
          className="flex-1 rounded-md bg-primary/15"
        />
      ))}
    </div>
  );
};

const AnimatedProgress = ({ width, label }: { width: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref}>
      <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={isInView ? { width } : { width: "0%" }}
          transition={{ duration: 1.2, delay: 0.3, ease }}
          className="bg-primary h-2.5 rounded-full"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">{label}</p>
    </div>
  );
};

const BentoGrid = () => {
  return (
    <section id="features" className="py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="text-center mb-14"
      >
        <span className="text-sm font-medium text-primary uppercase tracking-wider">Features</span>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mt-3">
          Everything you need, nothing you don't
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Purpose-built modules that work together seamlessly.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard
          className="md:col-span-2"
          icon={<Calendar className="w-5 h-5 text-primary" />}
          title="Event Scheduling"
          description="Complex multi-track scheduling with conflict detection and automated timeline generation."
          delay={0}
        >
          <AnimatedBars />
        </FeatureCard>

        <FeatureCard
          className="md:row-span-2"
          icon={<Users className="w-5 h-5 text-primary" />}
          title="Attendee Tracking"
          description="Real-time check-ins and registration analytics with live capacity monitoring."
          delay={0.08}
        >
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Registered</span>
              <span className="font-mono text-2xl font-semibold text-foreground tabular-nums">1,847</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Checked In</span>
              <span className="font-mono text-2xl font-semibold text-primary tabular-nums">1,203</span>
            </div>
            <AnimatedProgress width="65%" label="65% check-in rate" />
          </div>
        </FeatureCard>

        <FeatureCard
          icon={<MapPin className="w-5 h-5 text-primary" />}
          title="Venue Management"
          description="Capacity planning, interactive floor maps, and real-time availability tracking."
          delay={0.12}
        >
          <div className="grid grid-cols-3 gap-2">
            {["Hall A", "Hall B", "Terrace"].map((name, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-secondary rounded-lg p-2 text-center cursor-default"
              >
                <p className="text-xs font-medium text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground font-mono tabular-nums">{[350, 200, 120][i]}</p>
              </motion.div>
            ))}
          </div>
        </FeatureCard>

        <FeatureCard
          icon={<DollarSign className="w-5 h-5 text-primary" />}
          title="Budget Control"
          description="Automated expense tracking and vendor payouts with real-time budget monitoring."
          delay={0.16}
        >
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Spent</span>
              <span className="font-mono font-medium text-foreground tabular-nums">$42,000 / $50,000</span>
            </div>
            <AnimatedProgress width="84%" label="84% allocated" />
          </div>
        </FeatureCard>
      </div>

      <div className="mt-4">
        <FeatureCard
          className="md:col-span-3"
          icon={<Truck className="w-5 h-5 text-primary" />}
          title="Vendor Coordination"
          description="Centralized vendor directory with status tracking, contract management, and automated communications."
          delay={0.08}
        >
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Pinnacle Catering", status: "Confirmed", color: "bg-success/15 text-success" },
              { name: "LuxDecor Studio", status: "Pending", color: "bg-yellow-100 text-yellow-700" },
              { name: "ShutterPro Media", status: "Confirmed", color: "bg-success/15 text-success" },
              { name: "SoundWave Audio", status: "In Review", color: "bg-primary/10 text-primary" },
              { name: "FlowerCraft", status: "Confirmed", color: "bg-success/15 text-success" },
            ].map((vendor, i) => (
              <motion.div
                key={vendor.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06, ease }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg cursor-default"
              >
                <span className="text-sm font-medium text-foreground">{vendor.name}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${vendor.color}`}>
                  {vendor.status}
                </span>
              </motion.div>
            ))}
          </div>
        </FeatureCard>
      </div>
    </section>
  );
};

export default BentoGrid;
