import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { siteData } from "@/constants/data";
import logoImg from "@assets/1000028986-removebg-preview_1778702553456.png";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.77a8.16 8.16 0 004.77 1.52V6.82a4.85 4.85 0 01-1-.13z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  TikTok: TikTokIcon,
  Facebook: FacebookIcon,
  Telegram: TelegramIcon,
};

export function Footer() {
  const { contact, navPillars, socials } = siteData.footer;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, pillar: string) => {
    if (pillar === "Secure Your Future") {
      return;
    }
  };

  const getPillarHref = (pillar: string) => {
    if (pillar === "Home") return "/";
    if (pillar === "Academics") return "#academics";
    if (pillar === "About Us") return "#about";
    if (pillar === "Secure Your Future") return "#admissions";
    return "/";
  };

  return (
    <>
      {/* Wave SVG */}
      <div className="w-full overflow-hidden leading-none" style={{ marginBottom: "-2px" }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 sm:h-20 md:h-24">
          <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,40 L1440,80 L0,80 Z" fill="#0f1f3d" />
        </svg>
      </div>

      <footer className="w-full bg-[#0f1f3d] pt-12 pb-8 px-4 sm:px-8 md:px-16 text-white border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-16 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img src={logoImg} alt="SMBC Logo" className="w-24 h-auto brightness-0 invert opacity-90" />
              <div>
                <h2 className="font-serif text-2xl font-bold tracking-wide">Sitti Medical and Business College</h2>
                <p className="font-sans text-gray-400 font-light mt-1">Defined by Excellence. Dedicated to Leadership.</p>
              </div>
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            
            {/* Contact */}
            <div>
              <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-gray-400 font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-4 font-sans font-light">
                <li>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors group">
                    <Mail size={16} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors group">
                    <Phone size={16} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                    {contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <MapPin size={16} className="text-[#D4AF37]" />
                  {contact.location}
                </li>
              </ul>
            </div>

            {/* Navigation Pillars */}
            <div>
              <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-gray-400 font-semibold mb-6">Explore</h3>
              <ul className="space-y-3 font-sans">
                {navPillars.map((pillar) => (
                  <li key={pillar}>
                    <a 
                      href={getPillarHref(pillar)}
                      onClick={(e) => handleNavClick(e, pillar)}
                      className="text-white hover:text-[#D4AF37] transition-colors duration-300 inline-block font-light"
                    >
                      {pillar}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-gray-400 font-semibold mb-6">Connect</h3>
              <ul className="space-y-4 font-sans">
                {socials.map((social) => {
                  const Icon = socialIcons[social.platform];
                  return (
                    <li key={social.platform}>
                      <a href={social.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 group text-white hover:text-[#D4AF37] transition-colors duration-300">
                        {Icon && <Icon className="w-5 h-5 text-white group-hover:text-[#D4AF37] transition-colors duration-300" />}
                        <span className="font-sans font-light">{social.platform}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/10 mb-8" />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-sans text-xs text-gray-500 font-light">
            <p>© 2026 Sitti Medical and Business College. All rights reserved.</p>
            <p>{contact.location}</p>
          </div>

        </div>
      </footer>
    </>
  );
}
