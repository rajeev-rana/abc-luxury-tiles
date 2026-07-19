"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { User, ShoppingBag, ShieldCheck, Award, MessageCircle, ArrowRight, LogOut } from 'lucide-react';
import Link from 'next/link';

const MOCK_ORDERS = [
  {
    id: "ord-88392",
    date: "2026-06-12",
    product: "Royal Statuario Gold PGVT",
    boxes: 14,
    total: 23950,
    deliveryStatus: "Delivered",
    paymentStatus: "Completed"
  },
  {
    id: "ord-82910",
    date: "2026-07-02",
    product: "Aura Cascading Gold Basin Mixer",
    boxes: 2,
    total: 23364,
    deliveryStatus: "Shipped",
    paymentStatus: "Completed"
  }
];

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useApp();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-xs text-charcoal-900 dark:text-white">
      
      {/* Header Profile Info */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gold/15 dark:border-gold/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="bg-gold/10 text-gold p-4 rounded-full h-fit flex items-center justify-center">
            <User size={32} />
          </span>
          <div>
            <h1 className="font-serif text-2xl font-black text-charcoal-900 dark:text-white">{user.name}</h1>
            <span className="text-[10px] uppercase font-bold text-gold tracking-widest">{user.role} profile</span>
            <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 mt-1">{user.email} | {user.phone}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-center bg-white/5 dark:bg-black/20 p-4 rounded-xl border border-white/5 min-w-[100px]">
            <Award className="text-gold mx-auto mb-1" size={20} />
            <strong className="text-sm font-bold text-gold block">{user.loyaltyPoints}</strong>
            <span className="text-[9px] text-charcoal-600 dark:text-charcoal-400 block uppercase mt-0.5">Points</span>
          </div>
          
          <button 
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-1.5 border border-red-500/30 hover:bg-red-500/10 text-red-400 px-4 py-2 rounded-xl transition-colors font-semibold self-center"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </div>

      {/* B2B Dealer specific widget */}
      {user.role === 'dealer' && (
        <div className="glass-panel p-6 rounded-2xl border-2 border-gold/30 bg-gold/5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-1.5">
            <h3 className="font-serif text-base font-bold text-gold uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={18} /> Verified Trade Program Member
            </h3>
            <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 leading-relaxed font-light">
              Registered corporate profile: <strong>{user.companyName}</strong>. Your GSTIN: <strong>{user.gstin}</strong>. Bulk wholesale quotes are pre-authorized for immediate clearance.
            </p>
          </div>
          <div className="text-right">
            <Link 
              href="/inquiry" 
              className="gold-gradient-btn text-black font-bold uppercase tracking-wider px-6 py-2.5 rounded block text-center text-[10px]"
            >
              Request Custom PVD Quote
            </Link>
          </div>
        </div>
      )}

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 & 2: Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10 space-y-4">
            <h3 className="font-serif text-base font-bold border-b border-white/10 pb-3 flex items-center gap-2">
              <ShoppingBag size={18} className="text-gold" /> Order History
            </h3>
            
            <div className="space-y-4">
              {MOCK_ORDERS.map((ord, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 dark:bg-black/20 border border-white/5 rounded-xl gap-4">
                  <div>
                    <h4 className="font-serif text-xs font-bold text-charcoal-900 dark:text-white">ID: {ord.id}</h4>
                    <span className="text-[10px] text-charcoal-600 dark:text-charcoal-400">{ord.date}</span>
                    <p className="text-xs font-bold text-gold mt-1.5">{ord.product}</p>
                    <span className="text-[10px] text-charcoal-600 dark:text-charcoal-400 block">{ord.boxes} Boxes purchased</span>
                  </div>

                  <div className="flex sm:flex-col justify-between items-baseline sm:items-end gap-2 text-right">
                    <strong className="text-sm font-bold">₹{ord.total}</strong>
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                        ord.deliveryStatus === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-gold/10 text-gold'
                      }`}>
                        {ord.deliveryStatus}
                      </span>
                      <span className="bg-green-500/10 text-green-500 px-2.5 py-0.5 rounded text-[9px] font-bold">
                        Paid
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Quick Navigation */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10 space-y-6">
            <h3 className="font-serif text-base font-bold border-b border-white/10 pb-3">Quick Navigation</h3>
            
            <div className="flex flex-col gap-2">
              <Link 
                href="/calculator" 
                className="w-full bg-white/5 dark:bg-black/20 hover:border-gold border border-white/10 py-2.5 rounded-lg text-center font-bold uppercase text-[10px] tracking-wider transition-colors block"
              >
                Smart Calculator
              </Link>
              <Link 
                href="/visualizer" 
                className="w-full bg-white/5 dark:bg-black/20 hover:border-gold border border-white/10 py-2.5 rounded-lg text-center font-bold uppercase text-[10px] tracking-wider transition-colors block"
              >
                AR Visualizer
              </Link>
              <Link 
                href="/catalog" 
                className="w-full gold-gradient-btn text-black py-2.5 rounded-lg text-center font-bold uppercase text-[10px] tracking-wider transition-colors block"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
