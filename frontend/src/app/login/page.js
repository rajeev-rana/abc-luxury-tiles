"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { User, Lock, ArrowRight, Shield } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please complete all fields.");
      return;
    }
    try {
      const loggedUser = await login(email, password);
      if (loggedUser && loggedUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    }
  };

  const loginDemo = async (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password');
    try {
      const loggedUser = await login(roleEmail, 'password');
      if (loggedUser && loggedUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError("Demo login failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gold/15 dark:border-gold/10 shadow-2xl space-y-6 text-xs text-charcoal-900 dark:text-white">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider text-gold font-bold flex items-center justify-center gap-1.5">
            <Shield size={12} /> Secure Login
          </span>
          <h2 className="font-serif text-2xl font-black">Welcome Back</h2>
          <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400">Access your orders, trade inquiries, and loyalty accounts.</p>
        </div>

        {error && <p className="bg-red-500/10 border border-red-500/30 text-red-500 p-2.5 rounded text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gold block mb-1">Email Address</label>
            <div className="relative flex items-center">
              <User size={14} className="absolute left-3 text-charcoal-600 dark:text-charcoal-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. rajeev@test.com"
                className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded py-2.5 pl-10 pr-3 text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gold block mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock size={14} className="absolute left-3 text-charcoal-600 dark:text-charcoal-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded py-2.5 pl-10 pr-3 text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full gold-gradient-btn text-black font-bold uppercase tracking-wider py-3 rounded shadow flex items-center justify-center gap-1.5"
          >
            Sign In <ArrowRight size={14} />
          </button>
        </form>

        {/* Demo Roles selection shortcut */}
        <div className="border-t border-white/10 pt-6 space-y-3">
          <span className="text-[10px] uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400 block text-center font-bold">
            Simulate Demo Profiles
          </span>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => loginDemo('user@test.com')}
              className="w-full bg-white/5 dark:bg-black/20 hover:border-gold border border-white/10 py-2 rounded font-semibold text-charcoal-900 dark:text-charcoal-350"
            >
              Sign In as Standard Client
            </button>
            <button 
              onClick={() => loginDemo('dealer@test.com')}
              className="w-full bg-white/5 dark:bg-black/20 hover:border-gold border border-white/10 py-2 rounded font-semibold text-charcoal-900 dark:text-charcoal-350"
            >
              Sign In as Trade Dealer
            </button>
            <button 
              onClick={() => loginDemo('admin@test.com')}
              className="w-full bg-white/5 dark:bg-black/20 hover:border-gold border border-white/10 py-2 rounded font-semibold text-charcoal-900 dark:text-charcoal-350"
            >
              Sign In as Administrator (Owner)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
