import { useParams, useNavigate, Link } from 'react-router';
import { useStore } from '../store/useStore';
import { ShoppingCart, Star, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, reviews, addReview, user } = useStore();
  
  const product = products.find(p => p.id === id);
  const [selectedDuration, setSelectedDuration] = useState(product?.duration || '');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Product not found</h2>
        <button onClick={() => navigate('/store')} className="mt-4 text-indigo-600 hover:underline">Back to Store</button>
      </div>
    );
  }

  const productReviews = reviews.filter(r => r.productId === id);
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
    : 5;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    await addReview({
      productId: id,
      userId: user.id,
      userName: user.name,
      rating: newRating,
      comment: newComment
    });
    setNewComment('');
    setNewRating(5);
  };

  // To simulate durations from string
  const durations = [product.duration];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/store" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
        </Link>
        
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                {product.offerBadge && (
                  <span className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm">
                    {product.offerBadge}
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {product.type}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Reviews summary block (UI only for now) */}
              <div className="flex items-center gap-4 mb-6">
                 <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                 </div>
                 <span className="text-sm font-medium text-slate-500">
                   {averageRating.toFixed(1)} ({productReviews.length} reviews)
                 </span>
              </div>
              
              <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Duration selection */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Duration</h3>
                <div className="flex flex-wrap gap-3">
                  {durations.map(d => (
                    <button 
                      key={d}
                      onClick={() => setSelectedDuration(d)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${selectedDuration === d ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Features included</h3>
                <ul className="space-y-3">
                  {product.features?.map((feat, i) => (
                    <li key={i} className="flex items-start text-slate-600 font-medium">
                      <ShieldCheck className="w-5 h-5 text-emerald-500 mr-3 shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-100">
                <div className="flex items-end gap-4 mb-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">${product.priceUsd || product.price}</span>
                      {product.originalPrice && <span className="text-lg text-slate-400 line-through">${product.originalPrice}</span>}
                    </div>
                    <span className="text-sm font-bold text-slate-500 mt-1">{Number(product.priceEgp || (product.price * 50)).toFixed(2)} EGP</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                       addToCart(product);
                       navigate('/cart');
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
                  >
                    <ShoppingCart className="w-5 h-5" /> Buy Now
                  </button>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 sm:px-8 h-14 rounded-2xl font-bold transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features banner below product */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                 <Zap className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="font-bold text-slate-900">Instant Delivery</h4>
                 <p className="text-sm text-slate-500">Get your product instantly</p>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                 <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="font-bold text-slate-900">100% Secure</h4>
                 <p className="text-sm text-slate-500">Official legitimate keys</p>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                 <Star className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="font-bold text-slate-900">Premium Support</h4>
                 <p className="text-sm text-slate-500">We are here to help</p>
              </div>
           </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-12">
           <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Reviews</h2>
           <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Write a review</h3>
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Rating</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(star => (
                           <button 
                             type="button" 
                             key={star} 
                             onClick={() => setNewRating(star)}
                             className={`p-1 transition-colors ${newRating >= star ? 'text-amber-400' : 'text-slate-300'}`}
                           >
                             <Star className="w-8 h-8 fill-current" />
                           </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Your review</label>
                      <textarea 
                        required 
                        value={newComment} 
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="What do you think about this product...?"
                        className="w-full border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-24 resize-none"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                     <p className="text-slate-600 font-medium mb-3">You must be logged in to leave a review.</p>
                     <button onClick={() => navigate('/login')} className="px-6 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors">
                        Sign In
                     </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {productReviews.length > 0 ? productReviews.map(r => (
                  <div key={r.id} className="border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        {r.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-none">{r.userName}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{new Date(r.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm">{r.comment}</p>
                  </div>
                )) : (
                  <div className="text-center py-10 border-t border-slate-100">
                    <p className="text-slate-500 font-medium">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
