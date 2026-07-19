"use client";
import React from 'react';
import { useApp } from '@/context/AppContext';
import GlassCard from '@/components/GlassCard';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Wishlist() {
  const { wishlist } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold flex items-center justify-center gap-1.5">
          <Heart size={14} className="fill-gold stroke-none" /> Saved Items
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-wide text-charcoal-900 dark:text-white mt-2">
          Your Wishlist
        </h1>
        <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2">
          Review your favorited vitrified designs, imported marble slabs, and designer faucet fittings.
        </p>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(p => (
            <div key={p.id}>
              <GlassCard product={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel max-w-xl mx-auto rounded-2xl p-16 text-center border border-dashed border-gold/30">
          <span className="text-4xl mb-4 block">❤️</span>
          <h3 className="font-serif text-lg font-bold text-charcoal-900 dark:text-white">Your wishlist is empty</h3>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2 max-w-sm mx-auto">
            Save designs you love while browsing to access them easily here, calculate installation areas, or request bulk trade quotes.
          </p>
          <Link 
            href="/catalog" 
            className="mt-6 gold-gradient-btn text-black text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded shadow inline-flex items-center gap-1.5"
          >
            Explore Catalog <ArrowRight size={14} />
          </Link>
        </div>
      )}

    </div>
  );
}
