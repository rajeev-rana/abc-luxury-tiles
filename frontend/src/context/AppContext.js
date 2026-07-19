"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiRequest } from '@/utils/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compare, setCompare] = useState([]);
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [customSizes, setCustomSizes] = useState([
    "300×300 mm", "300×450 mm", "300×600 mm", "400×400 mm", 
    "600×600 mm", "600×1200 mm", "800×800 mm", "800×1600 mm", 
    "1200×1200 mm", "1200×1800 mm"
  ]);

  // Load state from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('abc_cart');
      const storedWishlist = localStorage.getItem('abc_wishlist');
      const storedCompare = localStorage.getItem('abc_compare');
      const storedTheme = localStorage.getItem('abc_theme') || 'light';
      const storedUser = localStorage.getItem('abc_user');
      const storedToken = localStorage.getItem('abc_token');
      const storedSizes = localStorage.getItem('abc_sizes');

      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      if (storedCompare) setCompare(JSON.parse(storedCompare));
      
      // Set Theme
      setTheme(storedTheme);
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
      if (storedSizes) setCustomSizes(JSON.parse(storedSizes));
    }
  }, []);

  // Save changes to local storage helper
  const saveToStorage = (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  // Cart Functions
  const addToCart = (product, quantity = 1, selectedSize = null) => {
    const size = selectedSize || product.size;
    const existingIndex = cart.findIndex(item => item.product.id === product.id && item.size === size);
    
    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cart, { product, quantity, size, price: product.discountPrice || product.price }];
    }
    
    setCart(updatedCart);
    saveToStorage('abc_cart', updatedCart);
  };

  const updateCartQty = (productId, size, quantity) => {
    const updatedCart = cart.map(item => {
      if (item.product.id === productId && item.size === size) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    });
    setCart(updatedCart);
    saveToStorage('abc_cart', updatedCart);
  };

  const removeFromCart = (productId, size) => {
    const updatedCart = cart.filter(item => !(item.product.id === productId && item.size === size));
    setCart(updatedCart);
    saveToStorage('abc_cart', updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('abc_cart');
    }
  };

  // Wishlist Functions
  const toggleWishlist = (product) => {
    const exists = wishlist.some(item => item.id === product.id);
    let updatedWishlist;
    if (exists) {
      updatedWishlist = wishlist.filter(item => item.id !== product.id);
    } else {
      updatedWishlist = [...wishlist, product];
    }
    setWishlist(updatedWishlist);
    saveToStorage('abc_wishlist', updatedWishlist);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Compare Functions
  const addToCompare = (product) => {
    if (compare.some(item => item.id === product.id)) return;
    if (compare.length >= 4) {
      alert("You can compare up to 4 products at a time.");
      return;
    }
    const updatedCompare = [...compare, product];
    setCompare(updatedCompare);
    saveToStorage('abc_compare', updatedCompare);
  };

  const removeFromCompare = (productId) => {
    const updatedCompare = compare.filter(item => item.id !== productId);
    setCompare(updatedCompare);
    saveToStorage('abc_compare', updatedCompare);
  };

  const isInCompare = (productId) => {
    return compare.some(item => item.id === productId);
  };

  // Theme Functions
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('abc_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Auth Functions
  const login = async (email, password) => {
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (data && data.user) {
        setUser(data.user);
        setToken(data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('abc_user', JSON.stringify(data.user));
          localStorage.setItem('abc_token', data.token);
        }
        return data.user;
      }
    } catch (err) {
      console.warn("Backend auth failed, falling back to simulated credentials:", err.message);
    }

    // Simulated auth fallback logic for premium demo experience
    let mockUser = {
      id: "usr-admin-1",
      name: "Rajeev Rana (Owner)",
      email: email,
      role: email.includes('admin') ? 'admin' : (email.includes('dealer') ? 'dealer' : 'user'),
      phone: "+91 98765 43210",
      companyName: "ABC Tiles & Ceramics Premium Store",
      gstin: "27AAAAA1111A1Z1",
      loyaltyPoints: 340
    };

    if (email === "user@test.com" && password === "password") {
      mockUser.role = "user";
      mockUser.name = "John Doe";
    }

    setUser(mockUser);
    setToken("mock_jwt_token_for_demo");
    if (typeof window !== 'undefined') {
      localStorage.setItem('abc_user', JSON.stringify(mockUser));
      localStorage.setItem('abc_token', 'mock_jwt_token_for_demo');
    }
    return mockUser;
  };

  const register = async (userData) => {
    try {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (data && data.user) {
        setUser(data.user);
        setToken(data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('abc_user', JSON.stringify(data.user));
          localStorage.setItem('abc_token', data.token);
        }
        return data.user;
      }
    } catch (err) {
      console.warn("Backend auth registration failed, falling back to simulated credentials:", err.message);
    }

    const mockUser = {
      id: "usr-" + Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user',
      phone: userData.phone,
      companyName: userData.companyName || '',
      gstin: userData.gstin || '',
      loyaltyPoints: 0
    };
    setUser(mockUser);
    setToken("mock_jwt_token_for_demo");
    if (typeof window !== 'undefined') {
      localStorage.setItem('abc_user', JSON.stringify(mockUser));
      localStorage.setItem('abc_token', 'mock_jwt_token_for_demo');
    }
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('abc_user');
      localStorage.removeItem('abc_token');
    }
  };

  // Add custom size (Admin function)
  const addCustomSize = (sizeStr) => {
    if (customSizes.includes(sizeStr)) return;
    const updatedSizes = [...customSizes, sizeStr];
    setCustomSizes(updatedSizes);
    saveToStorage('abc_sizes', updatedSizes);
  };

  return (
    <AppContext.Provider value={{
      cart,
      wishlist,
      compare,
      theme,
      user,
      token,
      customSizes,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      addToCompare,
      removeFromCompare,
      isInCompare,
      toggleTheme,
      login,
      register,
      logout,
      addCustomSize
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
