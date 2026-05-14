import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteData } from "@/constants/data";
import bgImg from "@assets/IMG_20260511_135554_177_1778702553485.jpg";
import { ArrowLeft } from "lucide-react";

export function AcademicHub() {
  const [activeProgramId, setActiveProgramId] = useState(siteData.programs[0].id);
  const [selectedProgram, setSelectedProgram] = useState<typeof siteData.programs[0] | null>(null);
  
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveProgramId(entry.target.getAttribute("data-id") || siteData.programs[0].id);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const activeProgramTitle = siteData.programs.find(p => p.id === activeProgramId)?.title || siteData.programs[0].title;

  const degreePrograms = siteData.programs.filter(p => p.tier === "Degree Programs");
  const tvetPrograms = siteData.programs.filter(p => p.tier === "TVET Programs");

  return (
    <section id="academics" className="relative w-full bg-white flex flex-col md:flex-row">
      {/* Left Panel — sticky image, hidden on phones, visible on tablet/desktop */}
      <div className="hidden md:block md:w-1/2 md:h-screen md:sticky top-0 left-0 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A] to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
          <AnimatePresence mode="wait">
            <motion.h2
              key={activeProgramId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-white font-serif text-4xl md:text-6xl font-bold"
            >
              {activeProgramTitle}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel (scrollable) */}
      <div className="w-full md:w-1/2 py-16 px-8 md:py-24 md:px-16 bg-white min-h-[100vh]">
        <div className="max-w-xl mx-auto">
          
          <div className="mb-16">
            <h3 className="text-[#1E3A8A] tracking-[0.2em] text-[10px] sm:text-xs font-semibold uppercase mb-8">Degree Programs</h3>
            <div className="flex flex-col space-y-2">
              {degreePrograms.map((program, index) => (
                <div
                  key={program.id}
                  data-id={program.id}
                  ref={el => itemRefs.current[index] = el}
                  onClick={() => setSelectedProgram(program)}
                  className={`cursor-pointer py-4 sm:py-6 md:py-8 pl-6 transition-all duration-300 border-l-4 ${
                    activeProgramId === program.id 
                      ? "border-[#D4AF37] font-bold" 
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <h4 className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1E3A8A] transition-all duration-300 ${activeProgramId === program.id ? "opacity-100" : "opacity-60"}`}>
                    {program.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[#1E3A8A] tracking-[0.2em] text-[10px] sm:text-xs font-semibold uppercase mb-8">TVET Programs</h3>
            <div className="flex flex-col space-y-2">
              {tvetPrograms.map((program, index) => (
                <div
                  key={program.id}
                  data-id={program.id}
                  ref={el => itemRefs.current[degreePrograms.length + index] = el}
                  onClick={() => setSelectedProgram(program)}
                  className={`cursor-pointer py-4 sm:py-6 md:py-8 pl-6 transition-all duration-300 border-l-4 ${
                    activeProgramId === program.id 
                      ? "border-[#D4AF37] font-bold" 
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <h4 className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1E3A8A] transition-all duration-300 ${activeProgramId === program.id ? "opacity-100" : "opacity-60"}`}>
                    {program.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Action View (Overlay) */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/85"
            style={{ 
              backgroundImage: `url(${bgImg})`,
              backgroundBlendMode: 'overlay',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="min-h-screen p-8 md:p-16 flex items-center justify-center">
              <button 
                onClick={() => setSelectedProgram(null)}
                className="fixed md:absolute top-4 left-4 md:top-12 md:left-12 bg-[#1E3A8A] text-white px-6 py-3 flex items-center gap-2 hover:bg-[#152a66] transition-colors z-[60]"
              >
                <ArrowLeft size={20} />
                <span className="font-sans text-sm tracking-widest uppercase">Back to Programs</span>
              </button>

              <div className="max-w-3xl w-full bg-white/5 backdrop-blur-md p-8 md:p-12 border border-white/10 mt-16 md:mt-0">
                <span className="text-[#D4AF37] tracking-[0.2em] text-xs font-semibold uppercase block mb-4">
                  {selectedProgram.tier}
                </span>
                <h2 className="font-serif text-5xl md:text-6xl text-white mb-10 leading-tight">
                  {selectedProgram.title}
                </h2>
                
                <div className="space-y-10">
                  <div>
                    <h3 className="text-white/70 font-sans tracking-wider uppercase text-xs mb-3">How the College Sees This Work</h3>
                    <p className="text-white font-light text-lg leading-relaxed font-sans">
                      {selectedProgram.vision}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-white/70 font-sans tracking-wider uppercase text-xs mb-3">The Action: Learning by Doing</h3>
                    <p className="text-white font-light text-lg leading-relaxed font-sans">
                      {selectedProgram.action}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/20">
                    <div>
                      <h4 className="text-white/50 font-sans tracking-wider uppercase text-xs mb-2">Duration</h4>
                      <p className="text-white font-serif">{selectedProgram.duration}</p>
                    </div>
                    <div>
                      <h4 className="text-white/50 font-sans tracking-wider uppercase text-xs mb-2">Skills</h4>
                      <p className="text-white font-serif">{selectedProgram.skills}</p>
                    </div>
                    <div>
                      <h4 className="text-white/50 font-sans tracking-wider uppercase text-xs mb-2">Future Jobs</h4>
                      <p className="text-white font-serif">{selectedProgram.careers}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
