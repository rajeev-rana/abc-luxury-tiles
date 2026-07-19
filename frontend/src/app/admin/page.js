"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { products as initialProducts } from '@/data/products';
import { apiRequest } from '@/utils/api';
import { 
  ShieldAlert, Settings, Plus, Trash2, Edit, CheckCircle, 
  FileText, TrendingUp, Users, Box, BarChart3, Edit3 
} from 'lucide-react';

const MOCK_INQUIRIES = [
  { id: 1, name: "Rajesh K.", email: "rajesh@builders.com", phone: "+91 99887 76655", type: "Builder", city: "Mumbai", status: "Pending" },
  { id: 2, name: "Ananya S.", email: "ananya@studiodesign.in", phone: "+91 91234 56789", type: "Interior Designer", city: "Pune", status: "Contacted" },
  { id: 3, name: "Vikram R.", email: "vikram@stoneimporters.com", phone: "+91 98765 00011", type: "Distributor", city: "Delhi", status: "Approved" }
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, customSizes, addCustomSize } = useApp();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, products, sizes, inquiries, settings

  // Admin states
  const [productsList, setProductsList] = useState(initialProducts);
  const [inquiries, setInquiries] = useState([]);
  const [businessName, setBusinessName] = useState('ABC Tiles & Ceramics');
  const [newSize, setNewSize] = useState('');
  
  // New Product Form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState('Vitrified Tiles');
  const [newProdPrice, setNewProdPrice] = useState('');

  useEffect(() => {
    // Lock access to admin
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
    
    // Read business name
    const storedName = localStorage.getItem('abc_business_name');
    if (storedName) setBusinessName(storedName);
  }, [user]);

  // Load real inquiries from backend
  useEffect(() => {
    if (user && user.role === 'admin') {
      const fetchInquiries = async () => {
        try {
          const data = await apiRequest('/api/inquiries');
          setInquiries(data && data.length > 0 ? data : MOCK_INQUIRIES);
        } catch (err) {
          console.error("Failed to load inquiries from API, falling back to mock:", err.message);
          setInquiries(MOCK_INQUIRIES);
        }
      };
      fetchInquiries();
    }
  }, [user]);

  if (!user || user.role !== 'admin') return null;

  const handleUpdateBusinessName = (e) => {
    e.preventDefault();
    localStorage.setItem('abc_business_name', businessName);
    alert("Business title updated globally! Please refresh the page to see changes in headers.");
  };

  const handleAddSize = (e) => {
    e.preventDefault();
    if (newSize.trim()) {
      addCustomSize(newSize.trim());
      setNewSize('');
      alert("New tile dimensions added to the global database!");
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    
    const newP = {
      id: "prod-" + Date.now(),
      name: newProdName,
      category: newProdCat,
      brand: "ABC House Brand",
      price: Number(newProdPrice),
      stockStatus: "In Stock",
      description: "Admin added custom material.",
      size: "600x600 mm",
      images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"],
      specifications: { "Thickness": "9mm" }
    };

    setProductsList([newP, ...productsList]);
    setNewProdName('');
    setNewProdPrice('');
    alert("Product successfully added to the catalog!");
  };

  const handleDeleteProduct = (id) => {
    setProductsList(productsList.filter(p => p.id !== id));
  };

  const handleInquiryStatus = async (id, newStatus) => {
    try {
      // Check if real database ID or mock ID
      const isMock = typeof id === 'number' || !id.includes('-');
      if (!isMock) {
        await apiRequest(`/api/inquiries/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ status: newStatus })
        });
      }
      setInquiries(inquiries.map(inq => 
        (inq.id === id || inq._id === id) ? { ...inq, status: newStatus } : inq
      ));
    } catch (err) {
      alert("Failed to update inquiry status: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-xs text-charcoal-900 dark:text-white">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
            <ShieldAlert size={14} /> Control Panel
          </span>
          <h1 className="font-serif text-3xl font-black">Admin Dashboard</h1>
        </div>
        
        {/* Tab Selector Links */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={12} /> },
            { id: 'products', label: 'Products', icon: <Box size={12} /> },
            { id: 'sizes', label: 'Manage Sizes', icon: <Settings size={12} /> },
            { id: 'inquiries', label: 'B2B Leads', icon: <Users size={12} /> },
            { id: 'settings', label: 'Settings', icon: <Edit3 size={12} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold uppercase transition-all ${
                activeTab === tab.id 
                  ? 'bg-gold text-black shadow' 
                  : 'bg-white/5 dark:bg-black/20 hover:bg-gold/10'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABS CONTENT */}

      {/* 1. Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-xl border border-gold/10">
              <span className="text-[10px] uppercase font-bold text-charcoal-600 dark:text-charcoal-450 block">Monthly Revenue</span>
              <strong className="text-lg font-serif font-black text-gold mt-1 block">₹8.4 Lakhs</strong>
              <span className="text-[9px] text-green-500 font-bold block mt-1">↑ 12% vs last month</span>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-gold/10">
              <span className="text-[10px] uppercase font-bold text-charcoal-600 dark:text-charcoal-450 block">Active B2B Leads</span>
              <strong className="text-lg font-serif font-black text-gold mt-1 block">{inquiries.length} Accounts</strong>
              <span className="text-[9px] text-gold font-bold block mt-1">Pending review</span>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-gold/10">
              <span className="text-[10px] uppercase font-bold text-charcoal-600 dark:text-charcoal-450 block">Total Catalog Items</span>
              <strong className="text-lg font-serif font-black text-gold mt-1 block">{productsList.length} items</strong>
              <span className="text-[9px] text-charcoal-600 dark:text-charcoal-400 block mt-1">Active inventory</span>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-gold/10">
              <span className="text-[10px] uppercase font-bold text-charcoal-600 dark:text-charcoal-450 block">Estimate Queries</span>
              <strong className="text-lg font-serif font-black text-gold mt-1 block">340 calculated</strong>
              <span className="text-[9px] text-green-500 font-bold block mt-1">↑ 24% conversion</span>
            </div>
          </div>

          {/* Detailed Reports chart mockup */}
          <div className="glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10 space-y-4">
            <h3 className="font-serif text-base font-bold flex items-center gap-2">
              <TrendingUp size={16} className="text-gold" /> Popular Tile Categories
            </h3>
            
            <div className="space-y-4">
              {[
                { name: "Vitrified Slabs (600x1200)", percentage: 75, revenue: "₹6.3L" },
                { name: "Imported Italian Marble Slabs", percentage: 55, revenue: "₹4.8L" },
                { name: "Brushed Gold Faucets", percentage: 40, revenue: "₹2.1L" },
                { name: "Wall Claddings", percentage: 25, revenue: "₹1.2L" }
              ].map((row, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>{row.name}</span>
                    <span>{row.revenue} ({row.percentage}%)</span>
                  </div>
                  <div className="w-full bg-white/10 dark:bg-black/40 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-gold h-full rounded-full" style={{ width: `${row.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Products List Manager Tab */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List Section */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10 space-y-4">
            <h3 className="font-serif text-base font-bold border-b border-white/10 pb-3">Products Inventory List</h3>
            
            <div className="space-y-3">
              {productsList.map(prod => (
                <div key={prod.id} className="flex gap-4 items-center justify-between p-3 bg-white/5 dark:bg-black/20 border border-white/5 rounded-xl">
                  <img src={prod.images[0]} alt="" className="w-12 h-12 object-cover rounded bg-charcoal-800" />
                  <div className="flex-grow">
                    <h4 className="font-serif font-bold text-charcoal-900 dark:text-white line-clamp-1">{prod.name}</h4>
                    <span className="text-[9px] text-gold uppercase tracking-wider font-semibold">{prod.category}</span>
                  </div>
                  
                  <strong className="text-gold font-serif">₹{prod.price}</strong>
                  
                  <button 
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="text-red-400 hover:text-red-500 p-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Drawer form */}
          <div className="glass-panel p-6 rounded-2xl border-2 border-gold/30 shadow-xl self-start">
            <form onSubmit={handleAddProduct} className="space-y-4">
              <h3 className="font-serif text-base font-bold border-b border-white/10 pb-3 flex items-center gap-1.5">
                <Plus size={16} /> Create Material
              </h3>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-gold block mb-1">Product Title</label>
                <input 
                  type="text" 
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                  placeholder="e.g. Royal Calacatta PGVT"
                  className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gold block mb-1">Category</label>
                <select 
                  value={newProdCat}
                  onChange={(e) => setNewProdCat(e.target.value)}
                  className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                >
                  {['Vitrified Tiles', 'Ceramic Tiles', 'GVT Tiles', 'Granite', 'Marble', 'Sanitaryware', 'Faucets'].map(cat => (
                    <option key={cat} value={cat} className="dark:bg-charcoal-900 text-black dark:text-white">{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gold block mb-1">Price (₹ per unit)</label>
                <input 
                  type="number" 
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  required
                  placeholder="e.g. 1200"
                  className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <button 
                type="submit" 
                className="w-full gold-gradient-btn text-black font-bold uppercase tracking-wider py-3 rounded shadow"
              >
                Add to Catalog
              </button>

            </form>
          </div>

        </div>
      )}

      {/* 3. Manage Sizes Tab */}
      {activeTab === 'sizes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* List display */}
          <div className="glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10 space-y-4">
            <h3 className="font-serif text-base font-bold border-b border-white/10 pb-3">Global Tile Sizing Library</h3>
            <div className="flex flex-wrap gap-2">
              {customSizes.map((sz, idx) => (
                <span 
                  key={idx}
                  className="bg-white/5 dark:bg-black/20 border border-gold/45 text-gold rounded-full px-3.5 py-1.5 font-semibold text-xs flex items-center gap-1.5"
                >
                  {sz}
                </span>
              ))}
            </div>
          </div>

          {/* Add form */}
          <div className="glass-panel p-6 rounded-2xl border-2 border-gold/30 shadow-xl self-start">
            <form onSubmit={handleAddSize} className="space-y-4">
              <h3 className="font-serif text-base font-bold border-b border-white/10 pb-3">Create Tile Sizing Specification</h3>
              <div>
                <label className="text-[10px] uppercase font-bold text-gold block mb-1">Dimensions String</label>
                <input 
                  type="text" 
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  required
                  placeholder="e.g. 1600×3200 mm"
                  className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <button 
                type="submit" 
                className="w-full gold-gradient-btn text-black font-bold uppercase tracking-wider py-3 rounded shadow"
              >
                Add Size
              </button>
            </form>
          </div>

        </div>
      )}

      {/* 4. Inquiries / Leads Tab */}
      {activeTab === 'inquiries' && (
        <div className="glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10 space-y-4 overflow-x-auto">
          <h3 className="font-serif text-base font-bold border-b border-white/10 pb-3">Active B2B Inquiries</h3>
          
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 text-gold font-bold">
                <th className="py-2.5">Name</th>
                <th className="py-2.5">Phone / Email</th>
                <th className="py-2.5">Profile</th>
                <th className="py-2.5">City</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inq => {
                const inqId = inq.id || inq._id;
                return (
                  <tr key={inqId} className="border-b border-white/5 last:border-none hover:bg-white/5">
                    <td className="py-3 font-semibold text-charcoal-900 dark:text-white">{inq.name}</td>
                    <td className="py-3 text-charcoal-600 dark:text-charcoal-400">
                      <div>{inq.phone}</div>
                      <div>{inq.email}</div>
                    </td>
                    <td className="py-3 font-semibold">{inq.type || inq.businessType}</td>
                    <td className="py-3">{inq.city}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inq.status === 'Approved' ? 'bg-green-500/10 text-green-500' : (
                          inq.status === 'Contacted' ? 'bg-blue-500/10 text-blue-500' : 'bg-gold/10 text-gold'
                        )
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-1.5">
                      <button 
                        onClick={() => handleInquiryStatus(inqId, 'Contacted')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-[9px] font-bold"
                      >
                        Contacted
                      </button>
                      <button 
                        onClick={() => handleInquiryStatus(inqId, 'Approved')}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-[9px] font-bold"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Business Settings Tab */}
      {activeTab === 'settings' && (
        <div className="glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10 max-w-xl">
          <form onSubmit={handleUpdateBusinessName} className="space-y-4">
            <h3 className="font-serif text-base font-bold border-b border-white/10 pb-3">Global Store Configurations</h3>
            
            <div>
              <label className="text-[10px] uppercase font-bold text-gold block mb-1">Business Name (Navbar Header)</label>
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <button 
              type="submit" 
              className="gold-gradient-btn text-black font-bold uppercase tracking-wider py-2.5 px-6 rounded shadow"
            >
              Update Store Name
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
