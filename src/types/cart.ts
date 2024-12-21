import type { Product } from './product';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  producerId: string;
  producerName: string;
  unit: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export const productToCartItem = (product: Product, quantity: number = 1): Omit<CartItem, 'quantity'> => ({
  id: product._id,
  productId: product._id,
  name: product.name,
  price: product.price,
  image: product.images[0]?.url || '',
  producerId: product.producerId,
  producerName: product.producer?.name || '',
  unit: product.unit
}); 