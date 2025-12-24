
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, LogIn } from 'lucide-react';
import { CAIRO_COORDS } from '../constants';

interface RegisterProps {
  onLogin: (user: User) => void;
  lang: 'en' | 'ar';
}

const Register: React.FC<RegisterProps> = ({ onLogin, lang }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleRegister = () => {
    setError('');
    if (!formData.name || !formData.email || !formData.password) {
      setError(lang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }

    onLogin({
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      location: CAIRO_COORDS
    });
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-text-main mb-2">{lang === 'ar' ? 'انضم إلينا' : 'Create Account'}</h2>
        <p className="text-text-secondary text-sm leading-relaxed">{lang === 'ar' ? 'انضم إلى السوق المتميز لسكان القاهرة. طازج من المزرعة إلى باب منزلك.' : 'Join the premium marketplace for Cairo residents. Fresh from farm to your door.'}</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <UserIcon className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5`} />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
            className={`dabeeha-input w-full ${lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="relative">
          <Mail className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5`} />
          <input
            type="email"
            placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            className={`dabeeha-input w-full ${lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="relative">
          <Lock className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5`} />
          <input
            type="password"
            placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
            className={`dabeeha-input w-full ${lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        {error && <p className="text-red-500 text-xs font-bold px-2 text-start">{error}</p>}

        <button
          onClick={handleRegister}
          className="dabeeha-btn-primary shadow-level-1"
        >
          {lang === 'ar' ? 'تسجيل' : 'Register'} <LogIn className={`w-5 h-5 ml-2 ${lang === 'ar' ? 'mr-2 ml-0 rotate-180' : ''}`} />
        </button>
      </div>

      <p className="text-center mt-8 text-text-secondary text-[11px] leading-tight">
        {lang === 'ar' ? 'بالتسجيل، أنت توافق على شروطنا وتركيزنا الأساسي على منطقة القاهرة الكبرى.' : 'By registering, you agree to our Terms and our focus on the Cairo Metropolitan area.'}
      </p>

      <p className="text-center mt-4 text-text-secondary text-sm">
        {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
        <Link to="/login" className="text-primary font-bold hover:underline">{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</Link>
      </p>
    </div>
  );
};

export default Register;
