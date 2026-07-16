import { useEffect } from "react";
import Hero from "../components/hero/Hero";
import About from "../components/about/About";
import Philosophy from "../components/philosophy/Philosophy";
import CaseStudiesIndex from "../components/case-studies/CaseStudiesIndex";
import AICapabilities from "../components/ai-capabilities/AICapabilities";
import ProofOfExcellence from "../components/proof/ProofOfExcellence";
import Vision from "../components/vision/Vision";
import Contact from "../components/contact/Contact";
import Footer from "../components/layout/Footer";
import StickyNav from "../components/layout/StickyNav";

export default function HomePage() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  return (
    <>
      <StickyNav />
      <Hero />
      <About />
      <Philosophy />
      <CaseStudiesIndex />
      <AICapabilities />
      <ProofOfExcellence />
      <Vision />
      <Contact />
      <Footer />
    </>
  );
}
