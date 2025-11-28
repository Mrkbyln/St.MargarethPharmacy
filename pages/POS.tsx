import React, { useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { Medicine, CartItem } from '../types';
import { Search, Plus, Minus, Trash, ShoppingCart, CheckCircle, X } from 'lucide-react';

const POS: React.FC = () => {
  const { medicines, processSale, currencySymbol } = usePharmacy();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter products
  const products = medicines.filter(m => 
    (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    m.stock_qty > 0 &&
    new Date(m.expiry_date) > new Date() // Don't sell expired items
  );

  const addToCart = (med: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) {
        if (existing.quantity >= med.stock_qty) return prev; // Check stock limit
        return prev.map(item => 
          item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...med, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > item.stock_qty) return item; // Max stock check
        if (newQty < 1) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    processSale(cart);
    setCart([]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-6rem)]">
      {/* Left Column: Product Selection */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden h-[600px] lg:h-auto">
        <div className="p-4 border-b border-gray-100 bg-[var(--color-light)] sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search medicines by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all shadow-sm bg-white"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(product => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-[var(--color-primary)] hover:ring-1 hover:ring-[var(--color-primary)] transition-all group flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 min-w-[2.5rem] bg-[var(--color-light)] text-[var(--color-text)] rounded-full flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-slate-900 transition-colors font-bold border border-[var(--color-border)]">
                        <span className="text-xs">{product.name.substring(0,2).toUpperCase()}</span>
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="font-bold text-slate-800 text-sm truncate">{product.name}</h3>
                        <p className="text-xs text-slate-500 truncate font-medium">{product.category}</p>
                    </div>
                </div>
                
                <div className="mt-auto flex justify-between items-center border-t border-gray-50 pt-2">
                    <span className="font-extrabold text-slate-700">{currencySymbol}{product.price.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-full">Qty: {product.stock_qty}</span>
                </div>
              </div>
            ))}
            {products.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-400 flex flex-col items-center">
                    <Search className="w-12 h-12 mb-3 opacity-20" />
                    <p className="font-medium">No medicines found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search terms</p>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Cart */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-xl shadow-lg border border-[var(--color-border)] overflow-hidden lg:h-auto h-[500px]">
        <div className="p-4 bg-[var(--color-primary)] text-slate-900 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} strokeWidth={2.5} />
            <h2 className="font-extrabold text-lg">Current Order</h2>
          </div>
          <span className="bg-white/50 px-2.5 py-1 rounded-full text-xs font-bold border border-white/20">
            {cart.reduce((a, b) => a + b.quantity, 0)} Items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                   <ShoppingCart size={32} className="opacity-30" />
                </div>
                <p className="font-medium">Cart is empty</p>
                <p className="text-xs text-gray-400">Select items to start selling</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2 relative">
                <div className="flex justify-between items-start pr-6">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{currencySymbol}{item.price.toFixed(2)} / unit</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 absolute top-2 right-2 p-1 rounded-md hover:bg-red-50 transition-colors">
                    <Trash size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-1 pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md text-gray-600 transition-all shadow-sm">
                        <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md text-gray-600 transition-all shadow-sm">
                        <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-slate-900">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-white border-t border-[var(--color-border)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sticky bottom-0 z-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">Total Amount</span>
            <span className="text-3xl font-extrabold text-slate-900">{currencySymbol}{total.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2 ${
              cart.length === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-slate-900 hover:bg-slate-800 text-[var(--color-primary)] hover:shadow-xl'
            }`}
          >
            {showSuccess ? (
                <>
                    <CheckCircle className="animate-bounce" /> Sale Recorded!
                </>
            ) : (
                `Confirm Payment`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;