export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: PaymentStatus;
  paymentReference?: string;
  createdAt: Date;
}
