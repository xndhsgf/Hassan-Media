import { useStore } from '../../store/useStore';
import { PackageSearch } from 'lucide-react';

export default function AdminOrders() {
  const { allOrders, updateOrderStatus, user } = useStore();

  if (user?.role !== 'admin') {
     return <div className="p-8">Access Denied. Admins Only.</div>;
  }

  const handleStatusChange = (orderId: string, status: 'Completed' | 'Pending' | 'Failed') => {
    updateOrderStatus(orderId, status);
  };

  const getOrderStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Manage Orders</h1>
        <p className="text-sm text-slate-500">View and update customer orders.</p>
      </div>

      {allOrders.length === 0 ? (
         <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center text-slate-500">
            <PackageSearch className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No orders found</h3>
            <p className="text-sm">You haven't received any orders yet.</p>
         </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 sm:px-6 py-4 font-medium">Order ID</th>
                  <th className="px-4 sm:px-6 py-4 font-medium">Date</th>
                  <th className="px-4 sm:px-6 py-4 font-medium">Customer Email</th>
                  <th className="px-4 sm:px-6 py-4 font-medium">Items</th>
                  <th className="px-4 sm:px-6 py-4 font-medium">Method</th>
                  <th className="px-4 sm:px-6 py-4 font-medium">Total</th>
                  <th className="px-4 sm:px-6 py-4 font-medium">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 relative group">
                    <td className="px-4 sm:px-6 py-4 font-mono font-medium text-slate-900 text-xs sm:text-sm">{order.id}</td>
                    <td className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-4 sm:px-6 py-4 text-slate-900 font-medium text-xs sm:text-sm">{order.userEmail}</td>
                    <td className="px-4 sm:px-6 py-4">
                       <ul className="text-xs text-slate-600">
                          {order.items.map(item => <li key={item.product.id}>{item.quantity}x {item.product.name}</li>)}
                       </ul>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                       <span className={`px-2 py-1 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider ${order.method === 'WhatsApp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                         {order.method}
                       </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-900">${order.total.toFixed(2)}</td>
                    <td className="px-4 sm:px-6 py-4">
                       <select 
                         value={order.status}
                         onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                         className={`px-3 py-1.5 text-xs font-semibold outline-none cursor-pointer rounded-lg border focus:ring-2 focus:ring-indigo-500/20 ${getOrderStatusColor(order.status)}`}
                       >
                         <option value="Pending" className="text-slate-900 bg-white">Pending</option>
                         <option value="Completed" className="text-slate-900 bg-white">Completed</option>
                         <option value="Failed" className="text-slate-900 bg-white">Failed</option>
                       </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
