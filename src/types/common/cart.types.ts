import type { Product, PopulatedProduct } from '../models/product.types';
import type { Types } from 'mongoose';

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

const objectIdToString = (id: Types.ObjectId | string): string => {
  return typeof id === 'string' ? id : id.toString();
};

export const productToCartItem = (product: Product | PopulatedProduct, quantity: number = 1): Omit<CartItem, 'quantity'> => {
  if ('producer' in product) {
    return {
      id: objectIdToString(product._id),
      productId: objectIdToString(product._id),
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '',
      producerId: objectIdToString(product.producer._id),
      producerName: product.producer.name,
      unit: product.unit
    };
  }

  return {
    id: objectIdToString(product._id),
    productId: objectIdToString(product._id),
    name: product.name,
    price: product.price,
    image: product.images[0]?.url || '',
    producerId: objectIdToString(product.producerId),
    producerName: '',
    unit: product.unit
  };
}; 