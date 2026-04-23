import { useStore } from '../store/useStore';
import { Package, Key, Calendar, Copy, CheckCircle2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export default function Dashboard() {
  const { user, allOrders } = useStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!user) {
    return <div className="p-20 text-center text-slate-500">Please login to view your dashboard.</div>;
  }

  // Filter orders for the current user
  const myOrders = allOrders.filter(o => o.userId === user.id);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getOrderStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full overflow-hidden">
       <div className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">My Dashboard</h1>
            <p className="text-slate-500 text-sm sm:text-base">Manage your purchases, subscriptions, and account details.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
             </div>
          </div>
       </div>

       {myOrders.length === 0 ? (
         <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No orders yet</h3>
            <p className="text-sm sm:text-base">You haven't purchased any licenses or accounts yet.</p>
         </div>
       ) : (
         <div className="space-y-8 sm:space-y-12">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 mb-4 sm:mb-6">
                <Key className="w-5 h-5 text-indigo-600 shrink-0" /> My Digital Library (Keys & Accounts)
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {myOrders.map((order) => (
                  order.keys && order.keys.length > 0 ? (
                    order.keys.map((keyItem, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={`${order.id}-${idx}`} 
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                      >
                        <div className="bg-slate-50 border-b border-slate-100 p-3 sm:p-4 flex justify-between items-center">
                           <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest">{keyItem.type}</p>
                           <span className="text-[10px] sm:text-xs font-medium text-slate-400">Order: {order.id}</span>
                        </div>
                        <div className="p-4 sm:p-5 flex flex-col gap-4">
                           <h3 className="font-bold text-slate-900 text-sm sm:text-base">{keyItem.productName}</h3>
                           
                           <div className="bg-slate-900 text-slate-50 p-3 sm:p-4 rounded-xl relative flex justify-between items-center gap-2 group">
                             <code className="font-mono text-xs sm:text-sm tracking-wide break-all block">
                               {keyItem.value}
                             </code>
                             <button 
                                onClick={() => handleCopy(keyItem.value)}
                                className="shrink-0 p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white transition active:scale-95"
                                title="Copy to clipboard"
                             >
                                {copiedKey === keyItem.value ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                             </button>
                             <AnimatePresence>
                               {copiedKey === keyItem.value && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                  className="absolute -top-8 right-0 bg-emerald-500 text-white text-[10px] py-1 px-2 rounded font-bold shadow-lg"
                                >
                                  Copied!
                                </motion.div>
                               )}
                             </AnimatePresence>
                           </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    order.method === 'WhatsApp' ? (
                       <div key={order.id} className="bg-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start gap-4">
                          <MessageCircle className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
                          <div>
                             <h3 className="font-bold text-orange-900 mb-1 text-sm sm:text-base">WhatsApp Order Processing</h3>
                             <p className="text-xs sm:text-sm text-orange-800 leading-relaxed">Your order {order.id} is pending manual processing via WhatsApp. We will deliver the keys shortly via chat or email.</p>
                          </div>
                       </div>
                    ) : null
                  )
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 mb-4 sm:mb-6">
                <Calendar className="w-5 h-5 text-indigo-600 shrink-0" /> Order History
              </h2>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-slate-500 min-w-[700px]">
                      <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200 whitespace-nowrap">
                         <tr>
                            <th className="px-4 sm:px-6 py-4">Order ID</th>
                            <th className="px-4 sm:px-6 py-4">Date</th>
                            <th className="px-4 sm:px-6 py-4">Items</th>
                            <th className="px-4 sm:px-6 py-4">Total</th>
                            <th className="px-4 sm:px-6 py-4">Method</th>
                            <th className="px-4 sm:px-6 py-4">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 whitespace-nowrap">
                         {myOrders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50 transition">
                               <td className="px-4 sm:px-6 py-4 font-mono font-medium text-slate-900 text-xs sm:text-sm">{order.id}</td>
                               <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">{new Date(order.date).toLocaleDateString()}</td>
                               <td className="px-4 sm:px-6 py-4">
                                  {order.items.map(item => (
                                     <div key={item.product.id} className="text-xs text-slate-700">
                                        {item.quantity}x {item.product.name}
                                     </div>
                                  ))}
                               </td>
                               <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 text-sm">${order.total.toFixed(2)}</td>
                               <td className="px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-semibold uppercase">{order.method}</td>
                               <td className="px-4 sm:px-6 py-4">
                                  <span className={`px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full border ${getOrderStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                 </div>
              </div>
            </div>
         </div>
       )}
    </div>
  );
}
