import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Product, ProductType, Category } from '../../data/mockData';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, user } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: 'Software',
    type: 'License Key',
    image: '',
    rating: 5,
    reviewsCount: 0,
    stock: 10,
    features: ['Instant Delivery', 'Secure Payment']
  });

  if (user?.role !== 'admin') {
     return <div className="p-8">Access Denied. Admins Only.</div>;
  }

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      name: '', description: '', price: 0, originalPrice: 0,
      category: 'Operating Systems', type: 'License Key', image: '',
      rating: 5, reviewsCount: 0, stock: 10, features: ['Instant Delivery']
    });
    setIsModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData(p);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, formData);
    } else {
      addProduct({
        ...formData,
        id: `PROD-${Date.now()}`
      } as Product);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Products</h1>
          <p className="text-sm text-slate-500">Add, edit or remove products from your store.</p>
        </div>
        <button 
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Product</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-medium">Product</th>
                <th className="px-4 sm:px-6 py-4 font-medium">Category</th>
                <th className="px-4 sm:px-6 py-4 font-medium">Type</th>
                <th className="px-4 sm:px-6 py-4 font-medium">Price</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 hidden sm:block">
                        {p.image ? (
                           <img src={p.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                           <ImageIcon className="w-5 h-5 m-auto text-slate-400 mt-2.5" />
                        )}
                      </div>
                      <div className="font-bold text-slate-900 truncate max-w-[150px] sm:max-w-[200px]">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm">{p.category}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{p.type}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 font-bold text-slate-900">${Number(p.price).toFixed(2)}</td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <button onClick={() => openEdit(p)} className="p-2 text-slate-400 hover:text-indigo-600 transition">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="p-2 text-slate-400 hover:text-red-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 z-10 bg-white rounded-full p-1">
              <X className="w-6 h-6" />
            </button>
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSave} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                    <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Original Price (optional)</label>
                    <input type="number" step="0.01" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                     <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white">
                        <option value="AI Tools">AI Tools</option>
                        <option value="Design Tools">Design Tools</option>
                        <option value="Operating Systems">Operating Systems</option>
                        <option value="Security">Security</option>
                        <option value="Productivity">Productivity</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                     <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ProductType})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white">
                        <option value="License Key">License Key</option>
                        <option value="Account">Account</option>
                        <option value="Subscription">Subscription</option>
                     </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                    <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Features (comma separated)</label>
                    <input type="text" value={formData.features?.join(', ')} onChange={e => setFormData({...formData, features: e.target.value.split(',').map(s => s.trim())})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="Feature 1, Feature 2" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-lg">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
