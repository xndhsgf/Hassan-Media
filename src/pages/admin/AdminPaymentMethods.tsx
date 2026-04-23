import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

export default function AdminPaymentMethods() {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, user } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    accountNumber: '',
    instructions: ''
  });

  if (user?.role !== 'admin') {
     return <div className="p-8">Access Denied. Admins Only.</div>;
  }

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', imageUrl: '', accountNumber: '', instructions: '' });
    setIsModalOpen(true);
  };

  const openEdit = (m: any) => {
    setEditingId(m.id);
    setFormData({ 
      name: m.name, 
      imageUrl: m.imageUrl, 
      accountNumber: m.accountNumber,
      instructions: m.instructions
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePaymentMethod(editingId, formData);
    } else {
      addPaymentMethod(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Methods</h1>
          <p className="text-sm text-slate-500">Manage manual payment options for checkout.</p>
        </div>
        <button 
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Method</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-4 relative shadow-sm hover:shadow-md transition">
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => openEdit(m)} className="p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition rounded">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => deletePaymentMethod(m.id)} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 mb-4">
              {m.imageUrl ? (
                <img src={m.imageUrl} alt={m.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-400" />
              )}
            </div>
            
            <h3 className="font-bold text-slate-900 text-lg mb-1">{m.name}</h3>
            <p className="text-slate-600 text-sm font-medium mb-3">{m.accountNumber}</p>
            <p className="text-slate-500 text-xs line-clamp-2">{m.instructions}</p>
          </div>
        ))}
        {paymentMethods.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl">
             No payment methods added yet.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 z-10 bg-white rounded-full p-1">
              <X className="w-6 h-6" />
            </button>
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{editingId ? 'Edit Method' : 'Add New Method'}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Method Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Vodafone Cash" className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                  <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Account Number / Link</label>
                  <input type="text" required value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} placeholder="e.g. 0100000000" className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Instructions for User</label>
                  <textarea required value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})} placeholder="Transfer exactly XYZ amount..." className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-20 resize-none" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
