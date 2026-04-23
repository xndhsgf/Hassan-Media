import { Link } from 'react-router';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Product } from '../data/mockData';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const { addToCart } = useStore();

  const discountedPrice = product.discountPercentage 
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col items-center text-center w-full"
    >
      <Link to={`/product/${product.id}`} className="block w-full mb-5 relative">
        {/* Product Image Container */}
        <div className="aspect-square bg-white rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden relative shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:-translate-y-1.5 flex items-center justify-center border border-slate-100">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
          />
          
          {/* Action Buttons Overlay - Centered at bottom */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center w-full px-4">
            <div className="bg-white rounded-full p-1.5 flex items-center gap-1 shadow-xl border border-slate-100/50 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-out">
              <button 
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-700 active:scale-90"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to wishlist logic could go here
                }}
              >
                <Heart className="w-5 h-5" />
              </button>
              <div className="w-[1px] h-6 bg-slate-100 mx-0.5"></div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-700 active:scale-90"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Discount Badge - Moved to Bottom Left */}
          {product.discountPercentage && (
            <div className="absolute bottom-5 left-5 bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight shadow-lg shadow-indigo-200/50 z-10">
              {product.discountPercentage}% OFF
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2 w-full px-2">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-bold text-slate-900 text-lg sm:text-xl line-clamp-1 group-hover:text-indigo-600 transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm font-medium text-slate-400">
          {product.category}
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-0.5 pt-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
          ))}
        </div>

        {/* Price Section */}
        <div className="pt-3 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {(discountedPrice || 0).toLocaleString()} <span className="text-sm font-bold text-indigo-600">{t('common.currency')}</span>
            </span>
          </div>
          {product.discountPercentage && (
            <span className="text-xs font-bold text-slate-300 line-through mt-0.5">
              {(product.price || 0).toLocaleString()} {t('common.currency')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
