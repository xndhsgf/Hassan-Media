import { create } from 'zustand';
import { mockProducts, Product, ProductType, PaymentMethod, Review } from '../data/mockData';
import { db, auth } from '../lib/firebase';
import { 
  collection, doc, setDoc, getDocs, onSnapshot, 
  updateDoc, deleteDoc, addDoc, query, where, getDoc
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut 
} from 'firebase/auth';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  status: 'Completed' | 'Pending' | 'Failed';
  method: 'Auto' | 'WhatsApp';
  keys: {
    productId: string;
    productName: string;
    type: ProductType;
    value: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
}

interface AppState {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  allOrders: Order[];
  whatsappNumber: string;
  banners: Banner[];
  paymentMethods: PaymentMethod[];
  reviews: Review[];
  isInitialized: boolean;
  
  // Real-time Init
  initFirebase: () => void;
  setUser: (user: User | null) => void;

  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  placeOrder: (method: 'Auto' | 'WhatsApp') => Promise<void>;
  
  // Admin functions
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateWhatsAppNumber: (num: string) => Promise<void>;
  
  // Banner functions
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<void>;
  updateBanner: (id: string, data: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  toggleBannerStatus: (id: string) => Promise<void>;

  // Payment Methods functions
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>;
  updatePaymentMethod: (id: string, data: Partial<PaymentMethod>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  
  // Reviews functions
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}

const generateMockDelivery = (type: ProductType) => {
  if (type === 'License Key') return `XXXX-XXXX-XXXX-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  if (type === 'Account') return `Email: user${Math.floor(Math.random() * 999)}@shared.io | Pass: ${Math.random().toString(36).slice(-8)}`;
  return `Sub ID: SUB-${Math.random().toString(36).slice(-10).toUpperCase()}`;
};

export const useStore = create<AppState>()(
  (set, get) => ({
    products: mockProducts,
    cart: [],
    user: null,
    allOrders: [],
    whatsappNumber: '201000000000',
    banners: [
        {
          id: 'banner-1',
          imageUrl: 'https://images.unsplash.com/photo-1614064641913-a4421b5eb97c?q=80&w=2669&auto=format&fit=crop',
          linkUrl: '/store?cat=AI%20Tools',
          isActive: true
        },
        {
          id: 'banner-2',
          imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop',
          linkUrl: '/store?cat=Security',
          isActive: true
        }
    ],
    paymentMethods: [
      { id: '1', name: 'Vodafone Cash', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Vodafone_logo.svg/200px-Vodafone_logo.svg.png', accountNumber: '01000000000', instructions: 'Transfer to this number.' },
      { id: '2', name: 'InstaPay', imageUrl: 'https://play-lh.googleusercontent.com/yD9Tns1S08a4p15-t3SCLtM7G5qN3M6j0jpx0H47N1L1zH-1P1b2vU1wF8L3X5Y5xQ=w240-h480-rw', accountNumber: 'user@instapay', instructions: 'Transfer via InstaPay.' }
    ],
    reviews: [],
    isInitialized: false,

    setUser: (user) => set({ user }),

    initFirebase: () => {
      const { isInitialized } = get();
      if (isInitialized) return;

      // Ensure mock products are in DB (for demo purposes) if empty
      const checkAndSeedProducts = async () => {
        const snap = await getDocs(collection(db, 'products'));
        if (snap.empty) {
          for (const product of mockProducts) {
             await setDoc(doc(db, 'products', product.id.toString()), product);
          }
        }
      };
      checkAndSeedProducts();

      // Listen to Products
      onSnapshot(collection(db, 'products'), (snapshot) => {
        const products: Product[] = [];
        snapshot.forEach((doc) => products.push({ id: doc.id, ...doc.data() } as Product));
        if (products.length > 0) set({ products });
      }, (err) => console.error("Products listener error:", err));

      // Listen to Banners
      onSnapshot(collection(db, 'banners'), (snapshot) => {
        const banners: Banner[] = [];
        snapshot.forEach((doc) => banners.push({ id: doc.id, ...doc.data() } as Banner));
        if (banners.length > 0) set({ banners });
      }, (err) => console.error("Banners listener error:", err));

      // Listen to Orders
      onSnapshot(collection(db, 'orders'), (snapshot) => {
        const allOrders: Order[] = [];
        snapshot.forEach((doc) => allOrders.push({ id: doc.id, ...doc.data() } as Order));
        // Sort by date descending
        allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        set({ allOrders });
      }, (err) => console.error("Orders listener error:", err));

      // Listen to Payment Methods
      onSnapshot(collection(db, 'paymentMethods'), (snapshot) => {
        const paymentMethods: PaymentMethod[] = [];
        snapshot.forEach((doc) => paymentMethods.push({ id: doc.id, ...doc.data() } as PaymentMethod));
        if (paymentMethods.length > 0) set({ paymentMethods });
      }, (err) => console.error("PaymentMethods listener error:", err));

      // Listen to Reviews
      onSnapshot(collection(db, 'reviews'), (snapshot) => {
        const reviews: Review[] = [];
        snapshot.forEach((doc) => reviews.push({ id: doc.id, ...doc.data() } as Review));
        // Sort by date descending
        reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        set({ reviews });
      }, (err) => console.error("Reviews listener error:", err));

      // Listen to Settings
      onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
        if (docSnap.exists() && docSnap.data().whatsappNumber) {
           set({ whatsappNumber: docSnap.data().whatsappNumber });
        }
      }, (err) => console.error("Settings listener error:", err));

      set({ isInitialized: true });
    },

    addToCart: (product) => set((state) => {
      const existing = state.cart.find(item => item.product.id === product.id);
      if (existing) {
        return { cart: state.cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) };
      }
      return { cart: [...state.cart, { product, quantity: 1 }] };
    }),
    
    removeFromCart: (productId) => set((state) => ({
      cart: state.cart.filter(item => item.product.id !== productId)
    })),
    
    clearCart: () => set({ cart: [] }),
    
    login: async (email, pass) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        let role: 'user' | 'admin' = email.includes('admin') ? 'admin' : 'user';
        if (userDoc.exists()) {
           role = userDoc.data().role;
        }

        set({ 
          user: { 
            id: userCredential.user.uid, 
            name: email.split('@')[0], 
            email, 
            role: role
          } 
        });
      } catch (err: any) {
        // If login fails, try mock mode or throw error
        console.error(err);
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
           throw new Error("Invalid credentials");
        }
        throw err;
      }
    },

    register: async (email, pass) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const role = email.includes('admin') ? 'admin' : 'user';
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
         email,
         role
      });

      set({ 
        user: { 
          id: userCredential.user.uid, 
          name: email.split('@')[0], 
          email, 
          role: role
        } 
      });
    },
    
    logout: async () => {
      await signOut(auth);
      set({ user: null });
    },
    
    placeOrder: async (method) => {
      const { cart, user, clearCart } = get();
      if (!user || cart.length === 0) return;

      const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      const keys = method === 'Auto' ? cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        type: item.product.type,
        value: generateMockDelivery(item.product.type)
      })) : [];

      const newOrder: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        userId: user.id,
        userEmail: user.email,
        items: [...cart],
        total,
        status: method === 'WhatsApp' ? 'Pending' : 'Completed',
        method,
        keys
      };

      await setDoc(doc(db, 'orders', newOrder.id), newOrder);

      // Also clear cart in local state
      set({ cart: [] });
    },

    addProduct: async (product) => {
      await setDoc(doc(db, 'products', product.id.toString()), product);
    },

    updateProduct: async (id, data) => {
      await updateDoc(doc(db, 'products', id.toString()), data);
    },

    deleteProduct: async (id) => {
      await deleteDoc(doc(db, 'products', id.toString()));
    },

    updateOrderStatus: async (orderId, status) => {
      await updateDoc(doc(db, 'orders', orderId), { status });
    },

    updateWhatsAppNumber: async (num) => {
      await setDoc(doc(db, 'settings', 'global'), { whatsappNumber: num }, { merge: true });
    },
    
    addBanner: async (banner) => {
      const docRef = doc(collection(db, 'banners'));
      await setDoc(docRef, banner);
    },
    
    updateBanner: async (id, data) => {
      await updateDoc(doc(db, 'banners', id), data);
    },
    
    deleteBanner: async (id) => {
      await deleteDoc(doc(db, 'banners', id));
    },
    
    toggleBannerStatus: async (id) => {
      const state = get();
      const banner = state.banners.find(b => b.id === id);
      if (banner) {
         await updateDoc(doc(db, 'banners', id), { isActive: !banner.isActive });
      }
    },
    
    addPaymentMethod: async (method) => {
      const docRef = doc(collection(db, 'paymentMethods'));
      await setDoc(docRef, method);
    },
    
    updatePaymentMethod: async (id, data) => {
      await updateDoc(doc(db, 'paymentMethods', id), data);
    },
    
    deletePaymentMethod: async (id) => {
      await deleteDoc(doc(db, 'paymentMethods', id));
    },

    addReview: async (review) => {
      const docRef = doc(collection(db, 'reviews'));
      await setDoc(docRef, { ...review, date: new Date().toISOString() });
    },
    
    deleteReview: async (id) => {
      await deleteDoc(doc(db, 'reviews', id));
    }
  })
);
