
import React, { useState, useMemo, useEffect } from 'react';
import { CartItem, DeliveryAddress, BillingDetails, Order, OrderStatus, Type } from '../types';
import { calculateDistance, formatCurrency } from '../utils';
import { CAIRO_DISTRICTS_DATA, SLAUGHTER_MEETING_POINTS_DATA } from '../constants';
import { 
  Trash2, 
  ShoppingBag, 
  ChevronRight, 
  Calendar, 
  Clock, 
  MapPin, 
  MapPinned, 
  User, 
  Phone,
  Building2,
  Wallet,
  Receipt,
  CheckCircle,
  Plus,
  Minus,
  StickyNote,
  AlertCircle,
  Ghost,
  Beef,
  Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../i18n';

interface CartProps {
  cart: CartItem[];
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  onPlaceOrder: (order: Order) => void;
  lang: 'en' | 'ar';
}

const EID_DAYS = ["1st Day of Eid", "2nd Day of Eid", "3rd Day of Eid", "4th Day of Eid"];
const TIME_SLOTS = ["Early Morning (6 AM - 10 AM)", "Late Morning (10 AM - 2 PM)", "Afternoon (2 PM - 6 PM)"];

const Cart: React.FC<CartProps> = ({ cart, removeFromCart, updateQuantity, onPlaceOrder, lang }) => {
  const navigate = useNavigate();
  const t = translations[lang];
  const [selectedDay, setSelectedDay] = useState(EID_DAYS[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [notes, setNotes] = useState('');
  const [pendingRemoval, setPendingRemoval] = useState<{key: string, name: string} | null>(null);
  
  const [address, setAddress] = useState<DeliveryAddress>({
    building: '', street: '', district: CAIRO_DISTRICTS_DATA[0].name, floor: '', slaughterMeetingPoint: SLAUGHTER_MEETING_POINTS_DATA[0].name
  });

  const [billing, setBilling] = useState<BillingDetails>({ fullName: '', phone: '' });

  const hasAliveSacrifice = useMemo(() => cart.some(item => item.type === Type.ALIVE), [cart]);
  const getItemKey = (item: CartItem) => `${item.id}-${item.type}-${item.shareCount || 'full'}`;

  const findMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  const sortedMeetingPoints = useMemo(() => {
    const target = userLocation || CAIRO_DISTRICTS_DATA.find(d => d.name === address.district) || CAIRO_DISTRICTS_DATA[0];
    return [...SLAUGHTER_MEETING_POINTS_DATA].map(p => ({
      ...p, distance: calculateDistance(target.lat, target.lng, p.lat, p.lng)
    })).sort((a, b) => a.distance - b.distance);
  }, [address.district, userLocation]);

  useEffect(() => {
    if (hasAliveSacrifice && sortedMeetingPoints.length > 0) {
      setAddress(prev => ({ ...prev, slaughterMeetingPoint: sortedMeetingPoints[0].name }));
    }
  }, [sortedMeetingPoints, hasAliveSacrifice]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const downPayment = total * 0.25;
  const balance = total - downPayment;

  const isFormValid = address.building && address.street && billing.fullName && billing.phone && (!hasAliveSacrifice || address.slaughterMeetingPoint);

  const handleCheckout = () => {
    if (!isFormValid) return;
    const newOrder: Order = {
      id: `DBH-${Math.floor(Math.random() * 1000000)}`,
      items: [...cart], total, status: OrderStatus.PENDING, date: new Date().toISOString(), address: { ...address }, eidDay: selectedDay, timeSlot: selectedTime, notes: notes.trim() || undefined
    };
    onPlaceOrder(newOrder);
    navigate('/orders');
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 bg-bg-dabeeha rounded-full flex items-center justify-center text-text-secondary mb-6 border border-border-dabeeha"><ShoppingBag className="w-10 h-10 opacity-30" /></div>
        <h2 className="text-xl font-black text-text-main mb-2">{t.cart.empty}</h2>
        <button onClick={() => navigate('/')} className="dabeeha-btn-primary max-w-[200px] mt-6">{t.cart.browse}</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 text-start">
      <h2 className="text-xl font-black text-text-main uppercase tracking-tight px-1">{t.cart.title}</h2>
      
      <div className="space-y-3">
        {cart.map((item, idx) => (
          <div key={idx} className="dabeeha-card p-3 flex gap-3 border border-border-dabeeha shadow-level-1">
            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-card object-cover border border-border-dabeeha" />
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-text-main text-xs truncate">{lang === 'ar' ? item.name.replace('Sheep', 'خروف').replace('Calf', 'عجل') : item.name}</h3>
                  <button onClick={() => removeFromCart(getItemKey(item))} className="text-text-secondary hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1">
                    {item.type === Type.ALIVE ? <Ghost className="w-3 h-3 text-primary" /> : <Beef className="w-3 h-3 text-primary" />}
                    <span className="text-[9px] text-text-secondary font-black uppercase tracking-widest">{lang === 'ar' ? (item.type === Type.ALIVE ? t.home.types.alive : t.home.types.slaughtered) : item.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-primary font-black text-xs">{formatCurrency(item.price * item.quantity)}</p>
                <div className="flex items-center bg-bg-dabeeha rounded-card p-0.5 border border-border-dabeeha">
                  <button onClick={() => updateQuantity(getItemKey(item), item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-text-secondary"><Minus className="w-3 h-3" /></button>
                  <span className="w-6 text-center text-[10px] font-black">{item.quantity}</span>
                  <button onClick={() => updateQuantity(getItemKey(item), item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-text-secondary"><Plus className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasAliveSacrifice && (
        <div className="dabeeha-card border-2 border-primary bg-primary/5 space-y-4">
          <div className="flex items-center justify-between border-b border-primary/10 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-black text-text-main text-xs uppercase">{t.cart.meetingPoint}</h3>
            </div>
            {!userLocation && <button onClick={findMe} className="text-[9px] font-black text-primary uppercase bg-white px-2 py-1 rounded-card border border-primary/20">{t.cart.useGps}</button>}
          </div>
          <div className="space-y-2 max-h-[180px] overflow-y-auto hide-scrollbar">
            {sortedMeetingPoints.map((point, idx) => (
              <button key={point.name} onClick={() => setAddress({...address, slaughterMeetingPoint: point.name})} className={`w-full p-3 rounded-card border-2 flex items-center justify-between ${address.slaughterMeetingPoint === point.name ? 'border-primary bg-white' : 'border-border-dabeeha bg-surface opacity-60'}`}>
                <div className="text-start">
                  <p className="text-[10px] font-black text-text-main uppercase leading-tight">{point.name} {idx === 0 && <span className="bg-primary text-white text-[8px] px-1 rounded-full ml-1">{t.cart.nearest}</span>}</p>
                  <p className="text-[8px] text-text-secondary font-bold">~{point.distance.toFixed(1)} km {lang === 'ar' ? 'منك' : 'away'}</p>
                </div>
                {address.slaughterMeetingPoint === point.name && <CheckCircle className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="dabeeha-card border border-border-dabeeha space-y-4">
        <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3" /> {t.cart.schedule}</h3>
        <div className="grid grid-cols-2 gap-2">
          {EID_DAYS.map(day => (
            <button key={day} onClick={() => setSelectedDay(day)} className={`py-3 rounded-card text-[9px] font-black uppercase transition-all border ${selectedDay === day ? 'bg-primary text-white border-primary shadow-level-1' : 'bg-bg-dabeeha text-text-secondary border-border-dabeeha'}`}>{day}</button>
          ))}
        </div>
      </div>

      <div className="dabeeha-card border border-border-dabeeha space-y-5">
        <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2"><MapPinned className="w-3 h-3" /> {t.cart.homeAddress}</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-text-secondary uppercase px-1">{t.cart.districtLabel}</label>
            <select className="dabeeha-input w-full text-xs" value={address.district} onChange={e => setAddress({...address, district: e.target.value})}>
              {CAIRO_DISTRICTS_DATA.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder={t.cart.building} className="dabeeha-input w-full text-xs" value={address.building} onChange={e => setAddress({...address, building: e.target.value})} />
            <input type="text" placeholder={t.cart.floor} className="dabeeha-input w-full text-xs" value={address.floor} onChange={e => setAddress({...address, floor: e.target.value})} />
          </div>
          <input type="text" placeholder={t.cart.street} className="dabeeha-input w-full text-xs" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
        </div>
      </div>

      <div className="dabeeha-card border border-border-dabeeha space-y-5">
        <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2"><User className="w-3 h-3" /> {t.cart.contact}</h3>
        <div className="space-y-4">
          <input type="text" placeholder={t.cart.fullName} className="dabeeha-input w-full text-xs" value={billing.fullName} onChange={e => setBilling({...billing, fullName: e.target.value})} />
          <input type="tel" placeholder={t.cart.phone} className="dabeeha-input w-full text-xs" value={billing.phone} onChange={e => setBilling({...billing, phone: e.target.value})} />
        </div>
      </div>

      <div className="dabeeha-card border border-border-dabeeha shadow-level-2 space-y-4">
        <div className="flex justify-between items-center text-xs font-bold text-text-secondary uppercase tracking-wider"><span>{t.cart.subtotal}</span><span>{formatCurrency(total)}</span></div>
        <div className="flex justify-between items-center bg-primary/5 p-3 rounded-card border border-primary/10">
          <div className="text-start"><p className="text-[9px] font-black text-primary uppercase tracking-widest">{t.cart.reservationFee}</p><p className="text-[11px] font-black text-primary">{t.cart.payNow}</p></div>
          <span className="text-base font-black text-primary">{formatCurrency(downPayment)}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-primary text-white rounded-card shadow-level-1">
          <div className="text-start"><span className="text-[9px] text-accent-gold font-black uppercase tracking-widest">{t.orders.dueOnDelivery}</span></div>
          <span className="text-sm font-black text-accent-gold">{formatCurrency(balance)}</span>
        </div>
        <div className="pt-2 border-t border-border-dabeeha flex justify-between items-center"><span className="text-base font-black text-text-main">{t.cart.total}</span><span className="text-xl font-black text-text-main">{formatCurrency(total)}</span></div>
        <button onClick={handleCheckout} className={`dabeeha-btn-primary ${!isFormValid ? 'opacity-50 grayscale' : 'shadow-level-2'}`} disabled={!isFormValid}>{t.cart.confirmReservation}</button>
      </div>
    </div>
  );
};

export default Cart;
