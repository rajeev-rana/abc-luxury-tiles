"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Thank you for subscribing! Exquisite tile catalogs and style trends will be delivered to ${email}.`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-charcoal-950 text-white font-sans border-t border-gold/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-white/10 pb-12">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex flex-col mb-4">
              <span className="font-serif font-bold text-xl tracking-widest text-white">
                ABC <span className="text-gold font-sans font-light">Tiles & Ceramics</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-gold mt-0.5">
                Building Beautiful Spaces
              </span>
            </Link>
            <p className="text-xs text-charcoal-400 max-w-sm leading-relaxed mb-6">
              Experience absolute luxury. Importing raw materials, high-density vitrified porcelain tiles, Italian marble blocks, and brushed-gold sanitaryware to build elite residences and architectural statements.
            </p>
            <div className="flex space-x-4">
              {/* Instagram SVG */}
              <a href="#" className="border border-white/10 hover:border-gold hover:text-gold p-2.5 rounded-full transition-colors flex items-center justify-center" aria-label="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* Facebook SVG */}
              <a href="#" className="border border-white/10 hover:border-gold hover:text-gold p-2.5 rounded-full transition-colors flex items-center justify-center" aria-label="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h3v-9h2.72l.42-3H12V6c0-.9.2-1.2 1-1.2h2V1h-3c-3 0-5 1.8-5 5v2z"/>
                </svg>
              </a>
              {/* LinkedIn SVG */}
              <a href="#" className="border border-white/10 hover:border-gold hover:text-gold p-2.5 rounded-full transition-colors flex items-center justify-center" aria-label="LinkedIn">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-gold/40 pb-2 mb-4 text-gold-light">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li><Link href="/catalog" className="hover:text-gold transition-colors">Product Catalog</Link></li>
              <li><Link href="/calculator" className="hover:text-gold transition-colors">Tile Calculator</Link></li>
              <li><Link href="/visualizer" className="hover:text-gold transition-colors">AR Visualizer</Link></li>
              <li><Link href="/inquiry" className="hover:text-gold transition-colors">Become Dealer</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">Company Story</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-gold/40 pb-2 mb-4 text-gold-light">
              Categories
            </h3>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li><Link href="/catalog?category=Vitrified+Tiles" className="hover:text-gold transition-colors">Vitrified Tiles</Link></li>
              <li><Link href="/catalog?category=Granite" className="hover:text-gold transition-colors">Granite Slabs</Link></li>
              <li><Link href="/catalog?category=Marble" className="hover:text-gold transition-colors">Imported Marble</Link></li>
              <li><Link href="/catalog?category=Faucets" className="hover:text-gold transition-colors">Designer Faucets</Link></li>
              <li><Link href="/catalog?category=Wash+Basin" className="hover:text-gold transition-colors">Luxury Wash Basins</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-gold/40 pb-2 mb-4 text-gold-light">
              Newsletter
            </h3>
            <p className="text-xs text-charcoal-400 leading-relaxed mb-4">
              Subscribe to receive latest interior trends, architecture digests, and new catalog collections.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-charcoal-900 border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-charcoal-400 focus:outline-none focus:border-gold"
                />
              </div>
              <button 
                type="submit" 
                className="bg-gold text-black px-4 py-2 rounded text-xs font-semibold hover:bg-gold-dark transition-colors flex items-center justify-center gap-1.5"
              >
                Join <ArrowRight size={12} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-charcoal-500">
          <p>© {new Date().getFullYear()} ABC Tiles & Ceramics. All Rights Reserved. Designed for Luxury.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/policies/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/policies/refund" className="hover:text-gold transition-colors">Refund Policy</Link>
            <Link href="/policies/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
