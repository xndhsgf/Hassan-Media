import { useStore } from '../store/useStore';
import { Package, User as UserIcon, Mail, Shield, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user, allOrders, whatsappNumber } = useStore();
  const { t } = useTranslation();
  const myOrders = allOrders.filter(o => o.userId === user?.id);

  const handleContactWhatsApp = (order: any) => {
    const text = `${t('cart.whatsappMessageIntro')}\n\n` + 
    `Order ID: #${order.id}\n` +
    `Date: ${new Date(order.date).toLocaleDateString()}\n\n` +
    order.items.map((i: any) => {
      return `- ${i.quantity}x ${i.product.name} ${i.selectedDuration ? `(${i.selectedDuration.label})` : ''}`;
    }).join('\n') +
    `\n\nTotal: ${(order.total || 0).toLocaleString()} ${t('common.currency')}\n` +
    `Status: ${order.status}`;
    
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('dashboard.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center text-slate-600 text-sm gap-2">
                 <Mail className="w-4 h-4 text-slate-400" />
                 {user.email}
              </div>
              <div className="flex items-center text-slate-600 text-sm gap-2">
                 <UserIcon className="w-4 h-4 text-slate-400" />
                 {t('dashboard.role')}: <span className="capitalize font-semibold">{user.role}</span>
              </div>
              <div className="flex items-center text-slate-600 text-sm gap-2">
                 <Shield className="w-4 h-4 text-emerald-500" />
                 {t('dashboard.activeSecured')}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-500" />
                {t('dashboard.orderHistory')}
              </h2>
              
              {myOrders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 border border-slate-100 border-dashed rounded-xl">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">{t('dashboard.noOrders')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map(order => (
                    <div key={order.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center text-sm">
                        <div>
                          <p className="text-slate-500 font-medium">{t('dashboard.orderPlaced')}</p>
                          <p className="font-bold text-slate-900">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-medium">{t('common.total')}</p>
                          <p className="font-bold text-slate-900">{(order.total || 0).toLocaleString()} {t('common.currency')}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-medium">{t('dashboard.orderId')}</p>
                          <p className="font-bold text-slate-900">#{order.id}</p>
                        </div>
                        <div>
                           <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                              order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {order.status === 'Completed' ? t('dashboard.completed') : 
                               order.status === 'Pending' ? t('dashboard.pending') : t('dashboard.cancelled')}
                            </span>
                        </div>
                        <button 
                          onClick={() => handleContactWhatsApp(order)}
                          className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {t('common.contactWhatsApp')}
                        </button>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                             <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                             <div>
                                <h4 className="font-bold text-slate-900">{item.product.name}</h4>
                                <p className="text-slate-500 text-sm">{t('cart.qty')}: {item.quantity} {item.selectedDuration && `(${item.selectedDuration.label})`}</p>
                             </div>
                          </div>
                        ))}
                      </div>

                      {order.status === 'Completed' && order.keys && order.keys.length > 0 && (
                        <div className="p-4 border-t border-slate-100 bg-emerald-50/50">
                          <p className="font-bold text-emerald-800 text-sm mb-2">{t('dashboard.yourKeys')}</p>
                          <div className="space-y-2">
                            {order.keys.map((key, idx) => (
                              <div key={idx} className="bg-white border border-emerald-100 p-3 rounded-lg font-mono text-sm text-emerald-700 break-all shadow-sm">
                                <span className="font-bold text-xs text-emerald-500 uppercase block mb-1">{key.productName}</span>
                                {key.value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
