"use client";

import { useState } from "react";
import { createSale } from "@/app/actions/pos";
import { logoutAction } from "@/app/actions/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Plus, Minus, Trash2, LogOut, CheckCircle2 } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string | null;
};

type CartItem = Product & { quantity: number };

export default function POSClient({ initialProducts, user }: { initialProducts: Product[], user: any }) {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerData, setCustomerData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    paymentMethod: "CASH"
  });

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        if (newQ > 0 && newQ <= item.stock) return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const confirmCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckoutModal(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const items = cart.map(c => ({ productId: c.id, quantity: c.quantity, price: c.price }));
      await createSale(items, customerData);
      
      setProducts(prev => prev.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) return { ...p, stock: p.stock - cartItem.quantity };
        return p;
      }));
      
      setCart([]);
      setShowCheckoutModal(false);
      setCustomerData({ customerName: "", customerPhone: "", customerAddress: "", paymentMethod: "CASH" });
      setSuccessMsg("Transaction successful!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      alert("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0E14] text-white overflow-hidden selection:bg-yellow-500 selection:text-black">
      {/* Left Panel: Products */}
      <div className="flex-1 flex flex-col h-full border-r border-white/10 relative">
        <header className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md z-10">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">POCO POS</h1>
            <p className="text-sm text-gray-400">Cashier: {user?.username}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all text-sm w-64"
              />
            </div>
            {user?.role === 'ADMIN' && (
              <a href="/admin" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition-colors">
                Admin Panel
              </a>
            )}
            <button onClick={() => logoutAction()} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`group relative bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer overflow-hidden hover:border-yellow-500/50 transition-all ${product.stock <= 0 ? 'opacity-50 grayscale' : 'hover:bg-white/10'}`}
                >
                  <div className="h-32 mb-4 rounded-xl overflow-hidden bg-black/50 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <ShoppingCart className="text-gray-600" size={32} />
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-yellow-400 font-semibold">Rp {product.price.toLocaleString('id-ID')}</span>
                    <span className={`${product.stock <= 5 ? 'text-red-400 font-bold' : 'text-gray-400'}`}>Stock: {product.stock}</span>
                  </div>
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Checkout Modal */}
        <AnimatePresence>
          {showCheckoutModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#11151c] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-xl font-bold">Complete Transaction</h2>
                  <p className="text-sm text-gray-400 mt-1">Total Payment: <span className="text-yellow-400 font-bold text-lg">Rp {Math.floor(total * 1.11).toLocaleString('id-ID')}</span></p>
                </div>
                <form onSubmit={handleCheckout} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Customer Name *</label>
                    <input 
                      required
                      type="text" 
                      value={customerData.customerName}
                      onChange={e => setCustomerData({...customerData, customerName: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number *</label>
                    <input 
                      required
                      type="text" 
                      value={customerData.customerPhone}
                      onChange={e => setCustomerData({...customerData, customerPhone: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="e.g. 08123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Address *</label>
                    <textarea 
                      required
                      value={customerData.customerAddress}
                      onChange={e => setCustomerData({...customerData, customerAddress: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500 transition-colors"
                      rows={2}
                      placeholder="Delivery / Customer Address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Payment Method</label>
                    <select 
                      value={customerData.paymentMethod}
                      onChange={e => setCustomerData({...customerData, paymentMethod: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="CASH">Cash (Tunai)</option>
                      <option value="TRANSFER">Bank Transfer</option>
                      <option value="EWALLET">E-Wallet (GoPay, OVO, dll)</option>
                    </select>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setShowCheckoutModal(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isProcessing} className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors disabled:opacity-50">
                      {isProcessing ? 'Processing...' : 'Confirm Payment'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Panel: Cart */}
      <div className="w-96 flex flex-col h-full bg-[#11151c] z-10">
        <header className="p-6 border-b border-white/10 bg-black/20">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart size={20} className="text-yellow-500" />
            Current Order
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-gray-500">
                <ShoppingCart size={48} className="mb-4 opacity-20" />
                <p>Cart is empty</p>
              </motion.div>
            ) : (
              cart.map(item => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key={item.id} 
                  className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-xs text-gray-400">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 p-1 bg-red-400/10 rounded-md transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-yellow-400">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    <div className="flex items-center gap-3 bg-black/50 rounded-lg p-1 border border-white/10">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-300"><Minus size={14} /></button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-300"><Plus size={14} /></button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-black/40 border-t border-white/10 relative">
          <AnimatePresence>
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute -top-12 left-4 right-4 bg-green-500/20 border border-green-500/50 text-green-400 p-2 rounded-lg text-sm flex items-center justify-center gap-2 backdrop-blur-md z-20"
              >
                <CheckCircle2 size={16} />
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Subtotal</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Tax (11%)</span>
              <span>Rp {Math.floor(total * 0.11).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-2xl font-black pt-4 border-t border-white/10">
              <span>Total</span>
              <span className="text-yellow-400">Rp {Math.floor(total * 1.11).toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          <button 
            onClick={confirmCheckout}
            disabled={cart.length === 0}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-bold rounded-xl shadow-[0_0_20px_-5px_rgba(234,179,8,0.4)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Charge 
          </button>
        </div>
      </div>
    </div>
  );
}
