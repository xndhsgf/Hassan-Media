import { Link, useNavigate } from 'react-router';
import { useStore } from '../store/useStore';
import { Trash2, ShieldCheck, Lock, ShoppingCart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, placeOrder, clearCart, whatsappNumber, user } = useStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = 0; // Tax free digital goods
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    setIsProcessing(true);
    setTimeout(() => {
      placeOrder('Auto');
      setIsProcessing(false);
      navigate('/dashboard'); 
    }, 1500);
  };

  const handleWhatsAppOrder = () => {
    if (!user) return navigate('/login');
    placeOrder('WhatsApp');
    
    // Format message
    let text = `Hello! I would like to order the following products:\n\n`;
    cart.forEach(item => {
      text += `- ${item.quantity}x ${item.product.name} ($${item.product.price})\n`;
    });
    text += `\n*Total: $${total.toFixed(2)}*\n\nPlease provide payment details.`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
    navigate('/dashboard'); 
  };

  if (cart.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/store" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full overflow-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="flex-1 w-full min-w-0">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden w-full">
            <div className="p-4 sm:p-6 pb-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-semibold text-slate-900 text-sm sm:text-base">Items ({cart.length})</h2>
              <button onClick={clearCart} className="text-[10px] sm:text-xs font-semibold text-slate-500 hover:text-red-500 uppercase tracking-widest">Clear All</button>
            </div>
            <ul className="divide-y divide-slate-100">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.li 
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                       <span className="absolute top-1 left-1 bg-white/90 px-1 py-0.5 text-[8px] uppercase font-bold rounded shadow-sm z-10">{item.product.type}</span>
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1 truncate">{item.product.name}</h3>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 sm:gap-4 shrink-0">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">${(item.product.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
          
          <div className="mt-6 flex items-start sm:items-center p-4 bg-emerald-50 rounded-xl text-emerald-800 text-xs sm:text-sm border border-emerald-100">
             <ShieldCheck className="w-5 h-5 mr-3 text-emerald-600 shrink-0 mt-0.5 sm:mt-0"/>
             <p className="leading-relaxed"><strong>Auto-Delivery Active:</strong> Your digital items will be instantly available in your dashboard and emailed to you right after checkout via Stripe.</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax</span>
                <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                <span className="text-base font-bold text-slate-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">${total.toFixed(2)}</span>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium">USD</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-4 sm:px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors disabled:opacity-75 disabled:cursor-not-allowed group text-sm sm:text-base"
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-400 group-hover:text-white transition shrink-0" /> Checkout with Card
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center py-2">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                 <span className="relative bg-white px-2 text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider">OR</span>
              </div>

              <button 
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-4 sm:px-6 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-xl font-bold transition-colors shadow-lg shadow-green-500/20 text-sm sm:text-base"
              >
                <MessageCircle className="w-5 h-5 shrink-0" /> Order via WhatsApp
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 sm:h-6" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3 sm:h-4 mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
