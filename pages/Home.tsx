
import React, { useState, useEffect } from 'react';
import { Category, Type, Product, CartItem } from '../types';
import { formatCurrency } from '../utils';
import { Search, PlusCircle, ArrowRight, Ghost, Beef, Users, X, Minus, Plus, Star, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../i18n';
import { api } from '../services/api';

interface HomeProps {
  addToCart: (item: CartItem) => void;
  lang: 'en' | 'ar';
}

const Home: React.FC<HomeProps> = ({ addToCart, lang }) => {
  const navigate = useNavigate();
  const t = translations[lang];
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [quickAddShares, setQuickAddShares] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [activeCategory]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProducts(activeCategory === 'All' ? undefined : activeCategory);
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return searchMatch;
  });

  const translateCategory = (cat: string) => {
    if (cat === Category.SHEEP) return t.home.categories.sheep;
    if (cat === Category.CALF) return t.home.categories.calf;
    return t.home.all;
  };

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
      <div className="relative">
        <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5`} />
        <input
          type="text"
          placeholder={t.home.searchPlaceholder}
          className="dabeeha-input w-full"
          style={{ paddingLeft: lang === 'en' ? '40px' : '16px', paddingRight: lang === 'ar' ? '40px' : '16px' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="dabeeha-card h-48 bg-gray-200 animate-pulse rounded-card"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <RefreshCcw className="w-12 h-12 text-border-dabeeha" />
          <p className="text-text-secondary font-bold">{lang === 'ar' ? 'لا توجد منتجات حالياً' : 'No products found'}</p>
          <button onClick={loadProducts} className="text-primary text-sm font-black underline">{lang === 'ar' ? 'تحديث' : 'Reload'}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="dabeeha-card flex flex-col sm:flex-row h-full group transition-all hover:shadow-level-2 border border-border-dabeeha/50 p-0 overflow-hidden">
              <div className="relative w-full sm:w-1/3 aspect-[4/3] sm:aspect-square overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                  <button onClick={() => navigate(`/product/${product.id}`)} className="text-xs font-bold text-primary flex items-center gap-1 hover:text-primary-variant transition-colors uppercase">
                    {t.home.details} <ArrowRight className={`w-3 h-3 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                  <button onClick={() => setQuickAddProduct(product)} className="bg-primary hover:bg-primary-variant text-white p-2 rounded-card transition-colors shadow-level-1">
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {quickAddProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setQuickAddProduct(null)} />
          <div className="relative w-full max-w-lg bg-surface rounded-t-[32px] p-6 pb-10 shadow-level-2 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-border-dabeeha rounded-full mx-auto mb-6" />
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <img src={quickAddProduct.imageUrl} className="w-16 h-16 rounded-card object-cover border border-border-dabeeha" alt="" />
                <div className="text-start">
                  <h3 className="text-lg font-black text-text-main">{lang === 'ar' ? quickAddProduct.name.replace('Sheep', 'خروف').replace('Calf', 'عجل') : quickAddProduct.name}</h3>
                  <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">{translateCategory(quickAddProduct.category)}</p>
                </div>
              </div>
              <button onClick={() => setQuickAddProduct(null)} className="p-2 bg-bg-dabeeha rounded-full text-text-secondary"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <button onClick={() => handleQuickAdd(quickAddProduct, Type.ALIVE)} className="dabeeha-card w-full hover:border-primary border border-border-dabeeha flex items-center justify-between group p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-bg-dabeeha rounded-card text-primary group-hover:bg-primary group-hover:text-white transition-all"><Ghost className="w-6 h-6" /></div>
                  <div className="text-start"><p className="font-bold text-text-main text-sm">{t.home.aliveSelection}</p></div>
                </div>
                <span className="font-black text-primary text-sm">{formatCurrency(quickAddProduct.price)}</span>
              </button>
              <button onClick={() => handleQuickAdd(quickAddProduct, Type.SLAUGHTERED)} className="dabeeha-card w-full hover:border-primary border border-border-dabeeha flex items-center justify-between group p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-bg-dabeeha rounded-card text-primary group-hover:bg-primary group-hover:text-white transition-all"><Beef className="w-6 h-6" /></div>
                  <div className="text-start"><p className="font-bold text-text-main text-sm">{t.home.processedSelection}</p></div>
                </div>
                <span className="font-black text-primary text-sm">{formatCurrency(quickAddProduct.price)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
