// Types pour BIPCOSA06

export interface Product {
  _id?: string;
  id: number;
  name: string;
  quality: string;
  image: string;
  imagePublicId?: string;
  flagColor: string;
  flagText: string;
  category: string;
  farm: string;
  description: string;
  prices: Array<{ 
    weight: string; 
    price: string; 
    id?: string;
  }>;
  video?: string;
  videoPublicId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  value: string;
  label: string;
}

export interface Farm {
  value: string;
  label: string;
  country: string;
}

export interface ShopConfig {
  _id?: string;
  backgroundType: 'gradient' | 'image' | 'url';
  backgroundImage?: string;
  backgroundUrl?: string;
  backgroundImagePublicId?: string;
  shopName: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SocialNetwork {
  id: string;
  name: string;
  icon: string;
  url: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InfoContent {
  id: string;
  title: string;
  description: string;
  additionalInfo?: string;
  items?: string[];
}

export interface ContactContent {
  id: string;
  title: string;
  description: string;
  telegramUsername?: string;
  telegramLink?: string;
  additionalInfo?: string;
}