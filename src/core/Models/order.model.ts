export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: any[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  paymentMethod: 'COD' | 'RAZORPAY' | 'CREDIT_CARD' | 'DEBIT_CARD';
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery: string;
  trackingUpdates: TrackingUpdate[];
}

export interface TrackingUpdate {
  timestamp: Date;
  status: string;
  message: string;
  location?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  description: string;
  available: boolean;
}
