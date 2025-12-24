
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Mail, Lock, LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  lang: 'en' | 'ar';
}

const Login: React.FC<LoginProps> = ({ onLogin, lang }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(lang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }

    onLogin({
      id: '123',
      name: 'Cairo Resident',
      email: email,
      location: { lat: 30.0444, lng: 31.2357 }
    });
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 max-w-sm mx-auto">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-primary rounded-[20px] flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-level-2">D</div>
        <h2 className="text-2xl font-black text-text-main mb-2">{lang === 'ar' ? 'مرحباً بعودتك' : 'Welcome Back'}</h2>
        <p className="text-text-secondary text-sm">{lang === 'ar' ? 'قم بتسجيل الدخول لطلب أضحيتك' : 'Sign in to order your fresh livestock'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5`} />
          <input
            type="email"
            placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            className={`dabeeha-input w-full ${lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <Lock className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5`} />
          <input
            type="password"
            placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
            className={`dabeeha-input w-full ${lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-xs font-bold px-2 text-start">{error}</p>}

        <button
          type="submit"
          className="dabeeha-btn-primary shadow-level-1 active:shadow-none"
        >
          {lang === 'ar' ? 'تسجيل الدخول' : 'Login'} <LogIn className={`w-5 h-5 ml-2 ${lang === 'ar' ? 'rotate-180 mr-2 ml-0' : ''}`} />
        </button>
      </form>

      <p className="text-center mt-8 text-text-secondary text-sm">
        {lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
        <Link to="/register" className="text-primary font-bold hover:underline">{lang === 'ar' ? 'سجل الآن' : 'Register now'}</Link>
      </p>
    </div>
  );
};

export default Login;
