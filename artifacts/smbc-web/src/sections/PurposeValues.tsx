import React from "react";
import { Shield, Laptop, Lightbulb, TrendingUp } from "lucide-react";
import { siteData } from "@/constants/data";

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Laptop,
  Lightbulb,
  TrendingUp,
};

export function PurposeValues() {
  return (
    <section id="about" className="w-full bg-white py-16 md:py-24 px-4 sm:px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#1E3A8A] text-xs font-semibold tracking-widest uppercase block mb-4">
            About Us
          </span>
          <h2 className="font-serif text-[#1E3A8A] text-4xl md:text-5xl font-bold">
            Vision, Mission, and Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {siteData.purposeCards.map((card, index) => {
            const Icon = iconMap[card.icon];
            return (
              <div 
                key={index}
                className="group bg-white p-6 sm:p-8 border-b-4 border-transparent hover:border-[#D4AF37] transition-all duration-300 shadow-[0_4px_20px_rgba(30,58,138,0.05)] hover:shadow-[0_10px_30px_rgba(30,58,138,0.1)] hover:-translate-y-1 flex flex-col items-start"
              >
                <div className="mb-6 text-[#1E3A8A] transition-transform duration-300 group-hover:scale-105">
                  {Icon && <Icon size={40} strokeWidth={1.5} />}
                </div>
                <h3 className="font-serif text-2xl text-[#1E3A8A] font-bold mb-4">
                  {card.title}
                </h3>
                <p className="font-sans text-gray-600 leading-relaxed font-light">
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
