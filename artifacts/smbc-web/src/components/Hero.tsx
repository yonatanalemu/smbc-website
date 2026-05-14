import React from "react";
import { motion } from "framer-motion";
import { Navigation } from "./Navigation";
import { siteData } from "@/constants/data";
import bgImg from "@assets/IMG_20260511_135554_177_1778702553485.jpg";

interface HeroProps {
  setIsAdmissionsOpen?: (open: boolean) => void;
}

export function Hero({ setIsAdmissionsOpen }: HeroProps) {
  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (setIsAdmissionsOpen) {
      setIsAdmissionsOpen(true);
    }
  };

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${bgImg})`,
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.7) 100%)'
        }}
      />

      <Navigation setIsAdmissionsOpen={setIsAdmissionsOpen} />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto h-full">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-serif text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-wide mb-6"
        >
          {siteData.heroTitle}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="font-sans text-white/90 text-sm sm:text-base max-w-[90%] md:max-w-[700px] tracking-wide mb-12 leading-relaxed"
        >
          {siteData.heroSubtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="w-full md:w-auto"
        >
          <a
            href={siteData.primaryCTA.link}
            onClick={handleCtaClick}
            className="cursor-pointer group inline-flex items-center justify-center px-10 py-4 font-sans text-sm font-medium tracking-[0.2em] uppercase text-[#D4AF37] border border-[#D4AF37] bg-transparent transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#1E3A8A] w-full md:w-auto"
          >
            {siteData.primaryCTA.label}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
