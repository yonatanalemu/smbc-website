import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { siteData } from "@/constants/data";
import logoImg from "@assets/1000028986-removebg-preview_1778702553456.png";

interface NavigationProps {
  setIsAdmissionsOpen?: (open: boolean) => void;
}

export function Navigation({ setIsAdmissionsOpen }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();

  // Show solid background once user scrolls past the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (href === "#admissions") {
      if (setIsAdmissionsOpen) setIsAdmissionsOpen(true);
    } else if (href.startsWith("#")) {
      const element = document.getElementById(href.substring(1));
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      setLocation(href);
    }
  };

  return (
    <>
      {/* Sticky top bar — fixed across ALL sections */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 flex items-center justify-center transition-all duration-500 ${
          scrolled
            ? "bg-[#1E3A8A]/95 backdrop-blur-md shadow-lg py-3 px-6 md:px-10"
            : "bg-transparent py-5 px-6 md:px-10"
        }`}
      >
        <img
          src={logoImg}
          alt="SMBC Logo"
          className={`object-contain drop-shadow-lg transition-all duration-500 ${
            scrolled ? "h-9 md:h-11" : "h-12 md:h-16"
          }`}
        />
        <button
          onClick={() => setIsOpen(true)}
          className="absolute right-6 md:right-10 text-white hover:opacity-80 transition-opacity focus:outline-none"
          aria-label="Open menu"
        >
          <Menu className="w-8 h-8" strokeWidth={1.5} />
        </button>
      </nav>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col justify-between"
            style={{ backgroundColor: "rgba(0,0,0,0.96)" }}
          >
            {/* Close button */}
            <div className="absolute top-6 right-8">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:opacity-80 transition-opacity focus:outline-none"
                aria-label="Close menu"
              >
                <X className="w-10 h-10" strokeWidth={1} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-grow flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
              <div className="flex flex-col space-y-6 md:space-y-8">
                {siteData.navLinks.map((link, index) => {
                  const isGold = link.label === "Secure Your Future";
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                    >
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className={`cursor-pointer group relative font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium inline-block tracking-tight ${
                          isGold ? "text-[#D4AF37]" : "text-white"
                        }`}
                      >
                        {link.label}
                        <span
                          className={`absolute left-0 -bottom-2 w-0 h-1 transition-all duration-300 ease-out group-hover:w-full ${
                            isGold ? "bg-white" : "bg-[#D4AF37]"
                          }`}
                        />
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom bar — college name only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="py-8 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-white/10 max-w-7xl mx-auto w-full"
            >
              <p className="font-serif text-white/50 text-sm tracking-wide">
                Sitti Medical and Business College 2026
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
