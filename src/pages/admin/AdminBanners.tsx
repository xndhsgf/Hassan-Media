import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Image as ImageIcon, Trash2, Plus, Power, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminBanners() {
  const { banners, addBanner, toggleBannerStatus, deleteBanner } = useStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newLink, setNewLink] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return;
    
    addBanner({
      imageUrl: newImage,
      linkUrl: newLink,
      isActive: true
    });
    
    setIsAdding(false);
    setNewImage('');
    setNewLink('');
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Promotional Banners</h1>
          <p className="text-slate-500">Manage the hero section auto-animated banners on the homepage.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Banner</span>
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 overflow-hidden"
          >
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-500" /> New Banner Configuration
            </h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Responsive Auto-Crop)</label>
                 <input 
                   type="text" 
                   value={newImage}
                   onChange={e => setNewImage(e.target.value)}
                   className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                   placeholder="https://images.unsplash.com/photo-..."
                   required
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Target Link (Optional)</label>
                 <input 
                   type="text" 
                   value={newLink}
                   onChange={e => setNewLink(e.target.value)}
                   className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                   placeholder="/store?cat=AI Tools"
                 />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                 <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition">Cancel</button>
                 <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">Save Banner</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${banner.isActive ? 'border-slate-200 shadow-sm' : 'border-slate-200 opacity-60 grayscale'}`}>
             <div className="aspect-[3/1] w-full relative bg-slate-100">
               <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
               <div className="absolute top-2 right-2 flex gap-1">
                 <button 
                   onClick={() => toggleBannerStatus(banner.id)}
                   className={`p-1.5 rounded-lg border backdrop-blur-sm transition shadow-sm ${banner.isActive ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-slate-900/80 text-white border-slate-700'}`}
                   title={banner.isActive ? "Deactivate" : "Activate"}
                 >
                   <Power className="w-4 h-4" />
                 </button>
                 <button 
                    onClick={() => deleteBanner(banner.id)}
                    className="p-1.5 rounded-lg border border-red-400 bg-red-500/90 text-white backdrop-blur-sm transition shadow-sm hover:bg-red-600"
                    title="Delete"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             </div>
             <div className="p-4 flex items-center gap-2 text-sm text-slate-500 bg-slate-50 border-t border-slate-100">
                <Link2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{banner.linkUrl || 'No target link set'}</span>
             </div>
          </div>
        ))}

        {banners.length === 0 && !isAdding && (
          <div className="col-span-full border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500 bg-slate-50/50">
             <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-slate-900 mb-1">No banners configured</h3>
             <p className="text-sm">Upload promotional banners to display on the storefront hero section.</p>
          </div>
        )}
      </div>
    </div>
  );
}
