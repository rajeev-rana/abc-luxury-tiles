"use client";
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, Trash2, ShieldCheck, ArrowRight, CreditCard, Send, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function Cart() {
  const { cart, updateCartQty, removeFromCart, clearCart, user } = useApp();
  
  // Checkout states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [gstin, setGstin] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, UPI, Card
  const [checkedOut, setCheckedOut] = useState(false);

  // Pricing calculations
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const gstAmount = subtotal * 0.18;
  const delivery = subtotal > 15000 ? 0 : 1500;
  const grandTotal = subtotal + gstAmount + delivery;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zip) {
      alert("Please specify a shipping address.");
      return;
    }
    setCheckedOut(true);
    clearCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold flex items-center justify-center gap-1.5">
          <ShoppingBag size={14} /> Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-wide text-charcoal-900 dark:text-white mt-2">
          Your Shopping Bag
        </h1>
        <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2">
          Verify selected tile box counts, compile commercial GST invoices, and settle transaction balances.
        </p>
      </div>

      {checkedOut ? (
        <div className="glass-panel max-w-xl mx-auto rounded-2xl p-16 text-center border-2 border-gold shadow-2xl space-y-4">
          <span className="text-5xl mb-4 block">🎉</span>
          <h2 className="font-serif text-2xl font-black text-gold">Order Placed Successfully!</h2>
          <p className="text-xs text-charcoal-650 dark:text-charcoal-350 leading-relaxed max-w-sm mx-auto">
            Your transaction has been approved. A digital GST tax invoice and shipment tracking credentials have been sent to your email.
          </p>
          <div className="pt-4">
            <Link 
              href="/catalog" 
              className="gold-gradient-btn text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10 space-y-4">
              <h3 className="font-serif text-base font-bold border-b border-white/10 pb-3">Itemized Products</h3>
              
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center justify-between py-4 border-b border-white/5 last:border-none">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded-lg bg-charcoal-800" 
                  />
                  <div className="flex-grow">
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-charcoal-900 dark:text-white line-clamp-1">{item.product.name}</h4>
                    <span className="text-[10px] text-gold uppercase font-semibold">{item.size} | {item.product.brand}</span>
                    <p className="text-xs font-bold text-charcoal-900 dark:text-white mt-1">₹{item.price} / unit</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 border border-white/10 rounded px-2 py-1 bg-white/5">
                    <button 
                      onClick={() => updateCartQty(item.product.id, item.size, item.quantity - 1)}
                      className="text-charcoal-600 dark:text-charcoal-400 hover:text-gold"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-semibold px-2">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQty(item.product.id, item.size, item.quantity + 1)}
                      className="text-charcoal-600 dark:text-charcoal-400 hover:text-gold"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.product.id, item.size)}
                    className="text-red-400 hover:text-red-500 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Billing Address Form */}
            <form onSubmit={handleCheckout} className="glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10 space-y-6">
              <h3 className="font-serif text-base font-bold border-b border-white/10 pb-3">Billing & Dispatch Address</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-charcoal-900 dark:text-white">
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-gold block mb-1">Street Address</label>
                  <input 
                    type="text" 
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    placeholder="e.g. 102, Luxury Heights, Link Road"
                    className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gold block mb-1">City</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="e.g. Mumbai"
                    className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gold block mb-1">State</label>
                  <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder="e.g. Maharashtra"
                    className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gold block mb-1">ZIP / Postal Code</label>
                  <input 
                    type="text" 
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                    placeholder="e.g. 400001"
                    className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gold block mb-1">GSTIN Number (Optional)</label>
                  <input 
                    type="text" 
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="e.g. 27AAAAA1111A1Z1"
                    className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gold block mb-3">Settlement Method</label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {[
                    { id: 'COD', label: 'Cash on Delivery' },
                    { id: 'UPI', label: 'UPI / QR Code' },
                    { id: 'Card', label: 'Credit / Debit Card' }
                  ].map(pm => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`text-center py-2.5 border rounded transition-all font-semibold ${
                        paymentMethod === pm.id 
                          ? 'bg-gold border-gold text-black' 
                          : 'border-white/10 hover:border-gold text-charcoal-600 dark:text-charcoal-400'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full gold-gradient-btn text-black font-bold uppercase tracking-wider py-3.5 rounded shadow flex items-center justify-center gap-1.5"
              >
                Place Order <ArrowRight size={14} />
              </button>

            </form>

          </div>

          {/* Right Column: Pricing Summary */}
          <div>
            <div className="glass-panel p-6 rounded-2xl border-2 border-gold/30 shadow-xl space-y-6 text-xs text-charcoal-900 dark:text-white">
              <h3 className="font-serif text-lg font-bold border-b border-white/10 pb-3">Bill breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-charcoal-600 dark:text-charcoal-400">Cart Subtotal</span>
                  <span className="font-bold">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600 dark:text-charcoal-400">Tax GST (18%)</span>
                  <span className="font-bold">₹{gstAmount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600 dark:text-charcoal-400">Cargo Shipping Delivery</span>
                  <span className="font-bold">
                    {delivery === 0 ? <span className="text-green-500 font-semibold">Free Delivery</span> : `₹${delivery}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10 text-sm font-bold">
                  <span>Grand Total</span>
                  <span className="font-serif text-base text-gold">₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex gap-3 leading-relaxed text-charcoal-600 dark:text-charcoal-450 text-[10px]">
                <ShieldCheck size={18} className="text-gold flex-shrink-0" />
                <span>All transactions are encrypted with PCI-DSS compliance. GST commercial tax invoices will list corporate IDs.</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="glass-panel max-w-xl mx-auto rounded-2xl p-16 text-center border border-dashed border-gold/30">
          <span className="text-4xl mb-4 block">🛍️</span>
          <h3 className="font-serif text-lg font-bold text-charcoal-900 dark:text-white">Your cart is empty</h3>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2 max-w-sm mx-auto">
            You haven't added any products yet. Browse our premium vitrified tiles and marble categories.
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
