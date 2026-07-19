"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, Heart, RefreshCw, Moon, Sun, 
  Menu, X, Search, User, Phone, MessageCircle, Mic, Image as ImageIcon
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { cart, wishlist, compare, theme, toggleTheme, user, logout } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [businessName, setBusinessName] = useState('ABC Tiles & Ceramics');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Read business name from localStorage if editable
    const storedName = localStorage.getItem('abc_business_name');
    if (storedName) setBusinessName(storedName);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => alert("Listening... Speak product category or tile finish.");
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        router.push(`/catalog?search=${encodeURIComponent(transcript)}`);
        setShowSearch(false);
      };
      recognition.start();
    } else {
      alert("Speech Recognition not supported in your browser.");
    }
  };

  return (
    <>
      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-panel shadow-md py-3' 
          : 'bg-white/10 dark:bg-black/10 backdrop-blur-sm py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex flex-col">
              <span className="font-serif font-bold text-lg sm:text-2xl tracking-widest text-charcoal-900 dark:text-white flex items-center gap-1">
                {businessName.split(' ')[0]} <span className="text-gold font-sans font-light">{businessName.split(' ').slice(1).join(' ')}</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-gold dark:text-gold-light mt-0.5">
                Building Beautiful Spaces
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 font-sans text-xs uppercase tracking-wider font-semibold">
              <Link href="/catalog" className="text-charcoal-900 dark:text-charcoal-100 hover:text-gold transition-colors">Products</Link>
              <Link href="/calculator" className="text-charcoal-900 dark:text-charcoal-100 hover:text-gold transition-colors">Tile Calculator</Link>
              <Link href="/visualizer" className="text-charcoal-900 dark:text-charcoal-100 hover:text-gold transition-colors">Visualizer</Link>
              <Link href="/compare" className="text-charcoal-900 dark:text-charcoal-100 hover:text-gold transition-colors flex items-center gap-1">
                Compare {compare.length > 0 && <span className="bg-gold text-black rounded-full px-1.5 py-0.5 text-[8px]">{compare.length}</span>}
              </Link>
              <Link href="/inquiry" className="text-charcoal-900 dark:text-charcoal-100 hover:text-gold transition-colors">Dealer Program</Link>
              <Link href="/about" className="text-charcoal-900 dark:text-charcoal-100 hover:text-gold transition-colors">About Us</Link>
            </nav>

            {/* Header Controls */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Toggle */}
              <button 
                onClick={() => setShowSearch(!showSearch)} 
                className="text-charcoal-900 dark:text-charcoal-100 hover:text-gold transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="text-charcoal-900 dark:text-charcoal-100 hover:text-gold transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Wishlist Link */}
              <Link href="/wishlist" className="relative text-charcoal-900 dark:text-charcoal-100 hover:text-gold transition-colors" aria-label="Wishlist">
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link href="/cart" className="relative text-charcoal-900 dark:text-charcoal-100 hover:text-gold transition-colors" aria-label="Cart">
                <ShoppingBag size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Link>

              {/* User Menu / Admin Dashboard Link */}
              {user ? (
                <div className="flex items-center gap-3">
                  <Link 
                    href={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    className="text-xs uppercase tracking-wider font-semibold border-b border-gold text-gold"
                  >
                    {user.role === 'admin' ? 'Admin' : 'Dashboard'}
                  </Link>
                  <button 
                    onClick={logout} 
                    className="hidden sm:inline text-[10px] uppercase tracking-wider bg-charcoal-900 dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-full hover:bg-gold transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-charcoal-900 dark:text-charcoal-100 hover:text-gold transition-colors" aria-label="User Account">
                  <User size={18} />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="lg:hidden text-charcoal-900 dark:text-charcoal-100 hover:text-gold transition-colors"
                aria-label="Menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isOpen && (
          <div className="lg:hidden glass-panel border-t border-white/10 mt-3 py-4 px-6 animate-fade-in absolute w-full left-0 right-0 bg-white/95 dark:bg-black/95">
            <nav className="flex flex-col space-y-4 font-sans text-xs uppercase tracking-wider font-semibold text-charcoal-900 dark:text-white">
              <Link href="/catalog" onClick={() => setIsOpen(false)} className="hover:text-gold">Products</Link>
              <Link href="/calculator" onClick={() => setIsOpen(false)} className="hover:text-gold">Tile Calculator</Link>
              <Link href="/visualizer" onClick={() => setIsOpen(false)} className="hover:text-gold">Visualizer</Link>
              <Link href="/compare" onClick={() => setIsOpen(false)} className="hover:text-gold">Compare Products ({compare.length})</Link>
              <Link href="/inquiry" onClick={() => setIsOpen(false)} className="hover:text-gold">Dealer Program</Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-gold">About Us</Link>
              {user && (
                <button 
                  onClick={() => { logout(); setIsOpen(false); }} 
                  className="w-full text-left text-red-500 uppercase font-semibold"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Floating Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <button 
            onClick={() => setShowSearch(false)} 
            className="absolute top-6 right-6 text-white hover:text-gold transition-colors"
          >
            <X size={28} />
          </button>
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search tiles, marble, sanitaryware (e.g. Statuario, PGVT)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-b-2 border-white/20 text-white font-sans text-lg sm:text-2xl py-3 px-2 focus:outline-none focus:border-gold transition-all pr-24"
              />
              <div className="absolute right-2 flex items-center space-x-2">
                <button 
                  type="button" 
                  onClick={handleVoiceSearch} 
                  className="text-white/60 hover:text-gold transition-colors p-2"
                  title="Voice Search"
                >
                  <Mic size={20} />
                </button>
                <button 
                  type="submit" 
                  className="bg-gold text-black rounded-full p-2.5 hover:bg-gold-dark transition-colors"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
            <div className="mt-4 text-xs text-white/50 flex flex-wrap gap-2 items-center">
              <span>Try searching:</span>
              {['Vitrified', 'Marble', 'Waterfall Faucet', 'Polished'].map(kw => (
                <button 
                  key={kw} 
                  onClick={() => { setSearchQuery(kw); router.push(`/catalog?search=${kw}`); setShowSearch(false); }}
                  className="border border-white/20 px-2 py-0.5 rounded-full hover:border-gold hover:text-gold transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
