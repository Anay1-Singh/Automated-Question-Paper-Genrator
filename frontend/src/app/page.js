"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/sections/Hero";
import Trust from "@/sections/Trust";
import Features from "@/sections/Features";
import HowItWorks from "@/sections/HowItWorks";
import BloomTaxonomy from "@/sections/BloomTaxonomy";
import Benefits from "@/sections/Benefits";
import Screenshots from "@/sections/Screenshots";
import FAQ from "@/sections/FAQ";
import CTA from "@/sections/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans select-text">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Page Layout Sections */}
      <main className="relative z-10">
        {/* 1. Hero Section + Interactive Product Preview Console */}
        <Hero />

        {/* 2. Grayscale Academic Trust badges */}
        <Trust />

        {/* 3. Features Section Grid */}
        <Features />

        {/* 4. How It Works Pipeline Flowchart */}
        <HowItWorks />

        {/* 5. Bloom's Taxonomy Central Stacked Card Selection */}
        <BloomTaxonomy />

        {/* 6. Benefits & Efficacy Statistics */}
        <Benefits />

        {/* 7. Gallery Interactive Mockups (Console Walkthrough) */}
        <Screenshots />

        {/* 8. FAQ Section Accordions */}
        <FAQ />

        {/* 9. Minimal Dark CTA Banner */}
        <CTA />
      </main>

      {/* Footer layout */}
      <Footer />
    </div>
  );
}
