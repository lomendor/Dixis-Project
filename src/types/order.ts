export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type ShippingStatus = 'pending' | 'processing' | 'shipped' | 'delivered';
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderNote {
  id: string;
  type: 'customer' | 'internal';
  message: string;
  createdAt: Date;
  createdBy: string;
}

export interface OrderReturn {
  id: string;
  reason: string;
  status: ReturnStatus;
  items: Array<{
    orderItemId: string;
    quantity: number;
    reason: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  notes: OrderNote[];
  returns?: OrderReturn[];
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
} 