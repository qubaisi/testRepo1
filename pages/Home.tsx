
import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Category, Type, Product, CartItem } from '../types';
import { formatCurrency } from '../utils';
import { Search, PlusCircle, ArrowRight, Ghost, Beef, Users, X, Minus, Plus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../i18n';

interface HomeProps {
  addToCart: (item: CartItem) => void;
  lang: 'en' | 'ar';
}

const Home: React.FC<HomeProps> = ({ addToCart, lang }) => {
  const navigate = useNavigate();
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [activeType, setActiveType] = useState<Type | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [quickAddShares, setQuickAddShares] = useState(1);

  const translateCategory = (cat: string) => {
    if (cat === Category.SHEEP) return t.home.categories.sheep;
    if (cat === Category.CALF) return t.home.categories.calf;
    return t.home.all;
  };

  const translateType = (type: string) => {
    if (type === Type.ALIVE) return t.home.types.alive;
    if (type === Type.SLAUGHTERED) return t.home.types.slaughtered;
    return t.home.all;
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const catMatch = activeCategory === 'All' || p.category === activeCategory;
    const typeMatch = activeType === 'All' || p.type === activeType;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && typeMatch && searchMatch;
  });

  const handleQuickAdd = (product: Product, type: Type, shareCount?: number) => {
    const price = shareCount ? (product.price / 7) * shareCount : product.price;
    const item: CartItem = {
      ...product,
      type,
      quantity: 1,
      shareCount,
      isFullSacrifice: !shareCount || shareCount === 7,
      price
    };
    addToCart(item);
    setQuickAddProduct(null);
    setQuickAddShares(1);
  };

  return (
    <div className="space-y-6">
      {/* Search Field matching UI KIT */}
      <div className="relative">
        <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5`} />
        <input
          type="text"
          placeholder={t.home.searchPlaceholder}
          className="dabeeha-input w-full pl-10 pr-4"
          style={{ paddingLeft: lang === 'en' ? '40px' : '16px', paddingRight: lang === 'ar' ? '40px' : '16px' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {['All', Category.SHEEP, Category.CALF].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-primary text-white shadow-level-1' 
                  : 'bg-surface text-text-secondary border border-border-dabeeha hover:border-primary'
              }`}
            >
              {translateCategory(cat)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="dabeeha-card flex flex-col sm:flex-row h-full group transition-all hover:shadow-level-2 border border-border-dabeeha/50 p-0 overflow-hidden"
          >
            <div 
              className="relative w-full sm:w-1/3 aspect-[4/3] sm:aspect-square overflow-hidden cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute top-2 ${lang === 'ar' ? 'right-2' : 'left-2'} px-2 py-1 bg-surface/90 backdrop-blur rounded-[4px] text-[10px] font-black uppercase tracking-wider text-primary border border-border-dabeeha`}>
                {translateCategory(product.category)}
              </div>
            </div>
            <div className="p-4 flex flex-col justify-between flex-1">
              <div onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer text-start">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-text-main leading-tight">{lang === 'ar' ? product.name.replace('Sheep', 'خروف').replace('Calf', 'عجل') : product.name}</h3>
                  <span className="text-primary font-black text-sm">{formatCurrency(product.price)}</span>
                </div>
                <p className="text-[10px] text-text-secondary mb-2 font-bold uppercase tracking-widest">{t.home.origin}: {product.origin} • {product.weightRange}</p>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{product.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-dabeeha">
                <button 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:text-primary-variant transition-colors uppercase"
                >
                  {t.home.details} <ArrowRight className={`w-3 h-3 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </button>
                <button 
                  onClick={() => setQuickAddProduct(product)}
                  className="bg-primary hover:bg-primary-variant text-white p-2 rounded-card transition-colors shadow-level-1 active:scale-95"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Add Modal matching UI KIT */}
      {quickAddProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setQuickAddProduct(null)}
          />
          <div className="relative w-full max-w-lg bg-surface rounded-t-[32px] p-6 pb-10 shadow-level-2 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-border-dabeeha rounded-full mx-auto mb-6" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <img src={quickAddProduct.imageUrl} className="w-16 h-16 rounded-card object-cover shadow-inner border border-border-dabeeha" alt="" />
                <div className="text-start">
                  <h3 className="text-lg font-black text-text-main">{lang === 'ar' ? quickAddProduct.name.replace('Sheep', 'خروف').replace('Calf', 'عجل') : quickAddProduct.name}</h3>
                  <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">{translateCategory(quickAddProduct.category)} • {quickAddProduct.weightRange}</p>
                </div>
              </div>
              <button onClick={() => setQuickAddProduct(null)} className="p-2 bg-bg-dabeeha rounded-full text-text-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-start">
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => handleQuickAdd(quickAddProduct, Type.ALIVE)}
                  className="dabeeha-card w-full hover:border-primary border border-border-dabeeha flex items-center justify-between transition-all group p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-bg-dabeeha rounded-card text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Ghost className="w-6 h-6" />
                    </div>
                    <div className="text-start">
                      <p className="font-bold text-text-main text-sm">{t.home.aliveSelection}</p>
                      <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest">{t.home.aliveSub}</p>
                    </div>
                  </div>
                  <span className="font-black text-primary text-sm">{formatCurrency(quickAddProduct.price)}</span>
                </button>

                <button 
                  onClick={() => handleQuickAdd(quickAddProduct, Type.SLAUGHTERED)}
                  className="dabeeha-card w-full hover:border-primary border border-border-dabeeha flex items-center justify-between transition-all group p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-bg-dabeeha rounded-card text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Beef className="w-6 h-6" />
                    </div>
                    <div className="text-start">
                      <p className="font-bold text-text-main text-sm">{t.home.processedSelection}</p>
                      <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest">{t.home.processedSub}</p>
                    </div>
                  </div>
                  <span className="font-black text-primary text-sm">{formatCurrency(quickAddProduct.price)}</span>
                </button>

                {quickAddProduct.category === Category.CALF && (
                  <div className="dabeeha-card border-accent-gold/30 bg-accent-gold/5 space-y-4 p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-card bg-accent-gold text-white shadow-level-1">
                        {quickAddShares === 7 ? <Star className="w-6 h-6 fill-current" /> : <Users className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 text-start">
                        <p className="font-black text-text-main text-sm">{quickAddShares === 7 ? t.product.fullCalf : t.home.participateTitle}</p>
                        <p className="text-[9px] text-text-secondary font-black uppercase tracking-widest">{quickAddShares === 7 ? t.home.fullCalfComplete : t.home.participateSub}</p>
                      </div>
                      <div className="text-end">
                        <p className="text-base font-black text-primary">{formatCurrency((quickAddProduct.price / 7) * quickAddShares)}</p>
                        <p className="text-[9px] text-text-secondary font-black">{quickAddShares}/7 {lang === 'ar' ? 'أسهم' : 'Share'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white border border-border-dabeeha rounded-card p-1">
                      <button 
                        onClick={() => setQuickAddShares(Math.max(1, quickAddShares - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-bg-dabeeha rounded-card transition-colors text-text-secondary"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-black text-xs text-text-main">{quickAddShares === 7 ? (lang === 'ar' ? 'عجل كامل' : 'FULL CALF') : `${quickAddShares} ${lang === 'ar' ? 'أسهم' : 'Shares'}`}</span>
                      <button 
                        onClick={() => setQuickAddShares(Math.min(7, quickAddShares + 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-bg-dabeeha rounded-card transition-colors text-text-secondary"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => handleQuickAdd(quickAddProduct, Type.SLAUGHTERED, quickAddShares)}
                      className="dabeeha-btn-primary"
                    >
                      {quickAddShares === 7 ? t.product.reserve : t.home.confirmParticipation}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <p className="mt-6 text-center text-[10px] text-text-secondary font-bold uppercase tracking-widest">
              {t.home.cairoOnly}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
