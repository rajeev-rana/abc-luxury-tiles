"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, Eye, HelpCircle, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { products } from '@/data/products';
import GlassCard from '@/components/GlassCard';

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    title: "Timeless Italian Statuario",
    subtitle: "Reimagine floors with vitrified mirror finishes that mirror the palaces of Carrara."
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    title: "Brushed Gold Sanitaryware",
    subtitle: "Precision engineering meets 24k gold physical vapor deposition plating."
  },
  {
    image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1600&q=80",
    title: "Intense Golden Portoro Marble",
    subtitle: "Deep charcoal veins woven with rivers of solid honey amber natural quartz."
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const featuredCategories = [
    { name: "Ceramic Tiles", count: 42, icon: "🏺", query: "Ceramic+Tiles" },
    { name: "Vitrified Tiles", count: 128, icon: "💎", query: "Vitrified+Tiles" },
    { name: "GVT & PGVT Tiles", count: 96, icon: "✨", query: "GVT+Tiles" },
    { name: "Granite", count: 35, icon: "⛰️", query: "Granite" },
    { name: "Marble", count: 50, icon: "🏛️", query: "Marble" },
    { name: "Sanitaryware", count: 68, icon: "🚽", query: "Sanitaryware" },
    { name: "Designer Faucets", count: 85, icon: "🚰", query: "Faucets" },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Banner Slider */}
      <section className="relative h-[85vh] overflow-hidden flex items-center justify-center">
        {/* Background Slide Images */}
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/45 z-10" />
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover scale-105 transition-transform duration-[6000ms] ease-out"
            />
          </div>
        ))}

        {/* Hero Slider Text (Glassmorphic Card) */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <div className="glass-panel p-8 sm:p-12 rounded-2xl border border-white/20 shadow-2xl max-w-3xl mx-auto text-white">
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold mb-3 block">
              Exclusive Luxury Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-wide mb-4 leading-tight">
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <p className="text-sm sm:text-base text-charcoal-200 font-light mb-8 max-w-xl mx-auto leading-relaxed">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>
            
            {/* CTA Controls */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/catalog" 
                className="gold-gradient-btn text-black font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full flex items-center gap-1.5 shadow-lg"
              >
                Explore Products <ArrowRight size={14} />
              </Link>
              <Link 
                href="/calculator" 
                className="bg-white/10 hover:bg-white/25 border border-white/30 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full flex items-center gap-1.5 transition-all"
              >
                Get Estimate <Calculator size={14} />
              </Link>
              <Link 
                href="/visualizer" 
                className="bg-transparent hover:bg-gold/20 border border-gold text-gold font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full flex items-center gap-1.5 transition-all"
              >
                AR Room visualizer <Eye size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-2">
          {HERO_SLIDES.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentSlide ? 'bg-gold w-8' : 'bg-white/40'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl font-black tracking-wide text-charcoal-900 dark:text-white mt-2">
            Featured Categories
          </h2>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2">
            Select an elite material class to browse corresponding size specs and textures.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {featuredCategories.map((cat, idx) => (
            <Link 
              key={idx}
              href={`/catalog?category=${cat.query}`}
              className="glass-card flex flex-col items-center justify-center p-6 text-center border border-gold/10 group hover:border-gold"
            >
              <span className="text-3xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
                {cat.icon}
              </span>
              <h3 className="font-sans text-xs font-bold text-charcoal-900 dark:text-white group-hover:text-gold transition-colors leading-tight">
                {cat.name}
              </h3>
              <span className="text-[10px] text-charcoal-600 dark:text-charcoal-400 mt-1">
                {cat.count} Designs
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Visualizer Teaser (Before/After Section) */}
      <section className="bg-charcoal-950 text-white py-16 border-y border-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                Interactive Design Tools
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black tracking-wide leading-tight">
                Preview Tiles in Your Own Room Instantly
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-400 leading-relaxed font-light">
                Our advanced room overlay visualizer lets you upload an image of your living room, kitchen, or parking area, or choose from our ultra-luxury showroom templates to swap out vitrified flooring and marble walls.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link 
                  href="/visualizer" 
                  className="gold-gradient-btn text-black text-center font-bold text-xs uppercase tracking-wider px-6 py-3 rounded"
                >
                  Launch Room Visualizer
                </Link>
                <Link 
                  href="/calculator" 
                  className="border border-white/20 hover:border-gold hover:text-gold text-center text-xs font-bold uppercase tracking-wider px-6 py-3 rounded transition-colors"
                >
                  Estimate Box Quantities
                </Link>
              </div>
            </div>

            {/* Simulated Before/After room mockup */}
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" 
                alt="Room Visualizer Preview"
                className="w-full h-full object-cover"
              />
              {/* Slit divide */}
              <div className="absolute inset-y-0 left-1/2 w-1 bg-gold shadow-lg z-10">
                <span className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-gold text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                  ↔
                </span>
              </div>
              <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm text-xs px-3 py-1 rounded text-white border border-white/10">
                Before: Plain Concrete
              </div>
              <div className="absolute top-4 right-4 z-10 bg-gold/90 text-xs px-3 py-1 rounded text-black font-semibold">
                After: Statuario Gold PGVT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trending & Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-end justify-between mb-12">
          <div className="max-w-md">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              Trending Designs
            </span>
            <h2 className="font-serif text-3xl font-black tracking-wide text-charcoal-900 dark:text-white mt-1">
              New Arrivals & Best Sellers
            </h2>
          </div>
          <Link 
            href="/catalog" 
            className="text-xs font-bold text-gold uppercase tracking-wider border-b border-gold hover:text-gold-light pb-0.5 mt-4 sm:mt-0"
          >
            Browse Full Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product) => (
            <div key={product.id}>
              <GlassCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Trust Badges / Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gold/15">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="flex gap-4">
            <span className="bg-gold/10 text-gold p-3 rounded-xl h-fit">
              <Sparkles size={24} />
            </span>
            <div>
              <h3 className="font-serif text-sm font-bold text-charcoal-900 dark:text-white">Premium Quality</h3>
              <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 mt-1 leading-relaxed">
                Imported Italian clay and high density physical vapor deposition faucet coating.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="bg-gold/10 text-gold p-3 rounded-xl h-fit">
              <Calculator size={24} />
            </span>
            <div>
              <h3 className="font-serif text-sm font-bold text-charcoal-900 dark:text-white">Smart Calculator</h3>
              <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 mt-1 leading-relaxed">
                Add waste padding margins and estimate boxes in standard feet or meters.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="bg-gold/10 text-gold p-3 rounded-xl h-fit">
              <ShieldCheck size={24} />
            </span>
            <div>
              <h3 className="font-serif text-sm font-bold text-charcoal-900 dark:text-white">Certified Materials</h3>
              <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 mt-1 leading-relaxed">
                ISO certified tiles with high abrasion ratings and crack resistance.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="bg-gold/10 text-gold p-3 rounded-xl h-fit">
              <Award size={24} />
            </span>
            <div>
              <h3 className="font-serif text-sm font-bold text-charcoal-900 dark:text-white">Loyalty Points</h3>
              <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 mt-1 leading-relaxed">
                Every purchase awards loyalty points redeemable for premium design brochures.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
