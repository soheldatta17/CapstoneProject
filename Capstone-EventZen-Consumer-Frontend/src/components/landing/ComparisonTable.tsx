import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import GlowCard from "./GlowCard";

const ease = [0.25, 0.1, 0.25, 1] as const;

interface RowProps {
  label: string;
  oldWay: string;
  newWay: string;
  index: number;
}

const ComparisonRow = ({ label, oldWay, newWay, index }: RowProps) => (
  <motion.tr
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay: index * 0.08, ease }}
    className="border-b border-border/50 last:border-0"
  >
    <td className="p-4 md:p-6 font-medium text-foreground text-sm">{label}</td>
    <td className="p-4 md:p-6 text-muted-foreground text-sm">
      <div className="flex items-center gap-2">
        <XCircle className="w-4 h-4 text-destructive/40 shrink-0" />
        <span>{oldWay}</span>
      </div>
    </td>
    <td className="p-4 md:p-6 text-foreground text-sm font-medium">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.08 + 0.2, type: "spring", stiffness: 300 }}
        >
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
        </motion.div>
        <span>{newWay}</span>
      </div>
    </td>
  </motion.tr>
);

const rows = [
  { label: "Data Updates", oldWay: "Manual spreadsheet entry", newWay: "Real-time sync across portals" },
  { label: "Vendor Comms", oldWay: "Scattered email threads", newWay: "Centralized vendor dashboard" },
  { label: "Reporting", oldWay: "End-of-week manual exports", newWay: "Instant live-data visualizations" },
  { label: "On-site Ops", oldWay: "Printed guest lists", newWay: "Mobile QR check-in system" },
  { label: "Budget", oldWay: "Post-event reconciliation", newWay: "Real-time expense tracking" },
];

const ComparisonTable = () => {
  return (
    <section id="comparison" className="py-20 md:py-28 px-6 md:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="text-center mb-14"
      >
        <span className="text-sm font-medium text-primary uppercase tracking-wider">Comparison</span>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mt-3">
          Engineered for clarity
        </h2>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          See how EventZen replaces fragmented workflows with precision tooling.
        </p>
      </motion.div>

      <GlowCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-secondary border-b border-border">
                <th className="p-4 md:p-6 font-medium text-xs text-muted-foreground uppercase tracking-wider rounded-tl-2xl">Feature</th>
                <th className="p-4 md:p-6 font-medium text-xs text-muted-foreground uppercase tracking-wider">The Old Way</th>
                <th className="p-4 md:p-6 font-medium text-xs text-primary uppercase tracking-wider rounded-tr-2xl">EventZen</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <ComparisonRow key={row.label} {...row} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      </GlowCard>
    </section>
  );
};

export default ComparisonTable;
