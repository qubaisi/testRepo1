
import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, MediaUpdate, Type } from '../types';
import { formatCurrency } from '../utils';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  History, 
  Play, 
  ChevronRight,
  Maximize2,
  Map,
  Ghost,
  XCircle,
  AlertTriangle,
  StickyNote,
  FileText,
  Printer,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../i18n';

const EID_ADHA_2025_START = new Date('2025-06-16T00:00:00Z');

interface OrderHistoryProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
  lang: 'en' | 'ar';
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onCancelOrder, lang }) => {
  const navigate = useNavigate();
  const t = translations[lang];
  const [selectedMedia, setSelectedMedia] = useState<{orderId: string, media: MediaUpdate} | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 bg-bg-dabeeha border border-border-dabeeha rounded-full flex items-center justify-center text-text-secondary mb-6 shadow-level-1">
          <History className="w-10 h-10 opacity-40" />
        </div>
        <h2 className="text-xl font-black text-text-main mb-2">{t.orders.empty}</h2>
        <p className="text-text-secondary text-sm mb-8 max-w-xs">{t.orders.emptySub}</p>
        <button 
          onClick={() => navigate('/')}
          className="dabeeha-btn-primary max-w-[200px]"
        >
          {t.orders.viewMarketplace}
        </button>
      </div>
    );
  }

  const getStatusIndex = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 0;
      case OrderStatus.PROCESSING: return 1;
      case OrderStatus.OUT_FOR_DELIVERY: return 2;
      case OrderStatus.DELIVERED: return 3;
      default: return 0;
    }
  };

  const steps = [
    { label: t.orders.reserved, icon: <Clock className="w-4 h-4" /> },
    { label: t.orders.preparing, icon: <Package className="w-4 h-4" /> },
    { label: t.orders.onWay, icon: <Truck className="w-4 h-4" /> },
    { label: t.orders.delivered, icon: <CheckCircle2 className="w-4 h-4" /> }
  ];

  const handlePrint = () => { window.print(); };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{t.orders.title}</h2>
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{orders.length} {t.orders.total}</span>
      </div>

      <div className="space-y-6 print:hidden">
        {orders.map((order) => {
          const currentIndex = getStatusIndex(order.status);
          const hasAlive = order.items.some(i => i.type === Type.ALIVE);
          
          return (
            <div key={order.id} className="dabeeha-card flex flex-col p-0 border border-border-dabeeha overflow-hidden">
              <div className="bg-bg-dabeeha/50 p-4 border-b border-border-dabeeha">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-start">
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">{t.orders.liveTracking}</p>
                    <h3 className="text-base font-black text-text-main tracking-tight">{order.id}</h3>
                  </div>
                  <div className={`${lang === 'ar' ? 'text-left' : 'text-right'} flex flex-col items-end gap-1`}>
                    <p className="text-sm font-black text-primary">{formatCurrency(order.total)}</p>
                    <p className="text-[10px] text-text-secondary font-bold uppercase">{new Date(order.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                    <button 
                      onClick={() => setInvoiceOrder(order)}
                      className="text-[9px] font-bold text-text-secondary uppercase flex items-center gap-1 mt-2 hover:text-primary transition-colors"
                    >
                      <FileText className="w-3 h-3" /> {t.orders.downloadInvoice}
                    </button>
                  </div>
                </div>

                <div className="relative pt-6 pb-2 px-2">
                  <div className="absolute top-[2.2rem] left-4 right-4 h-0.5 bg-border-dabeeha rounded-full" />
                  <div 
                    className={`absolute top-[2.2rem] ${lang === 'ar' ? 'right-4' : 'left-4'} h-0.5 bg-primary transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 8px)` }}
                  />
                  <div className="relative flex justify-between">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-2 ${
                          idx <= currentIndex ? 'bg-primary text-white border-primary shadow-level-1' : 'bg-surface text-border-dabeeha border-border-dabeeha'
                        }`}>
                          {step.icon}
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-tighter ${idx <= currentIndex ? 'text-text-main' : 'text-text-secondary opacity-40'}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface space-y-4">
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-bg-dabeeha px-2 py-1.5 rounded-[8px] border border-border-dabeeha">
                      <div className="flex items-center gap-1.5">
                        {item.type === Type.ALIVE ? <Ghost className="w-3 h-3 text-primary" /> : <Package className="w-3 h-3 text-primary" />}
                        <span className="text-[10px] font-bold text-text-main">
                          {item.quantity}x {lang === 'ar' ? item.name.replace('Sheep', 'خروف').replace('Calf', 'عجل') : item.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border-dabeeha/30">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Calendar className="w-3 h-3 text-accent-gold" />
                      <span className="text-[9px] font-bold uppercase">{order.eidDay}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <MapPin className="w-3 h-3 text-accent-gold" />
                      <span className="text-[9px] font-bold uppercase">{order.address.district}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/product/${order.items[0]?.id}`)} className="text-primary hover:bg-bg-dabeeha p-1.5 rounded-card transition-colors">
                    <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoice Modal matching DABEEHA UI KIT */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-text-main/60 backdrop-blur-sm print:bg-white print:p-0">
          <div className="absolute inset-0 print:hidden" onClick={() => setInvoiceOrder(null)} />
          <div className="relative w-full max-w-2xl bg-surface rounded-card shadow-level-2 print:shadow-none print:rounded-none flex flex-col max-h-[90vh] print:max-h-none overflow-hidden print:overflow-visible">
            <div className="flex items-center justify-between p-4 border-b border-border-dabeeha print:hidden bg-surface">
              <h3 className="font-bold text-text-main text-sm uppercase tracking-widest">{t.orders.invoiceTitle}</h3>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="p-2 bg-bg-dabeeha text-primary rounded-card hover:bg-border-dabeeha transition-colors"><Printer className="w-4 h-4" /></button>
                <button onClick={() => setInvoiceOrder(null)} className="p-2 bg-bg-dabeeha text-text-secondary rounded-card hover:text-red-600"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 print:p-0 text-start">
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="w-10 h-10 bg-primary rounded-card flex items-center justify-center text-white font-black text-xl mb-4">D</div>
                    <h2 className="text-xl font-black text-text-main tracking-tight">#{invoiceOrder.id}</h2>
                    <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest mt-1">{t.orders.orderDate}: {new Date(invoiceOrder.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-end">
                    <span className="bg-primary/10 text-primary text-[9px] px-2 py-1 rounded-card font-bold border border-primary/20">{t.orders.paid}</span>
                  </div>
                </div>
                {/* Simplified Invoice Body for brevity */}
                <div className="pt-8 border-t border-border-dabeeha">
                  <p className="text-xs font-bold text-text-main mb-4 uppercase tracking-widest">{t.orders.billTo}</p>
                  <p className="text-sm font-bold text-text-main">Cairo Hub Resident</p>
                  <p className="text-xs text-text-secondary mt-1">{invoiceOrder.address.district}, Cairo</p>
                </div>
                {/* Total Section */}
                <div className="pt-8 border-t border-text-main flex justify-end">
                  <div className="w-full max-w-[200px] space-y-2">
                    <div className="flex justify-between text-xs text-text-secondary"><span>{t.cart.subtotal}</span><span className="text-text-main">{formatCurrency(invoiceOrder.total)}</span></div>
                    <div className="flex justify-between text-xs font-bold text-primary"><span>{t.orders.paid} (25%)</span><span>-{formatCurrency(invoiceOrder.total * 0.25)}</span></div>
                    <div className="flex justify-between items-center pt-2 border-t border-text-main">
                      <span className="text-[10px] font-black text-text-main uppercase">{t.orders.dueOnDelivery}</span>
                      <span className="text-lg font-black text-primary">{formatCurrency(invoiceOrder.total * 0.75)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
