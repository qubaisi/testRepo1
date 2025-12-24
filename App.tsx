
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AIChat from './pages/AIChat';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import OrderHistory from './pages/OrderHistory';
import NotificationsPage from './pages/Notifications';
import SupportPage from './pages/Support';
import ProfilePage from './pages/Profile';
import { User, CartItem, Product, Order, Notification } from './types';
import { translations } from './i18n';
import { api } from './services/api';

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ar'>((localStorage.getItem('ud_lang') as 'en' | 'ar') || 'en');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('ud_lang', lang);
  }, [lang]);

  useEffect(() => {
    const initApp = async () => {
      const savedUser = localStorage.getItem('cl_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Sync orders from backend on mount
        try {
          const remoteOrders = await api.getOrders(parsedUser.id);
          setOrders(remoteOrders);
        } catch (e) {
          console.error("Could not sync orders from backend");
        }
      }
      
      const savedNotifications = localStorage.getItem('cl_notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
      setIsLoading(false);
    };
    initApp();
  }, []);

  useEffect(() => {
    localStorage.setItem('cl_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('cl_user', JSON.stringify(userData));
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('cl_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('cl_user');
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  const getCartKey = (item: CartItem | Product, type: string, shareCount?: number) => {
    return `${item.id}-${type}-${shareCount || 'full'}`;
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const itemKey = getCartKey(item, item.type, item.shareCount);
      const existingIndex = prev.findIndex(i => getCartKey(i, i.type, i.shareCount) === itemKey);

      if (existingIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + (item.quantity || 1)
        };
        return updatedCart;
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const updateCartQuantity = (cartKey: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCart(prev => prev.map(item => {
      const itemKey = getCartKey(item, item.type, item.shareCount);
      if (itemKey === cartKey) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (cartKey: string) => {
    setCart(prev => prev.filter(item => getCartKey(item, item.type, item.shareCount) !== cartKey));
  };

  const addNotification = (title: string, message: string, type: 'order' | 'system' | 'farm', orderId?: string) => {
    const newNotif: Notification = {
      id: `NTF-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
      type,
      orderId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const placeOrder = async (orderData: Partial<Order>) => {
    try {
      const confirmedOrder = await api.placeOrder(orderData);
      const newOrders = [confirmedOrder, ...orders];
      setOrders(newOrders);
      setCart([]);
      
      addNotification(
        lang === 'ar' ? 'تأكيد الحجز' : 'Reservation Confirmed',
        lang === 'ar' ? `تم حجز طلبك ${confirmedOrder.id} بنجاح. سنبدأ في تجهيز أضحيتك قريباً.` : `Your order ${confirmedOrder.id} has been successfully reserved. We will start preparing your sacrifice soon.`,
        'order',
        confirmedOrder.id
      );
    } catch (e) {
      console.error("Order failed", e);
    }
  };

  const cancelOrder = (orderId: string) => {
    const updatedOrders = orders.filter(o => o.id !== orderId);
    setOrders(updatedOrders);
    
    addNotification(
      lang === 'ar' ? 'تم إلغاء الطلب' : 'Order Cancelled',
      lang === 'ar' ? `تم إلغاء الطلب ${orderId} بنجاح وجاري استرجاع مبلغ الحجز.` : `Order ${orderId} has been successfully cancelled and your reservation fee is being processed.`,
      'order',
      orderId
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('cl_notifications');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dabeeha">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-card flex items-center justify-center text-white font-black text-3xl shadow-level-2 animate-pulse">D</div>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout 
        user={user} 
        onLogout={handleLogout} 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        unreadNotifications={notifications.filter(n => !n.isRead).length}
        lang={lang}
        toggleLanguage={toggleLanguage}
      >
        <Routes>
          <Route path="/" element={user ? <Home addToCart={addToCart} lang={lang} /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} lang={lang} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register onLogin={handleLogin} lang={lang} />} />
          <Route path="/ai" element={user ? <AIChat lang={lang} /> : <Navigate to="/login" />} />
          <Route path="/cart" element={user ? <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateCartQuantity} onPlaceOrder={placeOrder} lang={lang} /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <OrderHistory orders={orders} onCancelOrder={cancelOrder} lang={lang} /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={user ? <NotificationsPage notifications={notifications} onMarkAllRead={markAllAsRead} onClearAll={clearNotifications} lang={lang} /> : <Navigate to="/login" />} />
          <Route path="/support" element={user ? <SupportPage orders={orders} lang={lang} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage user={user} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} lang={lang} setLang={setLang} /> : <Navigate to="/login" />} />
          <Route path="/product/:id" element={user ? <ProductDetail addToCart={addToCart} lang={lang} /> : <Navigate to="/login" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
