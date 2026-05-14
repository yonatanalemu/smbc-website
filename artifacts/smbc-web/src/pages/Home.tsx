import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Hero } from "@/components/Hero";
import { AcademicHub } from "@/sections/AcademicHub";
import { PurposeValues } from "@/sections/PurposeValues";
import { AboutSection } from "@/sections/AboutSection";
import { AdmissionsOverlay } from "@/sections/AdmissionsOverlay";
import { Footer } from "@/sections/Footer";

export default function Home() {
  const [isAdmissionsOpen, setIsAdmissionsOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    if (window.location.hash === "#admissions") {
      setIsAdmissionsOpen(true);
      // Clean up hash so it doesn't reopen on refresh unless explicit
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [location]);

  return (
    <main className="w-full min-h-screen bg-white">
      <Hero setIsAdmissionsOpen={setIsAdmissionsOpen} />
      <AcademicHub />
      <PurposeValues />
      <AboutSection />
      <Footer />
      
      <AdmissionsOverlay 
        isOpen={isAdmissionsOpen} 
        onClose={() => setIsAdmissionsOpen(false)} 
      />
    </main>
  );
}
