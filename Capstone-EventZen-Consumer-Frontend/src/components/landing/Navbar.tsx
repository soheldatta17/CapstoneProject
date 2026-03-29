import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground">
          <motion.div
            whileHover={{ rotate: 6, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold"
          >
            E
          </motion.div>
          EventZen
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors duration-200">Features</a>
          <a href="#comparison" className="hover:text-primary transition-colors duration-200">Comparison</a>
          <a href="#proof" className="hover:text-primary transition-colors duration-200">Results</a>
          <Link to="/login" className="hover:text-primary transition-colors duration-200">Login</Link>
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/signup"
              className="bg-foreground text-background px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Features</a>
              <a href="#comparison" className="text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Comparison</a>
              <a href="#proof" className="text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Results</a>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/signup" className="bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
