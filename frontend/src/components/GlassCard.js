"use client";
import React from 'react';
import Link from 'next/link';
import { Heart, RefreshCw, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function GlassCard({ product }) {
  const { toggleWishlist, isInWishlist, addToCompare, isInCompare, removeFromCompare } = useApp();
  
  const favorited = isInWishlist(product.id);
  const compared = isInCompare(product.id);

  const handleCompareClick = (e) => {
    e.preventDefault();
    if (compared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <div className="glass-card relative flex flex-col justify-between overflow-hidden h-full group p-4 border border-gold/15 dark:border-gold/10">
      
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1.5">
        {product.isFeatured && (
          <span className="bg-gold text-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
            Featured
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-black dark:bg-white text-white dark:text-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
            New Arrival
          </span>
        )}
        {product.isTrending && (
          <span className="bg-charcoal-700 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-gold/20">
            Trending
          </span>
        )}
      </div>

      {/* Floating Action Icons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col space-y-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button 
          onClick={handleFavoriteClick}
          className={`p-2 rounded-full backdrop-blur-md border border-white/20 transition-all ${
            favorited 
              ? 'bg-red-500 text-white border-none' 
              : 'bg-white/80 dark:bg-black/80 text-charcoal-900 dark:text-white hover:text-red-500'
          }`}
          title="Add to Wishlist"
        >
          <Heart size={14} className={favorited ? "fill-white" : ""} />
        </button>

        <button 
          onClick={handleCompareClick}
          className={`p-2 rounded-full backdrop-blur-md border border-white/20 transition-all ${
            compared 
              ? 'bg-gold text-black border-none' 
              : 'bg-white/80 dark:bg-black/80 text-charcoal-900 dark:text-white hover:text-gold'
          }`}
          title="Compare Product"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Product Image Area */}
      <Link href={`/catalog/${product.id}`} className="relative block overflow-hidden rounded-lg aspect-square mb-4 bg-charcoal-100 dark:bg-charcoal-900">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
          <span className="bg-white text-black text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={14} /> View Details
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gold font-semibold">
            {product.category}
          </span>
          <Link href={`/catalog/${product.id}`}>
            <h3 className="font-serif text-sm sm:text-base font-bold text-charcoal-900 dark:text-white mt-1 group-hover:text-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <div className="flex items-baseline space-x-1.5">
                <span className="text-sm sm:text-base font-bold text-charcoal-900 dark:text-white">
                  ₹{product.discountPrice}
                </span>
                <span className="text-[10px] sm:text-xs text-charcoal-600 dark:text-charcoal-400 line-through">
                  ₹{product.price}
                </span>
              </div>
            ) : (
              <span className="text-sm sm:text-base font-bold text-charcoal-900 dark:text-white">
                ₹{product.price}
              </span>
            )}
            <span className="text-[9px] text-charcoal-600 dark:text-charcoal-400">
              Per Unit / Box
            </span>
          </div>

          <Link 
            href={`/catalog/${product.id}`}
            className="text-[10px] uppercase font-bold tracking-wider border-b border-gold text-gold hover:text-gold-light hover:border-gold-light transition-all pb-0.5"
          >
            Details
          </Link>
        </div>
      </div>

    </div>
  );
}
