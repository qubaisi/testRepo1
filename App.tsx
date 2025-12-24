
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
    const savedUser = localStorage.getItem('cl_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedOrders = localStorage.getItem('cl_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    const savedNotifications = localStorage.getItem('cl_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('cl_notifications', JSON.stringify(notifications));
    }
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

  const placeOrder = (order: Order) => {
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    setCart([]);
    localStorage.setItem('cl_orders', JSON.stringify(newOrders));

    addNotification(
      lang === 'ar' ? 'تأكيد الحجز' : 'Reservation Confirmed',
      lang === 'ar' ? `تم حجز طلبك ${order.id} بنجاح. سنبدأ في تجهيز أضحيتك قريباً.` : `Your order ${order.id} has been successfully reserved. We will start preparing your sacrifice soon.`,
      'order',
      order.id
    );

    setTimeout(() => {
      addNotification(
        lang === 'ar' ? 'تحديث المزرعة' : 'Farm Update',
        lang === 'ar' ? 'أتم الطبيب البيطري فحص أضحيتك. كل شيء يبدو مثالياً!' : `The veterinarian has completed the health check for your sacrifice. All looks perfect!`,
        'farm',
        order.id
      );
    }, 5000);
  };

  const cancelOrder = (orderId: string) => {
    const updatedOrders = orders.filter(o => o.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('cl_orders', JSON.stringify(updatedOrders));

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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout 
        user={user} 
        onLogout={handleLogout} 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        unreadNotifications={unreadCount}
        lang={lang}
        toggleLanguage={toggleLanguage}
      >
        <Routes>
          <Route 
            path="/" 
            element={user ? <Home addToCart={addToCart} lang={lang} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} lang={lang} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" /> : <Register onLogin={handleLogin} lang={lang} />} 
          />
          <Route 
            path="/ai" 
            element={user ? <AIChat lang={lang} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/cart" 
            element={user ? <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateCartQuantity} onPlaceOrder={placeOrder} lang={lang} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/orders" 
            element={user ? <OrderHistory orders={orders} onCancelOrder={cancelOrder} lang={lang} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/notifications" 
            element={user ? <NotificationsPage notifications={notifications} onMarkAllRead={markAllAsRead} onClearAll={clearNotifications} lang={lang} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/support" 
            element={user ? <SupportPage orders={orders} lang={lang} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <ProfilePage user={user} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} lang={lang} setLang={setLang} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/product/:id" 
            element={user ? <ProductDetail addToCart={addToCart} lang={lang} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
