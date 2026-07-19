"use client";
import React from 'react';
import { Award, ShieldCheck, Compass, Sparkles } from 'lucide-react';

export default function About() {
  const milestones = [
    { year: "2015", title: "Foundation", desc: "Established with a boutique imported slab showroom in Mumbai, catering to high-end residential interiors." },
    { year: "2018", title: "Manufacturing Tie-ups", desc: "Partnered with vitrified tile manufacturers in Morbi to build premium, high-density rectified flooring tiles." },
    { year: "2021", title: "Italian Marble Imports", desc: "Opened direct quarries import channels in Tuscany, Italy to source high-grade Statuario, Calacatta and Portoro." },
    { year: "2024", title: "Showroom Expansion", desc: "Inaugurated an elite 10,000 sq ft glassmorphic experience center displaying designer faucets and sanitaries." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. Header Banner */}
      <section className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold flex items-center justify-center gap-1.5">
          <Sparkles size={14} /> Our Heritage
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-wide text-charcoal-900 dark:text-white mt-2 leading-tight">
          Crafting Exquisite Spaces Since 2015
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 mt-4 leading-relaxed font-light">
          We believe walls and floors are not merely structures, but canvases for luxury and architecture. We procure the finest natural stones, high-density clay, and designer hardware to satisfy elite designers.
        </p>
      </section>

      {/* 2. Visual story block */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 
          alt="Luxury Experience Center" 
          className="rounded-2xl border border-gold/15 shadow-2xl object-cover aspect-video"
        />
        <div className="space-y-6 text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed font-light">
          <h2 className="font-serif text-2xl font-black text-charcoal-900 dark:text-white leading-tight">
             procurement and design excellence
          </h2>
          <p>
            Every block of natural Italian marble or absolute black granite is inspected at the quarry site by our geological team to ensure minimal micro-cracks and rich vein structures. Our vitrified tiles undergo high-pressure compaction and double-firing to resist impact chipping and acidic stains.
          </p>
          <p>
            By integrating advanced masonic tools with custom room visualizers, we support architects and builders from initial design concepts to final onsite tile laying.
          </p>
        </div>
      </section>

      {/* 3. Timeline milestones */}
      <section className="border-t border-gold/15 pt-12">
        <h3 className="font-serif text-xl sm:text-2xl font-black text-charcoal-900 dark:text-white text-center mb-10">Our Journey</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-gold/10">
              <span className="font-serif text-2xl font-extrabold text-gold">{m.year}</span>
              <h4 className="font-sans text-xs font-bold text-charcoal-900 dark:text-white mt-1 uppercase tracking-wider">{m.title}</h4>
              <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 mt-2 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Credentials and Quality Certs */}
      <section className="border-t border-gold/15 pt-12 text-center max-w-xl mx-auto space-y-6">
        <h3 className="font-serif text-xl sm:text-2xl font-black text-charcoal-900 dark:text-white">Certifications & Standards</h3>
        <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-white">
          <div className="flex flex-col items-center">
            <ShieldCheck size={32} className="text-gold mb-2" />
            <span>ISO 9001 Certified</span>
          </div>
          <div className="flex flex-col items-center">
            <Compass size={32} className="text-gold mb-2" />
            <span>CE Quality Standard</span>
          </div>
          <div className="flex flex-col items-center">
            <Sparkles size={32} className="text-gold mb-2" />
            <span>Green Building Rated</span>
          </div>
        </div>
      </section>

    </div>
  );
}
