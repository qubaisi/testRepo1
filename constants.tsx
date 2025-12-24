
import { Product, Category, Type } from './types';

export const CAIRO_COORDS = { lat: 30.0444, lng: 31.2357 };
export const MAX_DISTANCE_KM = 50; // Roughly Cairo Metro area

export interface LocationInfo {
  name: string;
  lat: number;
  lng: number;
}

export const CAIRO_DISTRICTS_DATA: LocationInfo[] = [
  { name: "New Cairo", lat: 30.0074, lng: 31.4913 },
  { name: "Maadi", lat: 29.9602, lng: 31.2569 },
  { name: "Zamalek", lat: 30.0631, lng: 31.2222 },
  { name: "Heliopolis", lat: 30.0900, lng: 31.3200 },
  { name: "Nasr City", lat: 30.0500, lng: 31.3500 },
  { name: "Dokki", lat: 30.0390, lng: 31.2120 },
  { name: "Mohandessin", lat: 30.0550, lng: 31.2000 },
  { name: "Sheikh Zayed", lat: 30.0400, lng: 30.9800 },
  { name: "6th of October", lat: 29.9700, lng: 30.9400 },
  { name: "Downtown", lat: 30.0444, lng: 31.2357 }
];

export const SLAUGHTER_MEETING_POINTS_DATA: LocationInfo[] = [
  { name: "Basateen Public Abattoir (Authorized)", lat: 29.9800, lng: 31.2700 },
  { name: "Warraq District Slaughter Point", lat: 30.1200, lng: 31.2100 },
  { name: "Mounib Designated Abattoir", lat: 29.9900, lng: 31.2100 },
  { name: "Al-Marg Central Point", lat: 30.1500, lng: 31.3300 },
  { name: "Hub Farm Point - New Cairo (Tagamoa)", lat: 30.0100, lng: 31.5000 },
  { name: "Hub Farm Point - 6th of October", lat: 29.9600, lng: 30.9300 },
  { name: "Zamalek Designated Support Point", lat: 30.0631, lng: 31.2222 }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Rahmani Sheep',
    category: Category.SHEEP,
    type: Type.ALIVE,
    weightRange: '45-55kg',
    price: 8500,
    description: 'High quality Rahmani sheep, known for rich meat and low fat content. Raised in Delta farms.',
    imageUrl: 'https://picsum.photos/seed/sheep1/600/400',
    origin: 'Sharkia, Egypt'
  },
  {
    id: '2',
    name: 'Baladi Calf',
    category: Category.CALF,
    type: Type.ALIVE,
    weightRange: '350-400kg',
    price: 65000,
    description: 'Traditional Egyptian Baladi calf. Excellent growth and meat quality.',
    imageUrl: 'https://picsum.photos/seed/calf1/600/400',
    origin: 'Monufia, Egypt'
  },
  {
    id: '3',
    name: 'Premium Lamb Leg',
    category: Category.SHEEP,
    type: Type.SLAUGHTERED,
    weightRange: '2-3kg',
    price: 1200,
    description: 'Freshly slaughtered and expertly cut lamb leg. Vacuum sealed for freshness.',
    imageUrl: 'https://picsum.photos/seed/meat1/600/400',
    origin: 'Cairo Abattoir'
  },
  {
    id: '4',
    name: 'Barki Sheep',
    category: Category.SHEEP,
    type: Type.ALIVE,
    weightRange: '40-50kg',
    price: 9200,
    description: 'Desert-raised Barki sheep from Marsa Matrouh. Renowned for its unique taste.',
    imageUrl: 'https://picsum.photos/seed/sheep2/600/400',
    origin: 'Marsa Matrouh, Egypt'
  },
  {
    id: '5',
    name: 'Beef Tenderloin',
    category: Category.CALF,
    type: Type.SLAUGHTERED,
    weightRange: '1.5-2kg',
    price: 1800,
    description: 'The most tender cut of the calf. Selected from young premium cattle.',
    imageUrl: 'https://picsum.photos/seed/meat2/600/400',
    origin: 'Cairo Abattoir'
  }
];
