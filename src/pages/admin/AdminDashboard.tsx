import { useStore } from '../../store/useStore';
import { 
  DollarSign, ShoppingCart, Users, PackageOpen, 
  ArrowUpRight, ArrowDownRight, TrendingUp 
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, allOrders, products } = useStore();
  
  if (user?.role !== 'admin') {
    return <div className="p-8 text-red-500">Access Denied. Admins only.</div>;
  }

  const totalRevenue = allOrders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { name: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, change: '+14.5%', trend: 'up' },
    { name: 'Orders', value: allOrders.length.toString(), icon: ShoppingCart, change: '+5.2%', trend: 'up' },
    { name: 'Total Products', value: products.length.toString(), icon: PackageOpen, change: 'Active', trend: 'up' },
    { name: 'Pending Approvals', value: allOrders.filter(o => o.method === 'WhatsApp' && o.status === 'Pending').length.toString(), icon: TrendingUp, change: 'Action Req', trend: 'down' },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, here's your store's performance today.</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <Icon className="w-5 h-5 text-slate-700" />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded w-fit flex items-center gap-1 ${
                  stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">{stat.name}</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Mock */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col w-full">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Transactions</h3>
          </div>
          <div className="p-0 overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[500px]">
               <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 font-medium">Order ID</th>
                    <th className="px-4 sm:px-6 py-4 font-medium">Customer Email</th>
                    <th className="px-4 sm:px-6 py-4 font-medium">Amount</th>
                    <th className="px-4 sm:px-6 py-4 font-medium">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {allOrders.length === 0 && (
                    <tr><td colSpan={4} className="px-4 sm:px-6 py-8 text-center text-slate-400">No transactions recorded yet</td></tr>
                  )}
                  {allOrders.slice(0, 5).map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/50 transition">
                       <td className="px-4 sm:px-6 py-4 font-mono font-medium text-slate-600 text-xs sm:text-sm">{o.id}</td>
                       <td className="px-4 sm:px-6 py-4 text-slate-900 text-xs sm:text-sm">{o.userEmail}</td>
                       <td className="px-4 sm:px-6 py-4 font-medium text-slate-900 text-sm">${o.total.toFixed(2)}</td>
                       <td className="px-4 sm:px-6 py-4">
                         <span className={`px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full ${o.status==='Completed'?'bg-emerald-100 text-emerald-700':o.status==='Pending'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>
                           {o.status}
                         </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col w-full">
          <div className="p-5 sm:p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Active Products Overview</h3>
          </div>
          <div className="p-4 sm:p-6 flex-1 flex flex-col gap-4 sm:gap-6 max-h-[400px] overflow-y-auto">
             {products.length === 0 && <p className="text-sm text-slate-500">No products assigned yet.</p>}
             {products.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 sm:gap-4">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                      <img src={p.image} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{p.name}</h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 truncate">{p.category}</p>
                   </div>
                   <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-900">${Number(p.price).toFixed(2)}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
