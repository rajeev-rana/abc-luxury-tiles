"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { products } from '@/data/products';
import GlassCard from '@/components/GlassCard';
import { Search, Filter, Mic, Grid, List, RefreshCw } from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL parameters
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  // Filter States
  const [searchVal, setSearchVal] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFinish, setSelectedFinish] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedUsage, setSelectedUsage] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('popular');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Load URL changes
  useEffect(() => {
    setSearchVal(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Search query
    if (searchVal) {
      const q = searchVal.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Finish filter
    if (selectedFinish) {
      result = result.filter(p => p.finish.toLowerCase().includes(selectedFinish.toLowerCase()));
    }

    // Brand filter
    if (selectedBrand) {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Usage application filter
    if (selectedUsage) {
      result = result.filter(p => p.applications.includes(selectedUsage));
    }

    // Price filter
    result = result.filter(p => (p.discountPrice || p.price) <= maxPrice);

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.isNewArrival - a.isNewArrival);
    }

    setFilteredProducts(result);

  }, [searchVal, selectedCategory, selectedFinish, selectedBrand, selectedUsage, maxPrice, sortBy]);

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => alert("Listening... Speak category, brand name, or tile color.");
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchVal(transcript);
        router.push(`/catalog?search=${encodeURIComponent(transcript)}`);
      };
      recognition.start();
    } else {
      alert("Speech Recognition not supported in your browser.");
    }
  };

  const handleClearFilters = () => {
    setSearchVal('');
    setSelectedCategory('');
    setSelectedFinish('');
    setSelectedBrand('');
    setSelectedUsage('');
    setMaxPrice(10000);
    setSortBy('popular');
    router.push('/catalog');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Filter Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
              <span className="font-serif text-sm font-bold text-charcoal-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Filter size={14} /> Filter Options
              </span>
              <button 
                onClick={handleClearFilters}
                className="text-[10px] text-gold uppercase tracking-wider font-semibold border-b border-gold"
              >
                Clear All
              </button>
            </div>

            {/* Keyword Search */}
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Search Catalog</label>
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search item..."
                  className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold pr-10"
                />
                <button 
                  onClick={handleVoiceSearch}
                  className="absolute right-2 text-charcoal-600 dark:text-charcoal-400 hover:text-gold p-1"
                  title="Voice Search"
                >
                  <Mic size={14} />
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold"
              >
                <option value="">All Categories</option>
                {['Ceramic Tiles', 'Vitrified Tiles', 'GVT Tiles', 'Granite', 'Marble', 'Sanitaryware', 'Faucets'].map(cat => (
                  <option key={cat} value={cat} className="dark:bg-charcoal-900 text-black dark:text-white">{cat}</option>
                ))}
              </select>
            </div>

            {/* Finish Filter */}
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Finish</label>
              <select 
                value={selectedFinish}
                onChange={(e) => setSelectedFinish(e.target.value)}
                className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold"
              >
                <option value="">All Finishes</option>
                {['Polished', 'Matt', 'Glazed', 'Rustic', 'Satin'].map(f => (
                  <option key={f} value={f} className="dark:bg-charcoal-900 text-black dark:text-white">{f}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Brand</label>
              <select 
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold"
              >
                <option value="">All Brands</option>
                {['ABC Luxury', 'ABC Premium Imports', 'ABC Stone', 'ABC Sanitaryware'].map(b => (
                  <option key={b} value={b} className="dark:bg-charcoal-900 text-black dark:text-white">{b}</option>
                ))}
              </select>
            </div>

            {/* Usage Filter */}
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Recommended Application</label>
              <select 
                value={selectedUsage}
                onChange={(e) => setSelectedUsage(e.target.value)}
                className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold"
              >
                <option value="">All Applications</option>
                {['Living Room', 'Bathroom', 'Kitchen', 'Outdoor', 'Parking', 'Floor', 'Wall'].map(u => (
                  <option key={u} value={u} className="dark:bg-charcoal-900 text-black dark:text-white">{u}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Max Price: ₹{maxPrice}</label>
              <input 
                type="range" 
                min="500" 
                max="10000" 
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold bg-white/10 h-1 rounded-full cursor-pointer"
              />
            </div>

          </div>
        </aside>

        {/* Right Side: Product Grid */}
        <section className="flex-grow space-y-6">
          
          {/* Grid Header Controls */}
          <div className="glass-panel p-4 rounded-xl border border-gold/15 dark:border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <span className="text-charcoal-600 dark:text-charcoal-400">
              Showing <strong className="text-charcoal-900 dark:text-white font-bold">{filteredProducts.length}</strong> matching products
            </span>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-charcoal-600 dark:text-charcoal-400">Sort By:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/5 dark:bg-black/20 border border-white/10 rounded px-2.5 py-1 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold font-semibold"
                >
                  <option value="popular" className="dark:bg-charcoal-900 text-black dark:text-white">Popularity</option>
                  <option value="price-low" className="dark:bg-charcoal-900 text-black dark:text-white">Price: Low to High</option>
                  <option value="price-high" className="dark:bg-charcoal-900 text-black dark:text-white">Price: High to Low</option>
                  <option value="newest" className="dark:bg-charcoal-900 text-black dark:text-white">New Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Catalog grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(p => (
                <div key={p.id}>
                  <GlassCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-16 text-center border border-dashed border-gold/30">
              <span className="text-4xl mb-4 block">🔍</span>
              <h3 className="font-serif text-lg font-bold text-charcoal-900 dark:text-white">No products found</h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2 max-w-sm mx-auto">
                No inventory aligns with the active filter. Try search keywords like "PGVT", "Waterfall", or clear all filters.
              </p>
              <button 
                onClick={handleClearFilters}
                className="mt-6 gold-gradient-btn text-black text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded shadow"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-gold font-serif">
        Loading Luxury Catalog...
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
