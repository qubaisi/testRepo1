
import React from 'react';
import { Home, ShoppingCart, User, MessageCircle, LogOut, ClipboardList, Bell, HelpCircle, Languages, UserCircle, Beef } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { translations } from '../i18n';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  cartCount: number;
  unreadNotifications?: number;
  lang: 'en' | 'ar';
  toggleLanguage: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, cartCount, unreadNotifications = 0, lang, toggleLanguage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[lang];

  const navItems = [
    { icon: <Beef className="w-6 h-6" />, label: t.nav.sacrifice, path: '/' },
    { icon: <MessageCircle className="w-6 h-6" />, label: t.nav.expert, path: '/ai' },
    { icon: <ShoppingCart className="w-6 h-6" />, label: t.nav.cart, path: '/cart', count: cartCount },
    { icon: <ClipboardList className="w-6 h-6" />, label: t.nav.orders, path: '/orders' },
    { icon: <UserCircle className="w-6 h-6" />, label: t.nav.profile, path: '/profile' },
  ];

  if (!user && location.pathname !== '/login' && location.pathname !== '/register') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-dabeeha pb-20">
      <header className="sticky top-0 z-40 bg-surface border-b border-border-dabeeha px-4 py-3 flex items-center justify-between shadow-level-1">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-primary rounded-card flex items-center justify-center text-white font-bold text-xl shadow-level-1">D</div>
          <div className="text-start">
            <h1 className="text-xl font-black text-text-main leading-tight tracking-tight">{t.appName}</h1>
            <p className="text-[10px] text-accent-gold font-bold uppercase tracking-wider">{t.appTagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => navigate('/support')}
            className={`p-2 rounded-card transition-all ${
              location.pathname === '/support' ? 'bg-bg-dabeeha text-primary' : 'text-text-secondary hover:text-text-main'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/notifications')}
            className={`p-2 rounded-card transition-all relative ${
              location.pathname === '/notifications' ? 'bg-bg-dabeeha text-primary' : 'text-text-secondary hover:text-text-main'
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className={`absolute top-1.5 ${lang === 'ar' ? 'left-1.5' : 'right-1.5'} w-2.5 h-2.5 bg-accent-gold border-2 border-surface rounded-full animate-pulse`}></span>
            )}
          </button>
          <button onClick={onLogout} className="p-2 text-text-secondary hover:text-primary transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto p-4">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border-dabeeha px-2 py-3 flex justify-around items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-all ${
              location.pathname === item.path ? 'text-primary' : 'text-text-secondary hover:text-text-main'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.count !== undefined && item.count > 0 && (
                <span className={`absolute -top-1 ${lang === 'ar' ? '-left-1' : '-right-1'} bg-accent-gold text-white text-[10px] font-bold px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center`}>
                  {item.count}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
