import { useStore } from '../store/useStore';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function Store() {
  const { products } = useStore();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('store.title')}</h1>
          <p className="text-slate-500 max-w-2xl">{t('store.desc')}</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('store.search')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full sm:w-48 pl-12 pr-8 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm appearance-none bg-white"
            >
              <option value="">{t('store.allProducts')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const discountedPrice = product.discountPercentage 
            ? product.price * (1 - product.discountPercentage / 100)
            : product.price;

          return (
            <Link key={product.id} to={`/product/${product.id}`} className="bg-white group rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                  {product.type}
                </div>
                {product.discountPercentage && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md shadow-red-500/20">
                    {product.discountPercentage}% OFF
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-indigo-600">
                      {(discountedPrice || 0).toLocaleString()} {t('common.currency')}
                    </span>
                    {product.discountPercentage && (
                      <span className="text-xs font-semibold text-slate-400 line-through decoration-slate-300">
                        {(product.price || 0).toLocaleString()} {t('common.currency')}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600 flex items-center transition-colors">
                    Details <ArrowRight className="w-4 h-4 ml-1 rtl:hidden rtl:-scale-x-100" />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t('store.noProducts')}</h3>
          <p className="text-slate-500">{t('store.noProducts')}</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
            className="mt-6 px-6 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {t('store.allProducts')}
          </button>
        </div>
      )}
    </div>
  );
}
