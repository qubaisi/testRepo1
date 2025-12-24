
import React from 'react';
import { Bell, CheckCircle2, Package, Info, Trash2, Calendar, Ghost } from 'lucide-react';
import { Notification } from '../types';
import { useNavigate } from 'react-router-dom';

interface NotificationsPageProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  lang: 'en' | 'ar';
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onMarkAllRead, onClearAll, lang }) => {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="w-5 h-5 text-primary" />;
      case 'farm': return <Ghost className="w-5 h-5 text-accent-gold" />;
      default: return <Info className="w-5 h-5 text-primary-variant" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return lang === 'ar' ? 'الآن' : 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return lang === 'ar' ? `منذ ${minutes} د` : `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return lang === 'ar' ? `منذ ${hours} س` : `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US');
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 bg-bg-dabeeha border border-border-dabeeha rounded-full flex items-center justify-center text-text-secondary mb-6 shadow-level-1">
          <Bell className="w-10 h-10 opacity-30" />
        </div>
        <h2 className="text-xl font-black text-text-main mb-2">{lang === 'ar' ? 'لا توجد تنبيهات' : 'No notifications'}</h2>
        <p className="text-text-secondary text-sm mb-8 max-w-xs leading-relaxed">{lang === 'ar' ? 'سنقوم بتنبيهك هنا بتحديثات المزرعة وفحوصات الصحة وحالة التوصيل.' : "We'll notify you here about farm updates, health checks, and your delivery status."}</p>
        <button 
          onClick={() => navigate('/')}
          className="dabeeha-btn-primary max-w-[200px]"
        >
          {lang === 'ar' ? 'الذهاب للسوق' : 'Go to Marketplace'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-1">
        <div className="text-start">
          <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{lang === 'ar' ? 'التنبيهات' : 'Notifications'}</h2>
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{lang === 'ar' ? 'ابق على اطلاع بجديد أضحيتك' : 'Stay updated with your Dabeeha'}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onMarkAllRead}
            className="p-2 bg-surface border border-border-dabeeha text-text-secondary hover:text-primary rounded-card shadow-level-1 transition-all"
            title={lang === 'ar' ? 'تحديد الكل كمقروء' : "Mark all as read"}
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onClearAll}
            className="p-2 bg-surface border border-border-dabeeha text-text-secondary hover:text-red-700 rounded-card shadow-level-1 transition-all"
            title={lang === 'ar' ? 'مسح الكل' : "Clear all"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className={`dabeeha-card p-4 flex gap-4 transition-all border ${
              notif.isRead ? 'border-border-dabeeha opacity-60 bg-bg-dabeeha/30' : 'border-primary/20 shadow-level-1 ring-1 ring-primary/5'
            }`}
          >
            <div className={`w-10 h-10 rounded-card flex items-center justify-center flex-shrink-0 ${
              notif.isRead ? 'bg-bg-dabeeha' : 'bg-primary/10'
            }`}>
              {getIcon(notif.type)}
            </div>
            <div className="flex-1 min-w-0 text-start">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className={`font-bold text-text-main text-xs truncate pr-2 ${!notif.isRead && 'font-black'}`}>
                  {notif.title}
                </h3>
                <span className="text-[8px] text-text-secondary font-black uppercase whitespace-nowrap pt-0.5 tracking-tighter">
                  {getTimeAgo(notif.timestamp)}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary leading-tight mb-2 line-clamp-2">
                {notif.message}
              </p>
              {notif.orderId && (
                <button 
                  onClick={() => navigate('/orders')}
                  className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:text-primary-variant transition-colors"
                >
                  {lang === 'ar' ? 'عرض الطلب' : 'View Order'} <Calendar className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
            {!notif.isRead && (
              <div className={`w-1.5 h-1.5 bg-accent-gold rounded-full mt-1.5 self-start flex-shrink-0 ${lang === 'ar' ? 'mr-auto' : 'ml-auto'}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
