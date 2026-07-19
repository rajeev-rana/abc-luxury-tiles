"use client";
import React from 'react';
import { useApp } from '@/context/AppContext';
import { RefreshCw, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CompareProducts() {
  const { compare, removeFromCompare, addToCart } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold flex items-center justify-center gap-1.5">
          <RefreshCw size={14} /> Comparative Analysis
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-wide text-charcoal-900 dark:text-white mt-2">
          Compare Products
        </h1>
        <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2">
          Compare thickness metrics, surface finishes, warranty spans, and price lists for up to four materials simultaneously.
        </p>
      </div>

      {compare.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-[800px] bg-white/5 dark:bg-black/10 border border-gold/15 dark:border-gold/10 rounded-2xl p-6">
            
            {/* Headers row */}
            <div className="grid grid-cols-5 gap-6 border-b border-white/10 pb-6 mb-6">
              <div className="flex flex-col justify-end">
                <span className="text-xs text-charcoal-600 dark:text-charcoal-400">Comparing</span>
                <strong className="text-sm text-gold font-serif font-bold uppercase">{compare.length} Selected items</strong>
              </div>

              {compare.map(item => (
                <div key={item.id} className="relative flex flex-col justify-between p-2 glass-panel rounded-xl group border border-white/5">
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCompare(item.id)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-650 text-white rounded-full p-1.5 shadow"
                    title="Remove item"
                  >
                    <Trash2 size={12} />
                  </button>

                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full aspect-square object-cover rounded-lg mb-3" 
                  />
                  <h3 className="font-serif text-xs font-bold text-charcoal-900 dark:text-white line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="text-[9px] text-gold uppercase tracking-wider font-semibold block mt-0.5">
                    {item.category}
                  </span>
                  
                  <button 
                    onClick={() => addToCart(item, 1)}
                    className="mt-3 bg-gold text-black font-semibold text-[9px] uppercase tracking-wider py-1.5 rounded"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}

              {/* Pad empty columns if less than 4 */}
              {Array.from({ length: 4 - compare.length }).map((_, idx) => (
                <div key={idx} className="border border-dashed border-white/10 rounded-xl flex items-center justify-center text-center p-6 text-charcoal-600">
                  <div className="text-center text-xs">
                    <p>Empty slot</p>
                    <Link href="/catalog" className="text-gold border-b border-gold mt-2 inline-block">Add Tile</Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Spec breakdown rows */}
            <div className="space-y-4 text-xs">
              
              {/* Category */}
              <div className="grid grid-cols-5 gap-6 border-b border-white/5 pb-2">
                <span className="text-charcoal-600 dark:text-charcoal-400 font-bold">Category</span>
                {compare.map(item => <span key={item.id} className="font-semibold text-charcoal-900 dark:text-white">{item.category}</span>)}
                {Array.from({ length: 4 - compare.length }).map((_, i) => <span key={i} className="text-charcoal-600">-</span>)}
              </div>

              {/* Brand */}
              <div className="grid grid-cols-5 gap-6 border-b border-white/5 pb-2">
                <span className="text-charcoal-600 dark:text-charcoal-400 font-bold">Brand</span>
                {compare.map(item => <span key={item.id} className="text-charcoal-900 dark:text-white">{item.brand}</span>)}
                {Array.from({ length: 4 - compare.length }).map((_, i) => <span key={i} className="text-charcoal-600">-</span>)}
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-5 gap-6 border-b border-white/5 pb-2">
                <span className="text-charcoal-600 dark:text-charcoal-400 font-bold">Price</span>
                {compare.map(item => (
                  <span key={item.id} className="font-bold text-gold">
                    ₹{item.discountPrice || item.price} <span className="text-[9px] text-charcoal-600 dark:text-charcoal-400">/ box</span>
                  </span>
                ))}
                {Array.from({ length: 4 - compare.length }).map((_, i) => <span key={i} className="text-charcoal-600">-</span>)}
              </div>

              {/* Finish */}
              <div className="grid grid-cols-5 gap-6 border-b border-white/5 pb-2">
                <span className="text-charcoal-600 dark:text-charcoal-400 font-bold">Finish</span>
                {compare.map(item => <span key={item.id} className="text-charcoal-900 dark:text-white">{item.finish || 'N/A'}</span>)}
                {Array.from({ length: 4 - compare.length }).map((_, i) => <span key={i} className="text-charcoal-600">-</span>)}
              </div>

              {/* Material */}
              <div className="grid grid-cols-5 gap-6 border-b border-white/5 pb-2">
                <span className="text-charcoal-600 dark:text-charcoal-400 font-bold">Material</span>
                {compare.map(item => <span key={item.id} className="text-charcoal-900 dark:text-white">{item.material || 'N/A'}</span>)}
                {Array.from({ length: 4 - compare.length }).map((_, i) => <span key={i} className="text-charcoal-600">-</span>)}
              </div>

              {/* Size */}
              <div className="grid grid-cols-5 gap-6 border-b border-white/5 pb-2">
                <span className="text-charcoal-600 dark:text-charcoal-400 font-bold">Dimensions</span>
                {compare.map(item => <span key={item.id} className="text-charcoal-900 dark:text-white">{item.size}</span>)}
                {Array.from({ length: 4 - compare.length }).map((_, i) => <span key={i} className="text-charcoal-600">-</span>)}
              </div>

              {/* Thickness */}
              <div className="grid grid-cols-5 gap-6 border-b border-white/5 pb-2">
                <span className="text-charcoal-600 dark:text-charcoal-400 font-bold">Thickness</span>
                {compare.map(item => <span key={item.id} className="text-charcoal-900 dark:text-white">{item.thickness || 'N/A'}</span>)}
                {Array.from({ length: 4 - compare.length }).map((_, i) => <span key={i} className="text-charcoal-600">-</span>)}
              </div>

              {/* Warranty */}
              <div className="grid grid-cols-5 gap-6 border-b border-white/5 pb-2">
                <span className="text-charcoal-600 dark:text-charcoal-400 font-bold">Warranty</span>
                {compare.map(item => <span key={item.id} className="text-charcoal-900 dark:text-white">{item.warranty || 'N/A'}</span>)}
                {Array.from({ length: 4 - compare.length }).map((_, i) => <span key={i} className="text-charcoal-600">-</span>)}
              </div>

              {/* Stock Status */}
              <div className="grid grid-cols-5 gap-6 pb-2">
                <span className="text-charcoal-600 dark:text-charcoal-400 font-bold">Availability</span>
                {compare.map(item => (
                  <span key={item.id} className={`font-bold ${item.stockStatus === 'In Stock' ? 'text-green-500' : 'text-red-500'}`}>
                    {item.stockStatus}
                  </span>
                ))}
                {Array.from({ length: 4 - compare.length }).map((_, i) => <span key={i} className="text-charcoal-600">-</span>)}
              </div>

            </div>

          </div>
        </div>
      ) : (
        <div className="glass-panel max-w-xl mx-auto rounded-2xl p-16 text-center border border-dashed border-gold/30">
          <span className="text-4xl mb-4 block">⚖️</span>
          <h3 className="font-serif text-lg font-bold text-charcoal-900 dark:text-white">Comparison board is empty</h3>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2 max-w-sm mx-auto">
            You haven't selected any items. Browse our catalogs and tap the scale icon to compare vitrified flooring side-by-side.
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
