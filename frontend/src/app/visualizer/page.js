"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { products } from '@/data/products';
import { Send, Upload, Sparkles, User, Bot, RefreshCw, ArrowRight, Layers, ClipboardList, Image as ImageIcon } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    sender: 'bot',
    text: "Hello! I am your AI Design Consultant. 🏺\n\nUpload a photo of your room (Living Room, Kitchen, Bathroom, or Outdoor) and I'll analyze the dimensions, color scheme, and lighting to recommend the perfect luxury tiles, marble, or granite slabs.",
    time: "Just now"
  }
];

const parseMessageText = (text) => {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    const linkText = match[1];
    const url = match[2];
    
    if (url.startsWith('/')) {
      parts.push(
        <Link key={match.index} href={url} className="text-gold border-b border-gold hover:text-gold-light transition-colors font-semibold">
          {linkText}
        </Link>
      );
    } else {
      parts.push(
        <a key={match.index} href={url} target="_blank" rel="noopener noreferrer" className="text-gold border-b border-gold hover:text-gold-light transition-colors font-semibold">
          {linkText}
        </a>
      );
    }
    
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

export default function AIDesignAssistant() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Recommended tile state updated by the AI
  const [recommendedTile, setRecommendedTile] = useState(products[0]);
  const [roomType, setRoomType] = useState('Living Room');
  
  // DOM References for the Before/After split visualizer
  const containerRef = useRef(null);
  const handleRef = useRef(null);
  const overlayRef = useRef(null);

  // Chat message scroller
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const photoUrl = uploadEvent.target.result;
        setUploadedPhoto(photoUrl);
        
        // Add user upload message to chat
        const userMsg = {
          sender: 'user',
          text: "Uploaded a room photo for analysis.",
          image: photoUrl,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, userMsg]);
        triggerAIAnalysis(photoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger simulated AI Vision analysis
  const triggerAIAnalysis = (photoUrl) => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);

      // Randomly select a high-end product from our database to recommend
      const recommended = products[Math.floor(Math.random() * products.length)];
      setRecommendedTile(recommended);
      
      // Determine simulated room category based on products applications
      const detectedRoom = recommended.applications.includes('Kitchen') ? 'Kitchen' : (
        recommended.applications.includes('Bathroom') ? 'Luxury Bathroom' : 'Contemporary Living Room'
      );
      setRoomType(detectedRoom);

      const aiResponse = {
        sender: 'bot',
        text: `🔍 **Room Analysis Complete**:\n\n` +
              `• **Detected Area**: ${detectedRoom}\n` +
              `• **Lighting Profile**: Neutral Warm Natural Light\n` +
              `• **Recommended Material**: **${recommended.name}** (${recommended.category})\n` +
              `• **Optimal Thickness**: ${recommended.thickness || '9.5mm'}\n` +
              `• **Size Suggestion**: ${recommended.size} Slabs (to minimize masonic joint lines)\n\n` +
              `*Design Rationale*: This material's ${recommended.finish} finish reflects ambient light, creating a sense of visual openness. I have applied a simulated overlay on your room photo. Use the Before/After slider to preview it!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProduct: recommended
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 2800);
  };

  // Handle Text Submission
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulated AI text replies
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      
      const query = inputText.toLowerCase();
      let replyText = "I see! If you'd like me to recommend a specific pattern layout, please upload a photo of the floor space first. You can also ask me about prices, sizing specs, vitrified vs natural marble, or room-specific recommendations.";
      
      if (query.includes('price') || query.includes('cost') || query.includes('cheap') || query.includes('how much') || query.includes('budget')) {
        replyText = `Our premium vitrified tiles start at ₹${products[0].discountPrice} per box (approx. ₹95/sq. ft.), while imported natural marble ranges up to ₹${products[1].discountPrice}/sq. ft. 

You can check out our [Tile Calculator](/calculator) to compute exact cost estimates including waste buffers and GST!`;
      } else if (query.includes('size') || query.includes('thickness') || query.includes('dimension') || query.includes('slab')) {
        replyText = `We offer multiple standard sizes:
• **Vitrified Tiles**: 600x1200 mm (9.5mm thickness) and 600x600 mm.
• **Natural Marbles/Granites**: Custom slab sizes (18mm to 20mm thickness).
• **Sanitaryware**: Oval Vessel counter washbasins (400x500x140 mm).

Standardizing on larger slabs (like 600x1200 mm) minimizes grout joints, giving a seamless, continuous look.`;
      } else if (query.includes('vitrified') || query.includes('gvt') || query.includes('pgvt') || query.includes('ceramic')) {
        replyText = `Vitrified tiles are highly durable, non-porous ceramic tiles. We specialize in:
1. **PGVT (Polished Glazed Vitrified Tiles)**: Mirror-like high-gloss finish. Perfect for living rooms (e.g. *Royal Statuario Gold*).
2. **GVT (Glazed Vitrified Tiles)**: Available in matt, rustic, and satin finishes. Best for high-traffic zones, kitchens, or bathrooms.`;
      } else if (query.includes('marble') || query.includes('granite') || query.includes('stone')) {
        replyText = `Our natural stone inventory features:
• **Italian Golden Portoro Marble**: Deep black with golden veins (18mm mirror finish). Perfect for statement panels.
• **Black Galaxy Granite**: Sparking copper-gold specks (20mm thickness). Highly durable, great for kitchen counters and outdoor patios.

Natural stone requires professional sealing after installation to maintain stain resistance.`;
      } else if (query.includes('bathroom') || query.includes('toilet') || query.includes('shower')) {
        replyText = `For luxury bathrooms, we recommend a mix of:
• **Walls**: Glossy PGVT tiles (e.g. *Royal Statuario*) for an expansive, luxurious feel.
• **Floors**: Matt or rustic anti-slip GVT tiles (e.g. *Urban Concrete*) to avoid slippage.
• **Faucets**: Brushed 24k Gold PVD mixers paired with a Matte Black counter washbasin.`;
      } else if (query.includes('kitchen') || query.includes('counter')) {
        replyText = `For kitchens, durability and stain resistance are key:
• **Countertops**: Black Galaxy Granite (20mm) is heat, scratch, and acid resistant.
• **Backsplash**: Glazed Ceramic/Vitrified tiles (like *Royal Statuario*) for easy cleaning.
• **Faucets**: Aura tall basin mixer with kerox ceramic cartridges for drip-free usage.`;
      } else if (query.includes('outdoor') || query.includes('parking') || query.includes('patio')) {
        replyText = `For outdoor and parking areas, we recommend **Urban Concrete GVT**. It features a 10mm thickness and an **R10 anti-slip rating** designed to handle heavy vehicular traffic and resist harsh weather.`;
      } else if (query.includes('faucet') || query.includes('basin') || query.includes('sanitary')) {
        replyText = `Our premium sanitaryware collection includes:
• **Aura Cascading Basin Mixer**: Solid brass construction with a 24k Brushed Gold PVD plating.
• **Nero Velvet Washbasin**: Tabletop oval vessel in satin matt black ceramic with an anti-microbial glaze.`;
      } else if (query.includes('install') || query.includes('clean') || query.includes('maintain') || query.includes('care')) {
        replyText = `**Care & Installation Guidelines**:
1. **Subfloor**: Ensure subfloors are completely level before tiling.
2. **Adhesive**: Use high-polymer modified tile adhesive (not plain cement) for large format slabs.
3. **Grout**: Maintain a minimum 2mm spacer joint and use water-resistant epoxy grout.
4. **Cleaning**: Clean natural marble only with neutral pH soaps. Avoid using vinegar, acids, or harsh chemicals on polished surfaces.`;
      } else if (query.includes('dealer') || query.includes('partner') || query.includes('wholesale') || query.includes('b2b') || query.includes('bulk')) {
        replyText = `Architects, builders, and interior designers can register for our [Dealer Program](/inquiry) to receive custom sample kits, priority dispatch routing, and wholesale volume discounts of up to 35%!`;
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  // Before/After Slider drag handler (optimized DOM updates)
  const updateSlider = (clientX) => {
    if (!containerRef.current || !handleRef.current || !overlayRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    handleRef.current.style.left = `${percentage}%`;
    overlayRef.current.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
  };

  const handleMouseMove = (e) => {
    updateSlider(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updateSlider(e.touches[0].clientX);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold flex items-center justify-center gap-1.5">
          <Sparkles size={14} /> AI Design Studio
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-wide text-charcoal-900 dark:text-white mt-2">
          AI Tile Assistant & Visualizer
        </h1>
        <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2">
          Upload a photo of your house floor or wall, and our AI interior consultant will recommend premium tiling and overlay the preview instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: AI Chatbot Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-panel rounded-2xl border border-gold/15 dark:border-gold/10 overflow-hidden h-[70vh]">
          
          {/* Chat Header */}
          <div className="bg-charcoal-900 p-4 border-b border-gold/15 flex items-center gap-3">
            <span className="bg-gold/10 text-gold p-2 rounded-full flex items-center justify-center">
              <Bot size={18} />
            </span>
            <div>
              <h3 className="font-serif text-xs sm:text-sm font-bold text-white uppercase tracking-wider">AI Design Assistant</h3>
              <span className="text-[9px] text-green-500 font-bold block mt-0.5">● Consultant Online</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                  msg.sender === 'user' ? 'bg-gold text-black' : 'bg-charcoal-800 text-gold'
                }`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </span>

                {/* Message Bubble */}
                <div className={`p-3.5 rounded-2xl border text-[11px] leading-relaxed space-y-3 ${
                  msg.sender === 'user' 
                    ? 'bg-gold/10 border-gold/30 text-charcoal-900 dark:text-gold-light rounded-tr-none' 
                    : 'bg-white/5 dark:bg-black/20 border-white/10 text-charcoal-900 dark:text-charcoal-350 rounded-tl-none'
                }`}>
                  {/* Photo attachment representation if present */}
                  {msg.image && (
                    <img src={msg.image} alt="Uploaded Room" className="w-40 rounded-lg object-cover aspect-video border border-white/10" />
                  )}
                  
                  {/* Text body */}
                  <p className="whitespace-pre-line font-light">
                    {parseMessageText(msg.text)}
                  </p>

                  {/* Recommendation Card Shortcut inside Chat */}
                  {msg.recommendedProduct && (
                    <div className="mt-4 p-2 bg-charcoal-900/60 dark:bg-black/50 border border-gold/20 rounded-xl flex items-center gap-3">
                      <img src={msg.recommendedProduct.images[0]} alt="" className="w-12 h-12 object-cover rounded bg-charcoal-800" />
                      <div className="flex-grow">
                        <h4 className="font-serif font-bold text-white line-clamp-1">{msg.recommendedProduct.name}</h4>
                        <span className="text-[9px] text-gold uppercase tracking-wider font-semibold">{msg.recommendedProduct.category}</span>
                      </div>
                      <Link 
                        href={`/catalog/${msg.recommendedProduct.id}`}
                        className="bg-gold text-black rounded p-1.5 hover:bg-gold-dark transition-colors"
                        title="View specifications"
                      >
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* AI Typing Loader */}
            {isAnalyzing && (
              <div className="flex gap-3 max-w-[80%]">
                <span className="w-8 h-8 rounded-full bg-charcoal-800 text-gold flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Bot size={14} />
                </span>
                <div className="p-3.5 rounded-2xl border border-white/10 bg-white/5 dark:bg-black/20 text-[10px] text-gold font-semibold flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin" />
                  AI is analyzing layout geometry...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Panel Form */}
          <form onSubmit={handleTextSubmit} className="p-4 border-t border-white/10 bg-charcoal-900/10 flex items-center gap-3">
            
            {/* Image Uploader icon */}
            <label className="bg-white/5 dark:bg-black/20 border border-white/10 hover:border-gold hover:text-gold p-2.5 rounded-full cursor-pointer transition-colors flex items-center justify-center text-charcoal-600 dark:text-charcoal-400">
              <Upload size={16} />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
            </label>

            {/* Text Input */}
            <input 
              type="text" 
              placeholder="Ask about size specs, pricing, or layouts..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow bg-white/5 dark:bg-black/20 border border-white/10 rounded-full px-4 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold"
            />

            {/* Send Button */}
            <button 
              type="submit"
              className="bg-gold text-black rounded-full p-2.5 hover:bg-gold-dark transition-colors flex items-center justify-center"
            >
              <Send size={14} />
            </button>

          </form>

        </div>

        {/* RIGHT COLUMN: AI Live Room Overlay Canvas Visualizer (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {uploadedPhoto ? (
            <div className="space-y-4">
              
              {/* Canvas Container */}
              <div 
                ref={containerRef}
                className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gold/20 shadow-2xl cursor-ew-resize select-none bg-charcoal-900"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                
                {/* Background Room Image - Left Side (Original / Before) */}
                <img 
                  src={uploadedPhoto} 
                  alt="Original Uploaded Room" 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none filter brightness-95"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-xs px-3 py-1 rounded text-white border border-white/10 z-20 pointer-events-none">
                  Before: Original Floor
                </div>

                {/* Split Overlay Side - Right Side (Tile Texture Repeat Blend / After) */}
                <div 
                  ref={overlayRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
                >
                  {/* After Base Room Image */}
                  <img 
                    src={uploadedPhoto} 
                    alt="AI Visualized Room" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none filter brightness-95"
                  />
                  
                  {/* Repeating overlay tile textures recommended by AI */}
                  <div 
                    className="absolute inset-0 mix-blend-overlay opacity-75 pointer-events-none"
                    style={{
                      backgroundImage: `url(${recommendedTile.images[0]})`,
                      backgroundSize: '180px 180px',
                      backgroundRepeat: 'repeat',
                      transform: 'perspective(600px) rotateX(45deg) scaleY(1.5)',
                      transformOrigin: 'bottom center'
                    }}
                  />

                  <div 
                    className="absolute inset-0 mix-blend-multiply opacity-25 pointer-events-none"
                    style={{
                      backgroundImage: `url(${recommendedTile.images[0]})`,
                      backgroundSize: '180px 180px',
                      backgroundRepeat: 'repeat',
                      transform: 'perspective(600px) rotateX(45deg) scaleY(1.5)',
                      transformOrigin: 'bottom center'
                    }}
                  />

                  <div className="absolute top-4 right-4 bg-gold text-xs px-3 py-1 rounded text-black font-semibold z-20 pointer-events-none">
                    After: {recommendedTile.name}
                  </div>
                </div>

                {/* Center Slider handle bar */}
                <div 
                  ref={handleRef}
                  className="absolute inset-y-0 w-0.5 bg-gold shadow-lg z-30 pointer-events-none"
                  style={{ left: '50%' }}
                >
                  <div className="absolute top-1/2 -left-3.5 transform -translate-y-1/2 bg-gold text-black text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow pointer-events-none">
                    ↔
                  </div>
                </div>

              </div>

              {/* Specs Grid */}
              <div className="glass-panel p-6 rounded-2xl border border-gold/15 dark:border-gold/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-charcoal-600 dark:text-charcoal-400 block mb-1">Room Detected</span>
                  <strong className="text-charcoal-900 dark:text-white font-bold">{roomType}</strong>
                </div>
                <div>
                  <span className="text-charcoal-600 dark:text-charcoal-400 block mb-1">Recommended Tile</span>
                  <strong className="text-charcoal-900 dark:text-white font-bold">{recommendedTile.name}</strong>
                </div>
                <div>
                  <span className="text-charcoal-600 dark:text-charcoal-400 block mb-1">Thickness / Size</span>
                  <strong className="text-charcoal-900 dark:text-white font-bold">{recommendedTile.thickness || '9.5mm'} ({recommendedTile.size})</strong>
                </div>
                <div>
                  <span className="text-charcoal-600 dark:text-charcoal-400 block mb-1">Price / Box</span>
                  <strong className="text-gold font-serif text-sm font-bold">₹{recommendedTile.discountPrice || recommendedTile.price}</strong>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-grow border-2 border-dashed border-gold/30 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[350px] bg-white/5 dark:bg-black/20">
              <span className="bg-gold/10 text-gold p-5 rounded-full mb-4">
                <ImageIcon size={32} />
              </span>
              <h3 className="font-serif text-lg font-bold text-charcoal-900 dark:text-white">AI Visualizer Canvas</h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2 max-w-sm mx-auto leading-relaxed">
                No room photo has been uploaded. Upload a picture using the **Attach Upload Button** in the AI Chatbot panel to trigger visual analysis and overlay recommendations side-by-side.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
