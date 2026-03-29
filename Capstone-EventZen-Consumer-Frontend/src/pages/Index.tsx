import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import BentoGrid from "@/components/landing/BentoGrid";
import ComparisonTable from "@/components/landing/ComparisonTable";
import SocialProof from "@/components/landing/SocialProof";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 antialiased">
      <Navbar />
      <HeroSection />
      <BentoGrid />
      <ComparisonTable />
      <SocialProof />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
