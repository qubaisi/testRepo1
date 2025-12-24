
export enum Category {
  SHEEP = 'Sheep',
  CALF = 'Calf'
}

export enum Type {
  ALIVE = 'Alive',
  SLAUGHTERED = 'Slaughtered'
}

export enum OrderStatus {
  PENDING = 'Pending Reservation',
  PROCESSING = 'Preparing Sacrifice',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered'
}

export interface MediaUpdate {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  timestamp: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  type: Type;
  weightRange: string;
  price: number;
  description: string;
  imageUrl: string;
  origin: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
  shareCount?: number; // 1 to 7 for calves
  isFullSacrifice?: boolean;
}

export interface DeliveryAddress {
  building: string;
  street: string;
  district: string;
  floor: string;
  slaughterMeetingPoint?: string;
}

export interface BillingDetails {
  fullName: string;
  phone: string;
  nationalIdPhoto?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  address: DeliveryAddress;
  eidDay: string;
  timeSlot: string;
  notes?: string;
  mediaUpdates?: MediaUpdate[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'order' | 'system' | 'farm';
  orderId?: string;
}
