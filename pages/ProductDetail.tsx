
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { formatCurrency } from '../utils';
import { ArrowLeft, Share2, ShieldCheck, Scale, Plus, Beef, Ghost, Users, Check, Star, Wallet } from 'lucide-react';
import { Type, Category, CartItem } from '../types';
import { translations } from '../i18n';

interface ProductDetailProps {
  addToCart: (product: CartItem) => void;
  lang: 'en' | 'ar';
}

const ProductDetail: React.FC<ProductDetailProps> = ({ addToCart, lang }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = translations[lang];
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  
  const isCalf = product?.category === Category.CALF;
  
  const [selectedType, setSelectedType] = useState<Type>(product?.type || Type.ALIVE);
  const [purchaseMode, setPurchaseMode] = useState<'full' | 'share'>('full');
  const [shareCount, setShareCount] = useState<number>(1);

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    if (isCalf && purchaseMode === 'share') {
      return (product.price / 7) * shareCount;
    }
    return product.price;
  }, [product, purchaseMode, shareCount, isCalf]);

  const downPayment = currentPrice * 0.25;
  const balanceRemaining = currentPrice - downPayment;

  if (!product) return <div className="p-4 text-center py-20 font-bold text-text-secondary">Product not found.</div>;

  const handleAddToCart = () => {
    const itemToAdd: CartItem = {
      ...product,
      type: selectedType,
      quantity: 1,
      shareCount: (isCalf && purchaseMode === 'share') ? shareCount : undefined,
      isFullSacrifice: !isCalf || purchaseMode === 'full' || (purchaseMode === 'share' && shareCount === 7),
      price: currentPrice
    };
    addToCart(itemToAdd);
    navigate('/cart');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <button onClick={() => navigate(-1)} className={`mb-4 flex items-center gap-2 text-text-secondary hover:text-primary font-bold transition-colors ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <ArrowLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.product.back}
      </button>

      <div className="dabeeha-card p-0 overflow-hidden shadow-level-2 border border-border-dabeeha">
        <div className="relative aspect-[16/9]">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          <div className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} bg-surface/80 backdrop-blur p-2.5 rounded-card shadow-level-1 text-text-secondary hover:text-primary cursor-pointer transition-colors border border-border-dabeeha`}>
            <Share2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0 text-start">
              <h1 className="text-2xl font-black text-text-main leading-tight mb-2 truncate">{lang === 'ar' ? product.name.replace('Sheep', 'خروف').replace('Calf', 'عجل') : product.name}</h1>
              <div className="flex items-center gap-2">
                <span className="bg-bg-dabeeha text-text-secondary border border-border-dabeeha px-2 py-1 rounded-[4px] text-[10px] font-black uppercase tracking-wider">{t.home.origin}: {product.origin}</span>
              </div>
            </div>
            <div className={`${lang === 'ar' ? 'text-left' : 'text-right'} flex-shrink-0`}>
              <p className="text-2xl font-black text-primary">{formatCurrency(currentPrice)}</p>
              <div className="flex items-center gap-1.5 mt-1 bg-accent-gold/10 px-2 py-1 rounded-[4px] border border-accent-gold/20">
                <Wallet className="w-3 h-3 text-accent-gold" />
                <p className="text-[9px] font-black text-accent-gold uppercase tracking-tighter">
                  {formatCurrency(downPayment)} {lang === 'ar' ? 'مقدم' : 'Downpayment'}
                </p>
              </div>
            </div>
          </div>

          {isCalf && (
            <div className="bg-bg-dabeeha p-4 rounded-card border border-border-dabeeha space-y-4">
              <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest text-start">{t.product.purchaseMethod}</h3>
              
              <div className="relative flex bg-surface p-1 rounded-button border border-border-dabeeha shadow-inner h-12">
                <div 
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[16px] transition-all duration-300 ease-out shadow-level-1 ${
                    purchaseMode === 'full' 
                      ? (lang === 'ar' ? 'right-1' : 'left-1') + ' bg-primary' 
                      : (lang === 'ar' ? 'right-[calc(50%+1px)]' : 'left-[calc(50%+1px)]') + ' bg-primary-variant'
                  }`}
                />
                <button 
                  onClick={() => setPurchaseMode('full')}
                  className={`relative z-10 flex-1 text-[11px] font-black uppercase tracking-tight transition-colors ${purchaseMode === 'full' ? 'text-white' : 'text-text-secondary'}`}
                >
                  {t.product.fullCalf}
                </button>
                <button 
                  onClick={() => setPurchaseMode('share')}
                  className={`relative z-10 flex-1 text-[11px] font-black uppercase tracking-tight transition-colors ${purchaseMode === 'share' ? 'text-white' : 'text-text-secondary'}`}
                >
                  {t.home.participateTitle}
                </button>
              </div>

              {purchaseMode === 'share' && (
                <div className="grid grid-cols-7 gap-1 pt-2">
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <button
                      key={num}
                      onClick={() => setShareCount(num)}
                      className={`h-10 rounded-card text-[11px] font-black transition-all border ${
                        shareCount === num 
                          ? 'bg-primary text-white border-primary shadow-level-1' 
                          : 'bg-surface text-text-secondary border-border-dabeeha'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest text-start">{t.product.fulfillment}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedType(Type.ALIVE)}
                className={`p-4 rounded-card border-2 transition-all flex items-center gap-3 text-start ${
                  selectedType === Type.ALIVE ? 'border-primary bg-primary/5 text-primary' : 'border-border-dabeeha bg-surface text-text-secondary'
                }`}
              >
                <Ghost className="w-5 h-5 flex-shrink-0" />
                <span className="text-[11px] font-black uppercase tracking-tight leading-tight">{t.home.aliveSelection}</span>
              </button>
              <button
                onClick={() => setSelectedType(Type.SLAUGHTERED)}
                className={`p-4 rounded-card border-2 transition-all flex items-center gap-3 text-start ${
                  selectedType === Type.SLAUGHTERED ? 'border-primary bg-primary/5 text-primary' : 'border-border-dabeeha bg-surface text-text-secondary'
                }`}
              >
                <Beef className="w-5 h-5 flex-shrink-0" />
                <span className="text-[11px] font-black uppercase tracking-tight leading-tight">{t.home.processedSelection}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <Scale className="w-4 h-4" />, label: t.product.weight, val: (isCalf && purchaseMode === 'share') ? `~${Math.round((parseInt(product.weightRange) || 350) / 7 * shareCount)}kg` : product.weightRange },
              { icon: <ShieldCheck className="w-4 h-4" />, label: t.product.health, val: t.product.veterinary },
              { icon: <Plus className="w-4 h-4" />, label: t.product.age, val: t.product.compliant },
            ].map((spec, i) => (
              <div key={i} className="bg-bg-dabeeha rounded-card p-3 text-center border border-border-dabeeha">
                <div className="text-primary flex justify-center mb-1">{spec.icon}</div>
                <p className="text-[8px] text-text-secondary uppercase font-black tracking-widest mb-0.5">{spec.label}</p>
                <p className="text-[10px] font-black text-text-main">{spec.val}</p>
              </div>
            ))}
          </div>

          <div className="text-start space-y-4">
            <h3 className="text-lg font-black text-text-main">{t.product.about}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{product.description}</p>
            <div className="bg-primary text-white p-4 rounded-card shadow-level-1">
              <p className="text-accent-gold font-black text-[10px] uppercase tracking-widest mb-2">{t.product.important}:</p>
              <p className="text-xs text-bg-dabeeha/90 leading-relaxed">{selectedType === Type.ALIVE ? t.product.aliveNotice : t.product.slaughterNotice}</p>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] font-bold text-bg-dabeeha/60 uppercase">{t.orders.dueOnDelivery}</span>
                <span className="text-sm font-black text-accent-gold">{formatCurrency(balanceRemaining)}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="dabeeha-btn-primary shadow-level-2"
          >
            {t.product.reserve} <Plus className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
