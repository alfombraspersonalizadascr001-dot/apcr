export type ViewMode = 'portal' | 'physical' | 'digital' | 'split';

export interface MatConfig {
  color: string;
  colorName: string;
  borderColor: string;
  hasBeveledBorder: boolean;
  widthCm: number;
  heightCm: number;
  isCustomSize: boolean;
  selectedLogo: string;
  customLogoUrl: string | null;
  clientName: string;
}

export interface OrderStage {
  id: number;
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface OrderStatus {
  orderId: string;
  clientName: string;
  itemDescription: string;
  dimensions: string;
  color: string;
  stages: OrderStage[];
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  destination: string;
  imagePreview?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'restaurant' | 'corporate' | 'health' | 'auto' | 'retail';
  categoryLabel: string;
  image: string;
  location: string;
  productType: string;
}
