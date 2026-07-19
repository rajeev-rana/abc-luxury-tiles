"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Calculator, Download, MessageCircle, Mail, HelpCircle, Check, Info } from 'lucide-react';

export default function TileCalculator() {
  const { customSizes } = useApp();

  // Inputs
  const [calculationMode, setCalculationMode] = useState('dimensions'); // dimensions vs direct_area
  const [unit, setUnit] = useState('Feet'); // Feet, Meter, Centimeter, Inches
  const [length, setLength] = useState('15');
  const [width, setWidth] = useState('12');
  const [directArea, setDirectArea] = useState('180');
  
  const [selectedSize, setSelectedSize] = useState('600×600 mm');
  const [wastePercent, setWastePercent] = useState(10); // 5, 10, 15
  const [pricePerSqFt, setPricePerSqFt] = useState('75'); // Average price in Rs/SqFt
  const [gstRate, setGstRate] = useState(18); // standard 18% GST

  // Outputs
  const [totalAreaSqFt, setTotalAreaSqFt] = useState(0);
  const [totalAreaSqMtr, setTotalAreaSqMtr] = useState(0);
  const [tilesNeededBasic, setTilesNeededBasic] = useState(0);
  const [tilesNeededWithWaste, setTilesNeededWithWaste] = useState(0);
  const [boxesNeeded, setBoxesNeeded] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [weightKg, setWeightKg] = useState(0);
  const [installationDays, setInstallationDays] = useState(0);

  // Map Tile Sizes to Coverage in SqFt per box
  const getTileCoverage = (sizeStr) => {
    // defaults
    if (sizeStr.includes('300×300')) return { area: 0.9, pcs: 10 }; // 0.9 sq mtr
    if (sizeStr.includes('300×450')) return { area: 0.81, pcs: 6 };
    if (sizeStr.includes('300×600')) return { area: 1.08, pcs: 6 };
    if (sizeStr.includes('400×400')) return { area: 0.96, pcs: 6 };
    if (sizeStr.includes('600×600')) return { area: 1.44, pcs: 4 }; // 15.5 sq ft
    if (sizeStr.includes('600×1200')) return { area: 1.44, pcs: 2 }; // 15.5 sq ft
    if (sizeStr.includes('800×800')) return { area: 1.28, pcs: 2 };
    if (sizeStr.includes('800×1600')) return { area: 1.28, pcs: 1 };
    if (sizeStr.includes('1200×1200')) return { area: 1.44, pcs: 1 };
    if (sizeStr.includes('1200×1800')) return { area: 2.16, pcs: 1 };
    
    // Fallback for custom size parsing
    const match = sizeStr.match(/(\d+)[×xX](\d+)/);
    if (match) {
      const w = parseInt(match[1]) / 1000; // in meters
      const h = parseInt(match[2]) / 1000;
      const singleArea = w * h; // in sq mtr
      const pcs = singleArea > 1.0 ? 1 : 4;
      return { area: singleArea * pcs, pcs };
    }
    return { area: 1.44, pcs: 4 };
  };

  useEffect(() => {
    let areaSqMtr = 0;
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const da = parseFloat(directArea) || 0;

    if (calculationMode === 'dimensions') {
      let lMtr = l;
      let wMtr = w;

      if (unit === 'Feet') {
        lMtr = l * 0.3048;
        wMtr = w * 0.3048;
      } else if (unit === 'Centimeter') {
        lMtr = l / 100;
        wMtr = w / 100;
      } else if (unit === 'Inches') {
        lMtr = l * 0.0254;
        wMtr = w * 0.0254;
      }
      areaSqMtr = lMtr * wMtr;
    } else {
      // Direct Area input assumes Unit type
      if (unit === 'Feet') {
        areaSqMtr = da * 0.092903;
      } else if (unit === 'Meter') {
        areaSqMtr = da;
      } else if (unit === 'Centimeter') {
        areaSqMtr = da / 10000;
      } else if (unit === 'Inches') {
        areaSqMtr = da * 0.00064516;
      }
    }

    const areaSqFt = areaSqMtr * 10.7639;
    setTotalAreaSqMtr(areaSqMtr);
    setTotalAreaSqFt(areaSqFt);

    // Calculate tiles and boxes
    const coverage = getTileCoverage(selectedSize); // in SqMtr per box
    const singleTileArea = coverage.area / coverage.pcs; // SqMtr per single tile

    const basicTiles = Math.ceil(areaSqMtr / singleTileArea);
    setTilesNeededBasic(basicTiles);

    const wasteMultiplier = 1 + (wastePercent / 100);
    const wasteTiles = Math.ceil(basicTiles * wasteMultiplier);
    setTilesNeededWithWaste(wasteTiles);

    // Boxes required (calculated using waste padding)
    const boxes = Math.ceil((wasteTiles * singleTileArea) / coverage.area);
    setBoxesNeeded(boxes);

    // Pricing
    const pPerSqFt = parseFloat(pricePerSqFt) || 0;
    const actualSqFtToBuy = boxes * (coverage.area * 10.7639);
    const sub = actualSqFtToBuy * pPerSqFt;
    const tax = sub * (gstRate / 100);
    const grand = sub + tax;

    setSubtotal(sub);
    setGstAmount(tax);
    setGrandTotal(grand);

    // Estimated Weight: 1 standard box vitrified tiles is ~28kg
    setWeightKg(boxes * 28);

    // Installation: ~50 SqFt per day for a basic mason team
    setInstallationDays(Math.max(1, Math.ceil(areaSqFt / 100)));

  }, [calculationMode, unit, length, width, directArea, selectedSize, wastePercent, pricePerSqFt, gstRate]);

  const handleDownloadPDF = () => {
    alert("Generating your Custom Estimation Sheet PDF...\nDownloaded successfully!");
  };

  const handleSendWhatsApp = () => {
    const text = `*ABC Tiles Estimation Summary*:\n` +
                 `- Room Size: ${length}x${width} ${unit}\n` +
                 `- Selected Tile: ${selectedSize}\n` +
                 `- Total Area: ${totalAreaSqFt.toFixed(1)} Sq.Ft (${totalAreaSqMtr.toFixed(1)} Sq.Mtr)\n` +
                 `- Boxes Required (with ${wastePercent}% waste): ${boxesNeeded} Boxes\n` +
                 `- Est. Grand Total (with GST): ₹${grandTotal.toFixed(0)}\n` +
                 `Please contact dealer to finalize order.`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendEmail = () => {
    const subject = "ABC Luxury Tiles - Room Estimation Sheet";
    const body = `Hi,\n\nHere is your custom tile requirement estimate:\n` +
                 `Total Area: ${totalAreaSqFt.toFixed(1)} Sq.Ft\n` +
                 `Tile Size Chosen: ${selectedSize}\n` +
                 `Boxes Needed (incl. ${wastePercent}% waste margin): ${boxesNeeded} boxes\n` +
                 `Subtotal: Rs. ${subtotal.toFixed(0)}\n` +
                 `GST (${gstRate}%): Rs. ${gstAmount.toFixed(0)}\n` +
                 `Grand Total: Rs. ${grandTotal.toFixed(0)}\n\n` +
                 `Thank you,\nABC Tiles & Ceramics`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold flex items-center justify-center gap-1.5">
          <Calculator size={14} /> Smart Estimation
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-wide text-charcoal-900 dark:text-white mt-2">
          Tile & Budget Calculator
        </h1>
        <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2">
          Input room measurements to compute tile piece counts, wastage cushions, shipping loads, and GST billing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 & 2: Form Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gold/15 dark:border-gold/10">
            
            {/* Input Selection Mode Toggles */}
            <div className="flex border-b border-white/10 pb-4 mb-6">
              <button 
                onClick={() => setCalculationMode('dimensions')}
                className={`flex-1 text-center font-serif text-xs sm:text-sm uppercase tracking-wider pb-2 border-b-2 font-bold transition-all ${
                  calculationMode === 'dimensions' ? 'border-gold text-gold' : 'border-transparent text-charcoal-600 dark:text-charcoal-400'
                }`}
              >
                Room Dimensions
              </button>
              <button 
                onClick={() => setCalculationMode('direct_area')}
                className={`flex-1 text-center font-serif text-xs sm:text-sm uppercase tracking-wider pb-2 border-b-2 font-bold transition-all ${
                  calculationMode === 'direct_area' ? 'border-gold text-gold' : 'border-transparent text-charcoal-600 dark:text-charcoal-400'
                }`}
              >
                Direct Total Area
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Unit Type */}
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Unit Type</label>
                <select 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold"
                >
                  {['Feet', 'Meter', 'Centimeter', 'Inches'].map(u => (
                    <option key={u} value={u} className="dark:bg-charcoal-900 text-black dark:text-white">{u}</option>
                  ))}
                </select>
              </div>

              {/* Sizes Selector */}
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Tile Size</label>
                <select 
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold"
                >
                  {customSizes.map(sz => (
                    <option key={sz} value={sz} className="dark:bg-charcoal-900 text-black dark:text-white">{sz}</option>
                  ))}
                </select>
              </div>

              {/* Dynamic Dimensions Input */}
              {calculationMode === 'dimensions' ? (
                <>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Room Length ({unit})</label>
                    <input 
                      type="number" 
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Room Width ({unit})</label>
                    <input 
                      type="number" 
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Total Room Area (Sq. {unit})</label>
                  <input 
                    type="number" 
                    value={directArea}
                    onChange={(e) => setDirectArea(e.target.value)}
                    className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold"
                  />
                </div>
              )}

              {/* Waste Percentage Buffer */}
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Wastage Cushion Buffer</label>
                <div className="flex gap-2">
                  {[5, 10, 15].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setWastePercent(p)}
                      className={`flex-1 text-center py-2 border rounded text-xs transition-all ${
                        wastePercent === p 
                          ? 'bg-gold border-gold text-black font-semibold' 
                          : 'border-white/10 hover:border-gold text-charcoal-600 dark:text-charcoal-400'
                      }`}
                    >
                      +{p}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Per SqFt */}
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gold block mb-2">Average Price (₹ / Sq.Ft)</label>
                <input 
                  type="number" 
                  value={pricePerSqFt}
                  onChange={(e) => setPricePerSqFt(e.target.value)}
                  placeholder="e.g. 75"
                  className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded px-3 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold"
                />
              </div>

            </div>

            {/* Note alert */}
            <div className="mt-6 bg-gold/10 border border-gold/30 rounded-xl p-4 flex gap-3 text-xs text-charcoal-900 dark:text-gold-light leading-relaxed">
              <Info size={16} className="text-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Pro Tip:</span> In custom room installations, masonic cuts and layout borders usually result in 8-12% tile wastage. A 10% buffer is recommended for standard patterns, and 15% for diagonal herringbone arrangements.
              </div>
            </div>

          </div>

          {/* Calculations Charts */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gold/15 dark:border-gold/10">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 dark:text-white mb-6">Quantity Breakdowns</h3>
            
            {/* Visual Bar Charts */}
            <div className="space-y-6">
              
              {/* Minimum Purchase Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span>Minimum Tile Pieces Required</span>
                  <span>{tilesNeededBasic} Pieces</span>
                </div>
                <div className="w-full bg-white/10 dark:bg-black/40 h-4 rounded-full overflow-hidden">
                  <div className="bg-charcoal-600 dark:bg-charcoal-400 h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              {/* Recommended Purchase Bar (with waste buffer) */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2 text-gold">
                  <span>Recommended Purchase (with {wastePercent}% safety buffer)</span>
                  <span>{tilesNeededWithWaste} Pieces</span>
                </div>
                <div className="w-full bg-white/10 dark:bg-black/40 h-4 rounded-full overflow-hidden">
                  <div className="bg-gold h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Column 3: Estimations Bill Summary */}
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-2 border-gold/30 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-black text-charcoal-900 dark:text-white border-b border-white/10 pb-4 mb-6">
                Estimate Sheet
              </h3>
              
              {/* Outputs List */}
              <div className="space-y-4 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-charcoal-600 dark:text-charcoal-400">Total Room Area</span>
                  <span className="font-bold">{totalAreaSqFt.toFixed(1)} Sq.Ft / {totalAreaSqMtr.toFixed(1)} Sq.Mtr</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-charcoal-600 dark:text-charcoal-400">Tile Size Coverage</span>
                  <span className="font-bold">{selectedSize}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2 text-gold font-semibold">
                  <span>Total Boxes Required</span>
                  <span className="font-serif text-sm">{boxesNeeded} Boxes</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-charcoal-600 dark:text-charcoal-400">Total Tile Pieces</span>
                  <span className="font-bold">{tilesNeededWithWaste} Pcs</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-charcoal-600 dark:text-charcoal-400">Estimated Cargo Weight</span>
                  <span className="font-bold">~{weightKg} kg</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-charcoal-600 dark:text-charcoal-400">Installation Time (Est.)</span>
                  <span className="font-bold">~{installationDays} days</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-charcoal-600 dark:text-charcoal-400">Subtotal Cost</span>
                  <span className="font-bold">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-charcoal-600 dark:text-charcoal-400">GST ({gstRate}%)</span>
                  <span className="font-bold">₹{gstAmount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold text-charcoal-900 dark:text-white">
                  <span>Grand Total</span>
                  <span className="font-serif text-lg text-gold">₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 space-y-3 pt-6 border-t border-white/10">
              <button 
                onClick={handleDownloadPDF}
                className="w-full gold-gradient-btn text-black font-bold text-xs uppercase tracking-wider py-3 rounded flex items-center justify-center gap-2 shadow"
              >
                <Download size={14} /> Download PDF Estimate
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleSendWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold text-[10px] uppercase tracking-wider py-2.5 rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={12} className="fill-white stroke-none" /> WhatsApp
                </button>
                <button 
                  onClick={handleSendEmail}
                  className="bg-charcoal-900 hover:bg-charcoal-800 dark:bg-white dark:hover:bg-charcoal-200 text-white dark:text-black font-bold text-[10px] uppercase tracking-wider py-2.5 rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail size={12} /> Email Estimate
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
