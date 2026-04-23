import { Link, useNavigate } from 'react-router';
import { useStore } from '../store/useStore';
import { Trash2, ShieldCheck, Lock, ShoppingCart, MessageCircle, ArrowRight, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PaymentMethod } from '../data/mockData';

export default function Cart() {
  const { cart, removeFromCart, placeOrder, clearCart, whatsappNumber, user, paymentMethods } = useStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  
  const subtotalUsb = cart.reduce((sum, item) => sum + ((item.product.priceUsd || item.product.price) * item.quantity), 0);
  const subtotalEgp = cart.reduce((sum, item) => sum + ((item.product.priceEgp || (item.product.price * 50)) * item.quantity), 0);
  const tax = 0; // Tax free digital goods
  
  const totalUsd = subtotalUsb + tax;
  const totalEgp = subtotalEgp + (tax * 50);

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    if (!selectedMethod) return alert("Please select a payment method.");
    setIsProcessing(true);
    placeOrder('WhatsApp'); // Assuming manual flow saves it as Whatsapp or manual

    let text = `Hello! I would like to order the following products:\n\n`;
    cart.forEach(item => {
      text += `- ${item.quantity}x ${item.product.name} (${Number(item.product.priceEgp || (item.product.price * 50)).toFixed(2)} EGP)\n`;
    });
    text += `\n*Total: ${totalEgp.toFixed(2)} EGP*\n\n`;
    text += `Payment Method: ${selectedMethod.name}\n`;
    text += `I have successfully transferred the amount. Please verify and send the products!`;
    
    setTimeout(() => {
      setIsProcessing(false);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
      navigate('/dashboard'); 
    }, 1500);
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
                    <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between w-full sm:w-auto gap-2 sm:gap-4 shrink-0">
                      <div className="flex flex-col items-center sm:items-end justify-center w-full sm:w-auto gap-1 sm:gap-2 shrink-0">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">${((item.product.priceUsd || item.product.price) * item.quantity).toFixed(2)}</span>
                        <span className="font-bold text-slate-500 text-xs">{((item.product.priceEgp || item.product.price * 50) * item.quantity).toFixed(2)} EGP</span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 ml-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
          
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-6 lg:mb-0">
             <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-indigo-600"/> Payment Methods</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map(method => (
                  <label key={method.id} className={`border rounded-xl p-4 cursor-pointer flex flex-col gap-3 transition-colors ${selectedMethod?.id === method.id ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex justify-between items-center">
                      <input 
                        type="radio" 
                        name="payment_method" 
                        className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-600"
                        onChange={() => setSelectedMethod(method)}
                        checked={selectedMethod?.id === method.id}
                      />
                      {method.imageUrl && <img src={method.imageUrl} alt={method.name} className="h-6 object-contain" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight mb-1">{method.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">Account: <span className="text-slate-900">{method.accountNumber}</span></p>
                    </div>
                    {selectedMethod?.id === method.id && (
                       <div className="bg-white border text-xs text-slate-600 border-indigo-100 p-3 rounded-lg mt-2">
                         {method.instructions}
                       </div>
                    )}
                  </label>
                ))}
                {paymentMethods.length === 0 && (
                  <p className="col-span-full text-slate-500 text-sm">No payment methods available.</p>
                )}
             </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal (USD)</span>
                <span className="font-medium text-slate-900">${subtotalUsb.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal (EGP)</span>
                <span className="font-medium text-slate-900">{subtotalEgp.toFixed(2)} EGP</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                <span className="text-base font-bold text-slate-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalEgp.toFixed(2)}</span>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium">EGP</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleCheckout}
                disabled={isProcessing || !selectedMethod}
                className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-4 sm:px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors disabled:opacity-75 disabled:cursor-not-allowed group text-sm sm:text-base"
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    I have transferred<ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition shrink-0 ml-1" />
                  </>
                )}
              </button>
              {!selectedMethod && (
                 <p className="text-xs text-red-500 text-center mt-1 font-medium">Please select a payment method</p>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
