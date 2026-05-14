import React from "react";
import { siteData } from "@/constants/data";

export function AboutSection() {
  return (
    <section className="w-full bg-white py-24 px-4 sm:px-8 md:px-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column */}
          <div className="w-full lg:w-1/2">
            <span className="text-[#1E3A8A] text-xs font-semibold tracking-widest uppercase block mb-6">
              Our Legacy
            </span>
            <h2 className="font-serif text-[#1E3A8A] text-4xl md:text-5xl font-bold mb-8 leading-tight">
              About the College
            </h2>
            <p className="font-sans text-gray-600 text-lg leading-relaxed font-light mb-12">
              {siteData.about.story}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
              {siteData.about.departments.map((dept, index) => (
                <div key={index} className="pl-6 border-l-4 border-[#1E3A8A]">
                  <h4 className="font-serif text-xl text-[#1E3A8A] font-bold mb-2">{dept.title}</h4>
                  <p className="font-sans text-gray-500 text-sm leading-relaxed">{dept.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="bg-gray-50 p-10 md:p-16 border-l-4 border-[#D4AF37]">
              <div className="mb-6">
                <span className="font-serif text-6xl md:text-8xl text-[#D4AF37] font-bold block leading-none">
                  {siteData.about.foundedYear}
                </span>
                <span className="text-[#1E3A8A] font-sans tracking-widest uppercase text-sm font-semibold mt-2 block">
                  Year Founded
                </span>
              </div>
              
              <div className="mt-12">
                <p className="font-serif text-2xl text-[#1E3A8A] italic leading-relaxed mb-6">
                  "{siteData.about.founderQuote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
                  <span className="font-sans text-[#1E3A8A] font-semibold tracking-wider uppercase text-sm">
                    {siteData.about.founder}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
