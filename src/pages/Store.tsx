import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Category } from '../data/mockData';
import { useStore } from '../store/useStore';
import { ShoppingCart, Filter, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const categories: Category[] = ['AI Tools', 'Design Tools', 'Operating Systems', 'Security', 'Productivity'];

export default function Store() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catFilter = searchParams.get('cat');
  const { addToCart, products } = useStore();
  
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>(
    (catFilter as Category) || 'All'
  );

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleCategoryClick = (cat: Category | 'All') => {
    setActiveCategory(cat);
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ cat });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Our Store</h1>
        <p className="text-slate-500">Find the perfect digital product for your needs.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        {/* Mobile Categories (Horizontal Scroll) */}
        <div className="md:hidden flex overflow-x-auto gap-2 pb-2 mb-2 scrollbar-hide -mx-4 px-4">
          <button 
            onClick={() => handleCategoryClick('All')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeCategory === 'All' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
          >
            All Products
          </button>
          {categories.map(c => (
            <button 
              key={c}
              onClick={() => handleCategoryClick(c)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeCategory === c ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Desktop Sidebar Filter */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-24">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4" /> Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleCategoryClick('All')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${activeCategory === 'All' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-600 font-medium'}`}
                >
                  All Products
                </button>
              </li>
              {categories.map(c => (
                <li key={c}>
                  <button 
                    onClick={() => handleCategoryClick(c)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${activeCategory === c ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-600 font-medium'}`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id} 
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col group p-4 pointer-events-auto"
                >
                  <Link to={`/product/${product.id}`} className="aspect-[4/3] w-full rounded-xl bg-slate-100 mb-4 overflow-hidden relative block">
                    <div className="absolute top-2 left-2 flex gap-1 z-10 flex-col">
                      <span className="bg-slate-900/90 backdrop-blur px-2 py-1 text-[10px] uppercase font-bold text-white rounded shadow-sm flex items-center gap-1 w-fit">
                        <Tag className="w-3 h-3" /> {product.type}
                      </span>
                      {product.offerBadge && (
                        <span className="bg-amber-500 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded shadow-sm w-fit">
                          {product.offerBadge}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && (
                       <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-[10px] uppercase font-bold rounded shadow-sm z-10">
                          -{Math.round(((product.originalPrice - (product.priceUsd || product.price)) / product.originalPrice) * 100)}%
                       </div>
                    )}
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  </Link>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{product.category}</div>
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{product.duration}</span>
                    </div>
                    <Link to={`/product/${product.id}`} className="font-bold text-slate-900 text-base leading-snug mb-2 hover:text-indigo-600 transition-colors">{product.name}</Link>
                    
                    <ul className="text-xs text-slate-500 mb-4 space-y-1.5 flex-1 font-medium">
                      {product.features && product.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5"><span className="text-indigo-400">•</span> {feat}</li>
                      ))}
                    </ul>

                    <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-end gap-2">
                          <span className="text-xl font-black text-slate-900">${Number(product.priceUsd || product.price).toFixed(2)}</span>
                          {product.originalPrice && <span className="text-sm text-slate-400 line-through mb-1">${Number(product.originalPrice).toFixed(2)}</span>}
                        </div>
                        <span className="text-xs font-bold text-slate-500">{Number(product.priceEgp || (product.price * 50)).toFixed(2)} EGP</span>
                      </div>
                      <button 
                        onClick={(e) => { e.preventDefault(); addToCart(product); }}
                        className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl w-10 h-10 flex items-center justify-center transition-colors shrink-0 shadow-sm shadow-slate-900/20 hover:shadow-indigo-600/30 active:scale-95"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl mt-4 bg-slate-50">
              <p className="text-slate-500 text-lg font-medium">No products found for this category.</p>
              <button 
                 onClick={() => handleCategoryClick('All')}
                 className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
              >
                 View All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
