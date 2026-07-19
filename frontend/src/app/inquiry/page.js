"use client";
import React, { useState } from 'react';
import { Mail, Phone, Award, ShieldAlert, BadgePercent, CheckCircle, Ship } from 'lucide-react';
import { apiRequest } from '@/utils/api';

export default function Inquiry() {
  const [profile, setProfile] = useState('Architect'); // Dealer, Distributor, Builder, Architect, Designer, Contractor
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiRequest('/api/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          phone,
          businessType: profile,
          companyName: company,
          city,
          message
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const b2bPerks = [
    { title: "Special Pricing", desc: "Unlock wholesale volume discounts up to 35% off retail lists.", icon: <BadgePercent className="text-gold" /> },
    { title: "Express Dispatch", desc: "Priority cargo routing and dedicated flatbed logistical dispatching.", icon: <Ship className="text-gold" /> },
    { title: "Architect Kits", desc: "Receive customized sample boxes with tiles, grouts, and catalogs.", icon: <Award className="text-gold" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold flex items-center justify-center gap-1.5">
          <Award size={14} /> Trade Partnerships
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-wide text-charcoal-900 dark:text-white mt-2">
          Dealer & Trade Programs
        </h1>
        <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2">
          Apply to gain access to bulk commercial pricing, priority product batches, and luxury samples.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        
        {/* Left Side: Program Details & Perks */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-black text-charcoal-900 dark:text-white">
              B2B Benefits & Privileges
            </h2>
            <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed font-light">
              We offer comprehensive structural warranties, custom density testing certificates, and direct physical vapor deposition (PVD) color matching for kitchen and bathroom faucets for our trade members.
            </p>
          </div>

          {/* Perks Grid */}
          <div className="space-y-4">
            {b2bPerks.map((p, idx) => (
              <div key={idx} className="flex gap-4 p-4 border border-gold/15 rounded-xl glass-panel">
                <span className="bg-gold/10 p-3 rounded-lg h-fit flex items-center justify-center">
                  {p.icon}
                </span>
                <div>
                  <h3 className="font-serif text-sm font-bold text-charcoal-900 dark:text-white">{p.title}</h3>
                  <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Data Routing Flow Diagram */}
          <div className="glass-panel p-5 rounded-xl border border-gold/15 space-y-4">
            <h3 className="font-serif text-sm font-bold text-gold flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-gold animate-pulse" /> Application Routing Path
            </h3>
            <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 leading-normal">
              Wondering where your application details go? Below is the active data lifecycle map of your B2B partnership registration:
            </p>
            
            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-gold/20 pl-7 text-[11px]">
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-gold ring-4 ring-gold/10"></span>
                <span className="font-bold text-charcoal-900 dark:text-white">1. Secure Submission</span>
                <p className="text-charcoal-600 dark:text-charcoal-400 mt-0.5 leading-relaxed">Your data is packaged and securely sent over HTTPS to our server.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-gold ring-4 ring-gold/10"></span>
                <span className="font-bold text-charcoal-900 dark:text-white">2. Express API Routing</span>
                <p className="text-charcoal-600 dark:text-charcoal-400 mt-0.5 leading-relaxed">Processed by the backend router at <code className="bg-white/5 px-1 py-0.5 rounded text-[10px] text-gold font-mono">POST /api/inquiries</code>.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-gold ring-4 ring-gold/10"></span>
                <span className="font-bold text-charcoal-900 dark:text-white">3. Database Storage</span>
                <p className="text-charcoal-600 dark:text-charcoal-400 mt-0.5 leading-relaxed">Stored permanently in MongoDB (with transparent offline JSON-file persistence fallback).</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-gold ring-4 ring-gold/10"></span>
                <span className="font-bold text-charcoal-900 dark:text-white">4. Owner Control Dashboard</span>
                <p className="text-charcoal-600 dark:text-charcoal-400 mt-0.5 leading-relaxed">Populates the Owner Admin Control Panel in real-time, waiting for staff review and status approval.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Partnership Application Form */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gold/15 dark:border-gold/10">
            
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle size={48} className="text-green-500 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-charcoal-900 dark:text-white">
                  Application Received!
                </h3>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for applying for the **ABC Trade Program**. Our B2B partnership coordinator will evaluate your firm's credentials and respond to <strong>{email}</strong> within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-6 border border-gold text-gold hover:bg-gold/10 px-6 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Submit Another Form
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs text-charcoal-900 dark:text-white">
                
                {/* Form Heading */}
                <h3 className="font-serif text-lg font-bold border-b border-white/10 pb-3">
                  Partnership Application Form
                </h3>

                {error && (
                  <p className="bg-red-500/10 border border-red-500/30 text-red-500 p-2.5 rounded text-center font-bold">
                    {error}
                  </p>
                )}

                {/* Profile Toggle */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Trade Profile</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Dealer', 'Distributor', 'Builder', 'Architect', 'Interior Designer', 'Contractor'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProfile(p)}
                        className={`text-center py-2 border rounded transition-all font-semibold ${
                          profile === p 
                            ? 'bg-gold border-gold text-black' 
                            : 'border-white/10 hover:border-gold text-charcoal-600 dark:text-charcoal-400'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gold block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      required 
                      placeholder="e.g. Rajeev Rana"
                      className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gold block mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gold block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      placeholder="e.g. rajeev@archstudios.com"
                      className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gold block mb-1">Company / Firm Name</label>
                    <input 
                      type="text" 
                      value={company} 
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Rana & Partners Design"
                      className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gold block mb-1">City / Region</label>
                    <input 
                      type="text" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      required 
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gold block mb-1">Brief Description of Projects or Volume Requirements</label>
                    <textarea 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)}
                      rows="4" 
                      placeholder="Specify typical vitrified slab square footage or target projects..."
                      className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full gold-gradient-btn text-black font-bold uppercase tracking-wider py-3 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting Application...' : 'Submit Application'}
                </button>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
