import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Store from './pages/Store';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBanners from './pages/admin/AdminBanners';
import Login from './pages/Login';
import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function App() {
  const { initFirebase, setUser } = useStore();

  useEffect(() => {
    // Start Real-time Firestore Listeners
    initFirebase();

    // Listen strictly to Auth state (persistent login)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
       if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            let role: 'user' | 'admin' = 'user';
            
            if (userDoc.exists()) {
               role = userDoc.data().role;
            } else if (user.email?.includes('admin')) { 
               // Fallback mock admin role check from legacy auth if not yet inserted
               role = 'admin';
            }

            setUser({
               id: user.uid,
               name: user.email?.split('@')[0] || 'User',
               email: user.email || '',
               role: role
            });
          } catch (e) {
            console.error("Error fetching user role", e);
            setUser(null);
          }
       } else {
          setUser(null);
       }
    });

    return () => unsubscribe();
  }, [initFirebase, setUser]);

  return (
    <BrowserRouter>
      <Routes>
        {/* User Facing Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="store" element={<Store />} />
          <Route path="cart" element={<Cart />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/orders" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Login />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="*" element={<div className="p-8"><h2 className="text-xl font-bold">Coming Soon</h2><p className="text-slate-500 mt-2">This section of the admin panel is under construction.</p></div>} />
        </Route>
        
        {/* Catch All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
