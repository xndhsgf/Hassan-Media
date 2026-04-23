import { useStore } from '../store/useStore';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

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
      <section className="relative bg-slate-900 overflow-hidden h-[35vh] sm:h-[60vh] min-h-[250px]">
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
                  <img src={banner.imageUrl} alt="Offer" className="w-full h-full object-cover lg:object-fill" />
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
