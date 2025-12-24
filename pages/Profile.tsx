
import React, { useState } from 'react';
import { User, Mail, Lock, Settings, ChevronRight, LogOut, Bell, Shield, CheckCircle2, AlertCircle, UserCircle, Globe } from 'lucide-react';
import { User as UserType } from '../types';
import { translations } from '../i18n';

interface ProfilePageProps {
  user: UserType;
  onUpdateProfile: (user: UserType) => void;
  onLogout: () => void;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateProfile, onLogout, lang, setLang }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'info' | 'settings'>('info');
  const [formData, setFormData] = useState({ name: user.name, email: user.email });
  const [passwordData, setPasswordData] = useState({ old: '', new: '', confirm: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile({ ...user, name: formData.name, email: formData.email });
      setStatus({ type: 'success', message: t.profile.successInfo });
      setIsSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }, 1000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      setStatus({ type: 'error', message: t.profile.errorMatch });
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setStatus({ type: 'success', message: t.profile.successPass });
      setPasswordData({ old: '', new: '', confirm: '' });
      setIsSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="bg-primary p-6 sm:p-8 rounded-card text-white shadow-level-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <UserCircle className="w-32 h-32" />
        </div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-card flex items-center justify-center text-2xl font-black">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-start">
            <h2 className="text-lg font-black leading-tight">{user.name}</h2>
            <p className="text-[10px] text-accent-gold font-bold uppercase tracking-widest">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-accent-gold/10 px-2 py-0.5 rounded-full border border-accent-gold/20">
              <CheckCircle2 className="w-2.5 h-2.5 text-accent-gold" />
              <span className="text-[8px] font-black uppercase tracking-widest">{t.profile.cairoResident}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-surface p-1 rounded-button border border-border-dabeeha shadow-level-1 h-12">
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex-1 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'info' ? 'bg-primary text-white shadow-level-1' : 'text-text-secondary'
          }`}
        >
          {t.nav.profile}
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'settings' ? 'bg-primary text-white shadow-level-1' : 'text-text-secondary'
          }`}
        >
          {t.profile.settings}
        </button>
      </div>

      {status && (
        <div className={`p-3 rounded-card flex items-center gap-3 border ${
          status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <p className="text-xs font-bold">{status.message}</p>
        </div>
      )}

      {activeTab === 'info' ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="dabeeha-card border border-border-dabeeha space-y-5">
            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest text-start">{t.profile.editInfo}</h3>
            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div className="space-y-1 text-start">
                <label className="text-[9px] font-black text-text-secondary uppercase px-1 block">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                <input 
                  type="text" 
                  className="dabeeha-input w-full text-sm"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1 text-start">
                <label className="text-[9px] font-black text-text-secondary uppercase px-1 block">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input 
                  type="email" 
                  className="dabeeha-input w-full text-sm"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <button type="submit" className="dabeeha-btn-primary">{t.profile.saveChanges}</button>
            </form>
          </div>

          <div className="dabeeha-card border border-border-dabeeha space-y-5">
            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest text-start">{t.profile.security}</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input 
                type="password" 
                placeholder={t.profile.oldPassword}
                className="dabeeha-input w-full text-sm"
                value={passwordData.old}
                onChange={e => setPasswordData({...passwordData, old: e.target.value})}
              />
              <input 
                type="password" 
                placeholder={t.profile.newPassword}
                className="dabeeha-input w-full text-sm"
                value={passwordData.new}
                onChange={e => setPasswordData({...passwordData, new: e.target.value})}
              />
              <button type="submit" className="dabeeha-btn-secondary">{t.profile.updatePassword}</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="dabeeha-card border border-border-dabeeha space-y-5">
            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest text-start">{t.profile.preferences}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-bg-dabeeha/30 rounded-card border border-border-dabeeha">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-text-main">{t.profile.pushNotifications}</span>
                </div>
                <div className="w-10 h-5 bg-primary rounded-full relative p-0.5 cursor-pointer">
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${lang === 'ar' ? 'translate-x-0' : 'translate-x-5'}`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button onClick={() => setLang('en')} className={`py-3 rounded-card text-[10px] font-black uppercase border-2 ${lang === 'en' ? 'border-primary bg-primary/5 text-primary' : 'border-border-dabeeha text-text-secondary'}`}>English</button>
                <button onClick={() => setLang('ar')} className={`py-3 rounded-card text-[10px] font-black uppercase border-2 ${lang === 'ar' ? 'border-primary bg-primary/5 text-primary' : 'border-border-dabeeha text-text-secondary'}`}>العربية</button>
              </div>
            </div>
          </div>

          <div className="dabeeha-card border border-border-dabeeha p-0 overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-bg-dabeeha/50 transition-all border-b border-border-dabeeha">
              <div className="flex items-center gap-3"><Shield className="w-4 h-4 text-text-secondary" /><span className="text-xs font-bold text-text-main">{t.profile.privacy}</span></div>
              <ChevronRight className={`w-4 h-4 text-border-dabeeha ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={onLogout} className="w-full p-4 flex items-center justify-center gap-2 text-primary font-black text-xs uppercase hover:bg-primary/5 transition-all">
              <LogOut className="w-4 h-4" /> {t.profile.logout}
            </button>
          </div>
        </div>
      )}

      <p className="text-center py-4 text-[9px] text-text-secondary font-black uppercase tracking-[0.2em]">Dabeeha Cairo Hub • v1.3.0</p>
    </div>
  );
};

export default ProfilePage;
