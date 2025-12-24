
import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  AlertCircle, 
  ChevronRight, 
  Send, 
  CheckCircle2, 
  Clock, 
  History, 
  Phone, 
  Mail 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { translations } from '../i18n';

interface SupportPageProps {
  orders: Order[];
  lang: 'en' | 'ar';
}

const SupportPage: React.FC<SupportPageProps> = ({ orders, lang }) => {
  const navigate = useNavigate();
  const t = translations[lang];

  const SUPPORT_CATEGORIES = [
    { id: 'delivery', label: lang === 'ar' ? 'مشاكل التوصيل' : 'Delivery Issues', icon: <Clock className="w-5 h-5" /> },
    { id: 'quality', label: lang === 'ar' ? 'جودة الأضحية' : 'Livestock Quality', icon: <AlertCircle className="w-5 h-5" /> },
    { id: 'payment', label: lang === 'ar' ? 'الدفع والفواتير' : 'Payment & Billing', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'general', label: lang === 'ar' ? 'استفسار عام' : 'General Inquiry', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const [formType, setFormType] = useState<'inquiry' | 'complaint'>('inquiry');
  const [category, setCategory] = useState(SUPPORT_CATEGORIES[0].id);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setMessage('');
      setSelectedOrderId('');
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-card flex items-center justify-center mb-6 border border-primary/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black text-text-main mb-2">{t.support.received}</h2>
        <p className="text-text-secondary text-sm mb-8 max-w-xs leading-relaxed">
          {t.support.receivedSub}
          <br /><br />
          <span className="font-black text-primary bg-primary/5 px-2 py-1 rounded-[4px]">{t.support.ticketId}: TK-{Math.floor(Math.random() * 900000) + 100000}</span>
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="dabeeha-btn-primary max-w-[240px]"
        >
          {t.support.newRequest}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-1">
        <div className="text-start">
          <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{t.support.title}</h2>
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{t.support.tagline}</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-surface border border-border-dabeeha text-text-secondary hover:text-primary rounded-card transition-all shadow-level-1">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 bg-surface border border-border-dabeeha text-text-secondary hover:text-primary rounded-card transition-all shadow-level-1">
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="dabeeha-card p-0 border border-border-dabeeha overflow-hidden">
        <div className="flex p-1.5 bg-bg-dabeeha/50">
          <button 
            onClick={() => setFormType('inquiry')}
            className={`flex-1 py-2.5 rounded-card text-[10px] font-black uppercase tracking-widest transition-all ${
              formType === 'inquiry' ? 'bg-surface text-primary shadow-level-1' : 'text-text-secondary'
            }`}
          >
            {t.support.inquiry}
          </button>
          <button 
            onClick={() => setFormType('complaint')}
            className={`flex-1 py-2.5 rounded-card text-[10px] font-black uppercase tracking-widest transition-all ${
              formType === 'complaint' ? 'bg-surface text-primary shadow-level-1' : 'text-text-secondary'
            }`}
          >
            {t.support.complaint}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1 text-start block">{t.support.category}</label>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-card border transition-all flex items-center gap-3 ${
                    category === cat.id ? 'border-primary bg-primary/5 text-primary' : 'border-border-dabeeha bg-surface text-text-secondary hover:border-border-dabeeha'
                  }`}
                >
                  <div className={`p-1.5 rounded-[8px] ${category === cat.id ? 'bg-primary text-white' : 'bg-bg-dabeeha text-text-secondary'}`}>
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1 block">{t.support.details}</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={formType === 'inquiry' ? t.support.inquiryPlaceholder : t.support.complaintPlaceholder}
              className="dabeeha-input w-full min-h-[120px] py-4 resize-none leading-relaxed text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="dabeeha-btn-primary shadow-level-1"
          >
            {isSubmitting ? '...' : <>{t.support.submit} <Send className={`w-4 h-4 ml-2 ${lang === 'ar' ? 'mr-2 ml-0 rotate-180' : ''}`} /></>}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-text-main uppercase tracking-widest px-1 flex items-center gap-2">
          <History className="w-3 h-3 text-accent-gold" /> {t.support.recentActivity}
        </h3>
        <div className="bg-surface p-4 rounded-card border border-border-dabeeha shadow-level-1 flex items-center justify-between group cursor-pointer hover:border-primary transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-bg-dabeeha rounded-[8px] flex items-center justify-center text-text-secondary"><MessageSquare className="w-4 h-4" /></div>
            <div className="text-start">
              <p className="text-[10px] font-black text-text-main uppercase tracking-tight">TK-882103</p>
              <p className="text-[9px] text-primary font-bold">{lang === 'ar' ? 'تم الحل • منذ يومين' : 'Resolved • 2 days ago'}</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-border-dabeeha group-hover:text-primary transition-colors ${lang === 'ar' ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
