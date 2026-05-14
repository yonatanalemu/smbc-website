import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, CheckCircle } from "lucide-react";
import bgImg from "@assets/IMG_20260511_135554_177_1778702553485.jpg";
import { insertLead } from "@/lib/supabase";
import {
  sanitizeInput,
  validateContactInfo,
  checkRateLimit,
  recordSubmission,
} from "@/lib/security";

interface AdmissionsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdmissionsOverlay({ isOpen, onClose }: AdmissionsOverlayProps) {
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot — bots fill this, real users don't
    if (honeypot) {
      setIsSuccess(true);
      return;
    }

    // Rate limit — 3 per 10 minutes per browser
    const { allowed } = checkRateLimit();
    if (!allowed) {
      setValidationError("Too many submissions. Please try again later.");
      return;
    }

    const clean = sanitizeInput(inputValue);

    const { valid, message } = validateContactInfo(clean);
    if (!valid) {
      setValidationError(message);
      return;
    }

    setValidationError("");
    setIsLoading(true);

    try {
      await insertLead(clean);
      recordSubmission();
      setIsSuccess(true);
    } catch {
      setValidationError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setShowForm(false);
    setInputValue("");
    setHoneypot("");
    setIsLoading(false);
    setIsSuccess(false);
    setValidationError("");
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetState, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (validationError) setValidationError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImg})` }}
          />
          <div className="absolute inset-0 bg-[#1E3A8A]/10 backdrop-blur-xl" />
          <div className="absolute inset-0" onClick={handleClose} />

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="relative z-10 w-full max-w-4xl overflow-y-auto max-h-[90vh] md:max-h-none p-4 md:p-8"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 md:-top-12 md:right-0 text-white hover:text-[#D4AF37] transition-colors z-20"
              aria-label="Close"
            >
              <X size={32} strokeWidth={1.5} />
            </button>

            <div className="text-center mb-8 md:mb-12 mt-8 md:mt-0">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-white font-bold mb-4">
                Join the Next Generation of Leaders
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Card A: Priority Waitlist */}
              <div className="bg-white p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-shadow duration-300">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-hover:bg-[#D4AF37] transition-colors duration-300" />

                <AnimatePresence mode="wait">
                  {!showForm && !isSuccess ? (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col h-full"
                    >
                      <div>
                        <span className="text-[#1E3A8A] font-sans text-xs tracking-widest uppercase font-semibold mb-4 block">
                          Priority Waitlist
                        </span>
                        <h3 className="font-serif text-2xl text-[#1E3A8A] font-bold mb-4">
                          Prepare to join our technologized workforce.
                        </h3>
                        <p className="font-sans text-gray-600 mb-8 font-light leading-relaxed">
                          Our digital application portal for the Class of 2026 officially opens in September 2026.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowForm(true)}
                        className="bg-[#1E3A8A] text-white py-4 px-6 font-sans text-sm tracking-wider uppercase font-medium hover:bg-[#152a66] transition-colors w-full mt-auto"
                      >
                        Notify Me When Portal Opens
                      </button>
                    </motion.div>
                  ) : isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center py-8"
                    >
                      <CheckCircle size={48} className="text-[#D4AF37] mb-6" strokeWidth={1.5} />
                      <h3 className="font-serif text-2xl text-[#1E3A8A] font-bold mb-4">
                        Priority Confirmed
                      </h3>
                      <p className="font-sans text-gray-600 font-light leading-relaxed">
                        You are on the Priority List. We have reserved your interest for the Class of 2026. You will be among the first to receive the application link.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col h-full justify-center"
                    >
                      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Honeypot — invisible to real users */}
                        <input
                          type="text"
                          name="website"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                          tabIndex={-1}
                          aria-hidden="true"
                          autoComplete="off"
                          style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
                        />

                        <div>
                          <label className="text-[#1E3A8A] font-sans text-xs tracking-widest uppercase font-semibold mb-2 block">
                            Your Contact Details
                          </label>
                          <input
                            type="text"
                            placeholder="Enter your email or phone number"
                            value={inputValue}
                            onChange={handleInputChange}
                            maxLength={200}
                            autoComplete="off"
                            className={`w-full border-b-2 py-3 font-sans text-lg focus:outline-none transition-colors bg-transparent placeholder:text-gray-400 ${
                              validationError
                                ? "border-red-400"
                                : "border-gray-200 focus:border-[#D4AF37]"
                            }`}
                            autoFocus
                          />
                          {validationError && (
                            <p className="text-red-500 font-sans text-xs mt-2">{validationError}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={!inputValue.trim() || isLoading}
                          className={`py-4 px-6 font-sans text-sm tracking-wider uppercase font-medium transition-all duration-300 w-full flex justify-center items-center h-14 ${
                            inputValue.trim()
                              ? "bg-[#1E3A8A] text-white hover:bg-[#152a66]"
                              : "bg-[#1E3A8A]/40 text-white/70 cursor-not-allowed"
                          }`}
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card B: Admissions Guide */}
              <div className="border border-white/20 p-6 sm:p-8 md:p-10 flex flex-col justify-between backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-[#D4AF37]" size={20} />
                    <span className="text-[#D4AF37] font-sans text-xs tracking-widest uppercase font-semibold">
                      Admissions Guide
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-bold mb-4">
                    Everything you need to succeed.
                  </h3>
                  <p className="font-sans text-white/80 mb-8 font-light leading-relaxed text-sm sm:text-base">
                    Download the 2026 Admissions and Career Guide to review requirements.
                  </p>
                </div>
                <a
                  href={`${import.meta.env.BASE_URL}smbc-admissions-guide-2026.pdf`}
                  download="SMBC-Admissions-Guide-2026.pdf"
                  className="block border border-white text-white py-4 px-6 font-sans text-sm tracking-wider uppercase font-medium hover:bg-white hover:text-[#1E3A8A] transition-colors w-full mt-auto text-center"
                >
                  Download PDF Guide
                </a>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
