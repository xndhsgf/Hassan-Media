import { useStore } from '../store/useStore';
import { ArrowRight, Tag, ShieldCheck, Zap, Star } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function Home() {
  const { products, banners, paymentMethods } = useStore();
  const { t } = useTranslation();
  const activeBanners = banners.filter(b => b.isActive);
  const activeMethods = paymentMethods ? paymentMethods.filter(m => m.isActive) : [];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="relative bg-slate-900 overflow-hidden h-[40vh] sm:h-[60vh] min-h-[300px]">
        {activeBanners.length > 0 ? (
          <>
             {activeBanners.map((banner, index) => (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentSlide === index ? 1 : 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                  style={{ pointerEvents: currentSlide === index ? 'auto' : 'none' }}
                >
                  <img src={banner.imageUrl} alt="Offer" className="w-full h-full object-cover opacity-60" />
                </motion.div>
             ))}
             {activeBanners.length > 1 && (
               <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                 {activeBanners.map((_, idx) => (
                   <button 
                     key={idx}
                     onClick={() => setCurrentSlide(idx)}
                     className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === idx ? 'bg-indigo-500 w-6' : 'bg-white/50 hover:bg-white/80'}`}
                   />
                 ))}
               </div>
             )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-slate-900"></div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-10 pointer-events-none"></div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              {t('home.dailyDiscounts')}
            </h2>
          </div>
          <Link to="/store" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
            {t('home.viewAll')} <ArrowRight className="w-4 h-4 rtl:hidden" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => {
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
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-indigo-600">
                        {(discountedPrice || 0).toLocaleString()} {t('common.currency')}
                      </span>
                      {product.discountPercentage && (
                        <span className="text-xs text-slate-400 line-through decoration-slate-300">
                          {(product.price || 0).toLocaleString()} {t('common.currency')}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{product.category}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  );
}
