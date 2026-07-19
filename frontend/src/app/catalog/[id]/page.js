"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { useApp } from '@/context/AppContext';
import GlassCard from '@/components/GlassCard';
import { 
  Heart, ShoppingCart, MessageCircle, Phone, FileText, 
  RotateCw, ZoomIn, Check, Info, ArrowLeft, Shield
} from 'lucide-react';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [showInquiryDrawer, setShowInquiryDrawer] = useState(false);
  
  // Inquiry form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('I am interested in this product and would like a custom quote.');

  useEffect(() => {
    const found = products.find(p => p.id === params.id);
    if (found) {
      setProduct(found);
    }
  }, [params.id]);

  // Autoplay 360 viewer simulation
  useEffect(() => {
    let timer;
    if (is360Mode && product) {
      timer = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % product.images.length);
      }, 800);
    }
    return () => clearInterval(timer);
  }, [is360Mode, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-gold font-serif">
        Loading Product Specifications...
      </div>
    );
  }

  const favorited = isInWishlist(product.id);
  const recommendedProducts = products.filter(p => p.category === product.category && p.id !== product.id);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    alert(`Quotation request submitted!\nOur B2B manager will contact you at ${inquiryPhone} shortly.`);
    setShowInquiryDrawer(false);
  };

  const handleVisitNow = () => {
    window.open("https://maps.google.com/?q=ABC+Tiles+and+Ceramics+Showroom+Mumbai", "_blank");
  };

  const handleDownloadBrochure = () => {
    alert(`Downloading premium PDF technical sheet for SKU: ${product.sku}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Back Button */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-1.5 text-xs text-gold uppercase tracking-wider font-bold hover:text-gold-light"
      >
        <ArrowLeft size={14} /> Back to Catalog
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Image Canvas Slider */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden glass-panel border border-gold/15 dark:border-gold/10 flex items-center justify-center bg-charcoal-100 dark:bg-charcoal-900 group">
            
            {/* Active Image */}
            <img 
              src={product.images[activeImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-all"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1">
              {product.isFeatured && <span className="bg-gold text-black text-[9px] font-bold px-2 py-0.5 rounded">Featured</span>}
              {product.isNewArrival && <span className="bg-black dark:bg-white text-white dark:text-black text-[9px] font-bold px-2 py-0.5 rounded">New</span>}
            </div>

            {/* Image Overlay Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button 
                onClick={() => setIs360Mode(!is360Mode)}
                className={`p-2 rounded-full backdrop-blur-md text-xs font-semibold flex items-center gap-1 border transition-all ${
                  is360Mode 
                    ? 'bg-gold border-gold text-black' 
                    : 'bg-black/60 border-white/20 text-white hover:bg-gold hover:text-black'
                }`}
                title="360 Rotation View"
              >
                <RotateCw size={14} className={is360Mode ? "animate-spin" : ""} /> 360°
              </button>
            </div>

          </div>

          {/* Thumbnails Row */}
          <div className="flex gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveImageIndex(idx); setIs360Mode(false); }}
                className={`w-20 aspect-square rounded-lg overflow-hidden border-2 bg-charcoal-200 dark:bg-charcoal-900 transition-all ${
                  idx === activeImageIndex ? 'border-gold scale-105' : 'border-transparent hover:border-gold/30'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">{product.category}</span>
            <h1 className="font-serif text-2xl sm:text-4xl font-black text-charcoal-900 dark:text-white mt-1 leading-tight">{product.name}</h1>
            <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2 font-semibold">SKU: {product.sku} | Brand: {product.brand}</p>
          </div>

          {/* Pricing Box */}
          <div className="glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10 flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400">Premium Pricing</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="font-serif text-2xl sm:text-3xl font-black text-gold">₹{product.discountPrice || product.price}</span>
                {product.discountPrice && (
                  <span className="text-sm text-charcoal-600 dark:text-charcoal-400 line-through">₹{product.price}</span>
                )}
                <span className="text-[10px] text-charcoal-600 dark:text-charcoal-400 font-semibold">/ Box</span>
              </div>
              <span className="text-[9px] text-green-500 font-bold block mt-1">Special Discount applied</span>
            </div>

            {/* Simulated EMI Options */}
            <div className="text-right border-l border-white/10 pl-4">
              <span className="text-[10px] uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400">Easy EMI Starts From</span>
              <p className="text-xs font-bold text-charcoal-900 dark:text-white mt-1">₹520 / Month</p>
              <span className="text-[9px] text-gold font-semibold block mt-0.5">3 & 6 Months No Cost EMI</span>
            </div>
          </div>

          {/* Product Description */}
          <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{product.description}</p>

          {/* Sizing Information */}
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Available Size</span>
            <span className="border border-gold/40 text-gold px-3.5 py-1.5 rounded text-xs font-bold block w-fit">
              {product.size}
            </span>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => addToCart(product, 1)}
              className="w-full bg-white/5 dark:bg-black/20 hover:bg-gold/15 border border-gold text-gold font-bold text-xs uppercase tracking-wider py-3.5 rounded flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingCart size={14} /> Add to Cart
            </button>
            <button 
              onClick={handleVisitNow}
              className="w-full gold-gradient-btn text-black font-bold text-xs uppercase tracking-wider py-3.5 rounded flex items-center justify-center gap-2 shadow"
            >
              Visit Now
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button 
              onClick={() => setShowInquiryDrawer(true)}
              className="bg-charcoal-900 hover:bg-charcoal-800 dark:bg-white/10 dark:hover:bg-white/20 border border-white/10 text-white text-center font-bold text-[10px] uppercase tracking-wider py-2.5 rounded transition-all"
            >
              Enquire / Request Quote
            </button>
            <button 
              onClick={handleDownloadBrochure}
              className="bg-transparent hover:border-gold hover:text-gold border border-white/15 text-charcoal-900 dark:text-white text-center font-bold text-[10px] uppercase tracking-wider py-2.5 rounded flex items-center justify-center gap-1.5 transition-all"
            >
              <FileText size={12} /> Download PDF
            </button>
          </div>

          {/* Direct Seller Contact Buttons */}
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <a 
              href="tel:+919876543210"
              className="flex-1 border border-white/15 rounded py-2 px-3 text-center text-xs text-charcoal-900 dark:text-white hover:text-gold hover:border-gold transition-colors flex items-center justify-center gap-1.5"
            >
              <Phone size={12} /> Call Seller
            </a>
            <a 
              href={`https://wa.me/919876543210?text=I'd like to ask about ${product.name}`}
              target="_blank"
              className="flex-1 bg-green-500 hover:bg-green-600 rounded py-2 px-3 text-center text-xs text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle size={12} className="fill-white stroke-none" /> WhatsApp Seller
            </a>
          </div>

        </div>

      </div>

      {/* Specifications & Documentation Table */}
      <div className="border-t border-gold/15 pt-12">
        <h3 className="font-serif text-2xl font-black text-charcoal-900 dark:text-white mb-6">Specifications & Guides</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Tech Spec List */}
          <div className="glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10">
            <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider border-b border-white/10 pb-2 mb-4">
              Technical Sheets
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-white/5">
                <span className="text-charcoal-600 dark:text-charcoal-400">Finish</span>
                <span className="font-bold">{product.finish}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-white/5">
                <span className="text-charcoal-600 dark:text-charcoal-400">Material</span>
                <span className="font-bold">{product.material}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-white/5">
                <span className="text-charcoal-600 dark:text-charcoal-400">Surface</span>
                <span className="font-bold">{product.surface}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-white/5">
                <span className="text-charcoal-600 dark:text-charcoal-400">Thickness</span>
                <span className="font-bold">{product.thickness}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-white/5">
                <span className="text-charcoal-600 dark:text-charcoal-400">Weight</span>
                <span className="font-bold">{product.weight}</span>
              </div>
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between pb-1.5 border-b border-white/5">
                  <span className="text-charcoal-600 dark:text-charcoal-400">{key}</span>
                  <span className="font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Guides */}
          <div className="space-y-6">
            
            <div className="glass-panel p-5 rounded-2xl border border-gold/15 dark:border-gold/10 text-xs">
              <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Shield size={14} /> Installation Guide
              </h4>
              <p className="text-charcoal-600 dark:text-charcoal-350 leading-relaxed font-light">
                {product.installationGuide}
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-gold/15 dark:border-gold/10 text-xs">
              <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info size={14} /> Maintenance & Cleaning
              </h4>
              <p className="text-charcoal-600 dark:text-charcoal-350 leading-relaxed font-light">
                {product.cleaningGuide}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* AI Recommendations */}
      {recommendedProducts.length > 0 && (
        <div className="border-t border-gold/15 pt-12">
          <h3 className="font-serif text-2xl font-black text-charcoal-900 dark:text-white mb-6">Frequently Bought Together</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.slice(0, 3).map(p => (
              <div key={p.id}>
                <GlassCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Modal / Drawer Overlay */}
      {showInquiryDrawer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-2xl border border-gold/25 relative text-charcoal-900 dark:text-white bg-white dark:bg-charcoal-950">
            <h3 className="font-serif text-xl font-bold mb-4">Request Quotation</h3>
            <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mb-6 leading-relaxed">
              Fill in your contact details below, and our business support representative will compile custom bulk pricing lists.
            </p>
            
            <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-gold block mb-1">Your Name</label>
                <input 
                  type="text" 
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gold block mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  required
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gold block mb-1">Message</label>
                <textarea 
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  rows="3"
                  className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowInquiryDrawer(false)}
                  className="flex-1 bg-transparent hover:bg-white/10 border border-white/10 py-2.5 rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 gold-gradient-btn text-black py-2.5 rounded text-xs font-bold uppercase tracking-wider"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
