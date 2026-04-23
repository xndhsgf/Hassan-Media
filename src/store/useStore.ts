import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockProducts, mockBanners, mockPaymentMethods, Product, ProductType, PaymentMethod, Review, ProductDurationOption } from '../data/mockData';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedDuration?: ProductDurationOption;
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
  siteName: string;
  siteLogo: string;
  isInitialized: boolean;
  
  // Real-time Init
  initFirebase: () => void;
  setUser: (user: User | null) => void;
  
  // Settings functions
  updateSettings: (data: { siteName?: string; siteLogo?: string; whatsappNumber?: string }) => Promise<void>;

  addToCart: (product: Product, selectedDuration?: ProductDurationOption) => void;
  removeFromCart: (productId: string, durationId?: string) => void;
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
  persist(
    (set, get) => ({
      products: mockProducts,
      cart: [],
      user: null,
      allOrders: [],
      whatsappNumber: '+1234567890',
      banners: mockBanners,
      paymentMethods: mockPaymentMethods,
      reviews: [],
      siteName: 'KeyMaster',
      siteLogo: '',
      isInitialized: false,

      setUser: (user) => set({ user }),

      updateSettings: async (data) => {
        set((state) => ({ ...state, ...data }));
      },

      initFirebase: () => {
        const { isInitialized, products, banners, paymentMethods } = get();
        if (isInitialized) return;

        // If persisted state is completely empty for some reason, rehydrate from mockData
        set({ 
          isInitialized: true,
          products: products.length > 0 ? products : mockProducts,
          paymentMethods: paymentMethods.length > 0 ? paymentMethods : mockPaymentMethods,
          banners: banners.length > 0 ? banners : mockBanners
        });
      },

      addToCart: (product, selectedDuration) => set((state) => {
        const existing = state.cart.find(item => 
          item.product.id === product.id && 
          item.selectedDuration?.id === selectedDuration?.id
        );
        if (existing) {
          return { 
            cart: state.cart.map(item => 
              (item.product.id === product.id && item.selectedDuration?.id === selectedDuration?.id) 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ) 
          };
        }
        return { cart: [...state.cart, { product, quantity: 1, selectedDuration }] };
      }),
      
      removeFromCart: (productId, durationId) => set((state) => ({
        cart: state.cart.filter(item => !(item.product.id === productId && item.selectedDuration?.id === durationId))
      })),
      
      clearCart: () => set({ cart: [] }),
      
      login: async (email, pass) => {
        const role: 'user' | 'admin' = email.includes('admin') ? 'admin' : 'user';
        set({ 
          user: { 
            id: `mock-${Date.now()}`, 
            name: email.split('@')[0], 
            email, 
            role: role
          } 
        });
      },

      register: async (email, pass) => {
        const role: 'user' | 'admin' = email.includes('admin') ? 'admin' : 'user';
        set({ 
          user: { 
            id: `mock-${Date.now()}`, 
            name: email.split('@')[0], 
            email, 
            role: role
          } 
        });
      },
      
      logout: async () => {
        set({ user: null });
      },
      
      placeOrder: async (method) => {
        const { cart, user, allOrders } = get();
        if (!user || cart.length === 0) return;

        const total = cart.reduce((sum, item) => {
          const basePrice = item.selectedDuration ? item.selectedDuration.price : item.product.price;
          const finalPrice = item.product.discountPercentage 
            ? basePrice * (1 - item.product.discountPercentage / 100)
            : basePrice;
          return sum + (finalPrice * item.quantity);
        }, 0);
        
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

        set({ 
          allOrders: [newOrder, ...allOrders],
          cart: []
        });
      },

      addProduct: async (product) => {
        set((state) => ({ products: [...state.products, product] }));
      },

      updateProduct: async (id, data) => {
        set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
        }));
      },

      deleteProduct: async (id) => {
        set((state) => ({
          products: state.products.filter(p => p.id !== id)
        }));
      },

      updateOrderStatus: async (orderId, status) => {
        set((state) => ({
          allOrders: state.allOrders.map(o => o.id === orderId ? { ...o, status } : o)
        }));
      },

      updateWhatsAppNumber: async (num) => {
        set({ whatsappNumber: num });
      },
      
      addBanner: async (banner) => {
        set((state) => ({ 
          banners: [...state.banners, { ...banner, id: `ban-${Date.now()}` }] 
        }));
      },
      
      updateBanner: async (id, data) => {
        set((state) => ({
          banners: state.banners.map(b => b.id === id ? { ...b, ...data } : b)
        }));
      },
      
      deleteBanner: async (id) => {
        set((state) => ({
          banners: state.banners.filter(b => b.id !== id)
        }));
      },
      
      toggleBannerStatus: async (id) => {
        set((state) => ({
          banners: state.banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b)
        }));
      },
      
      addPaymentMethod: async (method) => {
        set((state) => ({ 
          paymentMethods: [...state.paymentMethods, { ...method, id: `pm-${Date.now()}` }] 
        }));
      },
      
      updatePaymentMethod: async (id, data) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map(p => p.id === id ? { ...p, ...data } : p)
        }));
      },
      
      deletePaymentMethod: async (id) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.filter(p => p.id !== id)
        }));
      },

      addReview: async (review) => {
        set((state) => ({ 
          reviews: [{ ...review, id: `rev-${Date.now()}`, date: new Date().toISOString() }, ...state.reviews] 
        }));
      },
      
      deleteReview: async (id) => {
        set((state) => ({
          reviews: state.reviews.filter(r => r.id !== id)
        }));
      }
    }),
    {
      name: 'keymaster-storage', // name of the item in the storage (must be unique)
    }
  )
);
