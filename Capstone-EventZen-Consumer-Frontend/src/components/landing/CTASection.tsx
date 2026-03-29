import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ease = [0.25, 0.1, 0.25, 1] as const;

const CTASection = () => (
  <section className="py-20 md:py-28 px-6 md:px-8 max-w-4xl mx-auto text-center">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
      className="bg-foreground rounded-3xl p-10 md:p-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <h2 className="text-2xl md:text-4xl font-medium tracking-tight text-background">
          Ready to streamline your events?
        </h2>
        <p className="mt-4 text-background/70 max-w-md mx-auto">
          Join thousands of professionals who trust EventZen for flawless event execution.
        </p>
        <motion.div
          className="mt-8 inline-block"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            to="/signup"
            className="h-12 px-8 bg-primary text-primary-foreground rounded-full font-medium transition-all inline-flex items-center gap-2 group shadow-lg"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  </section>
);

export default CTASection;
