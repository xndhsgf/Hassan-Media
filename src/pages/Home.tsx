import { Link } from "react-router";
import { ArrowRight, Box, KeyRound, Monitor, Shield, Zap, CheckCircle2 } from "lucide-react";
import { testimonials } from "../data/mockData";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../store/useStore";
import { useState, useEffect } from "react";

function BannerSlider() {
  const { banners } = useStore();
  const activeBanners = banners.filter(b => b.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 2000); // 2 seconds
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 z-10 relative">
      <div className="relative w-full aspect-[2/1] md:aspect-[3/1] lg:aspect-[10/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-indigo-900/5 bg-slate-100 border border-slate-200/50">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentBanner.id}
            src={currentBanner.imageUrl}
            alt="Promotional Banner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
            onClick={() => {
              if (currentBanner.linkUrl) {
                 if (currentBanner.linkUrl.startsWith('http')) {
                    window.open(currentBanner.linkUrl, '_blank');
                 } else {
                    window.location.href = currentBanner.linkUrl;
                 }
              }
            }}
            style={{ cursor: currentBanner.linkUrl ? 'pointer' : 'default' }}
          />
        </AnimatePresence>
        
        {/* Pagination Dots */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'bg-white w-6 sm:w-8' : 'bg-white/50 hover:bg-white/80 w-1.5 sm:w-2'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const brands = [
  { name: 'Adobe', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Adobe_Acrobat_DC_logo_2020.svg' },
  { name: 'Canva', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg' },
  { name: 'ChatGPT', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
  { name: 'Office', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg' },
  { name: 'Windows', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Windows_11_logo.svg' },
];

export default function Home() {
  const { addToCart, products } = useStore();
  const featured = products.slice(0, 4);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {/* Dynamic Banner Slider */}
      <BannerSlider />

      {/* Features Grid */}
      <section className="w-full py-10 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4 sm:p-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Delivery</h3>
              <p className="text-slate-500 text-sm font-medium">Your product keys and account details are sent automatically 24/7 without delays.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Genuine</h3>
              <p className="text-slate-500 text-sm font-medium">All our software licenses and subscriptions are entirely legit with direct manufacturer warranty.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-6 sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Secure Payments</h3>
              <p className="text-slate-500 text-sm font-medium">We use bank-grade 256-bit encryption and integrate with Stripe & PayPal for your safety.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row justify-between items-end mb-8 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Daily Discounts</h2>
              <p className="text-slate-500 text-sm sm:text-base">Discover our best-selling digital products</p>
            </div>
            <Link to="/store" className="hidden sm:flex text-indigo-600 font-bold text-sm hover:underline items-center">
              View All Products <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featured.map(product => (
              <motion.div key={product.id} variants={item} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 bg-slate-100 relative">
                  <span className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-white uppercase tracking-widest rounded shadow-sm z-10">
                    {product.type}
                  </span>
                  {product.originalPrice && (
                     <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-[10px] uppercase font-bold rounded shadow-sm z-10">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                     </div>
                  )}
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transform hover:scale-105 transition duration-700" />
                </div>
                <div className="flex-1 flex flex-col">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">{product.category}</p>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 line-clamp-2 leading-tight">{product.name}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-slate-900">${Number(product.price).toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-slate-400 line-through ml-2">${Number(product.originalPrice).toFixed(2)}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="h-8 md:h-10 px-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shadow-slate-900/20 hover:shadow-indigo-600/30 active:scale-95"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-8 text-center sm:hidden">
             <Link to="/store" className="inline-flex items-center justify-center px-6 py-3 w-full border-2 border-slate-200 rounded-full font-bold text-slate-700 active:bg-slate-50">
               View All Products <ArrowRight className="w-4 h-4 ml-2" />
             </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid (Bento Style) */}
      <section className="w-full py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Browse Categories</h2>
            <p className="text-slate-500">Everything you need in one place</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
            <Link to="/store?cat=AI Tools" className="sm:col-span-2 md:col-span-2 relative rounded-3xl overflow-hidden group">
               <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-indigo-900/10 transition z-10"></div>
               <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995" alt="AI Tools" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
               <div className="absolute bottom-6 left-6 z-20 text-white">
                 <h3 className="text-2xl font-bold mb-1">AI Tools</h3>
                 <p className="text-white/80 text-sm font-medium">Premium AI subscriptions</p>
               </div>
            </Link>
            
            <Link to="/store?cat=Design Tools" className="relative rounded-3xl overflow-hidden group bg-orange-100 flex items-center justify-center border border-orange-200 hover:shadow-lg transition-shadow">
              <div className="text-center z-20">
                <Box className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <h3 className="text-lg font-bold text-slate-900">Design Tools</h3>
              </div>
            </Link>

            <Link to="/store?cat=Operating Systems" className="relative rounded-3xl overflow-hidden group bg-blue-100 flex items-center justify-center border border-blue-200 hover:shadow-lg transition-shadow">
              <div className="text-center z-20">
                <Monitor className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">OS Systems</h3>
              </div>
            </Link>

            <Link to="/store?cat=Security" className="relative rounded-3xl overflow-hidden group bg-emerald-100 flex items-center justify-center border border-emerald-200 hover:shadow-lg transition-shadow">
               <div className="text-center z-20">
                <Shield className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Security & VPN</h3>
              </div>
            </Link>

            <Link to="/store?cat=Productivity" className="relative rounded-3xl overflow-hidden group bg-purple-100 flex items-center justify-center border border-purple-200 hover:shadow-lg transition-shadow">
               <div className="text-center z-20">
                <KeyRound className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">Productivity</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="w-full py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-2xl sm:text-3xl font-bold mb-10 sm:mb-12">Trusted by Professionals</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {testimonials.map(t => (
                <div key={t.id} className="bg-slate-800 p-6 sm:p-8 rounded-3xl text-left border border-slate-700">
                  <div className="flex gap-1 mb-4 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                       <svg key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-current' : 'text-slate-600'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                       </svg>
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed mb-6">"{t.text}"</p>
                  <div>
                     <h4 className="font-bold text-white">{t.name}</h4>
                     <p className="text-slate-400 text-[10px] sm:text-xs mt-1 font-semibold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
