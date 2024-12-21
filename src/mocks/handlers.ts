import { http, HttpResponse } from 'msw';
import type { Product, ProductImage } from '@/types/product';
import { ProductCategory, ProductUnit, ProductStatus } from '@/types/product';
import type { Producer } from '@/types/producer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const mockProducer: Producer = {
  _id: 'p1',
  name: 'Producer 1',
  email: 'producer1@example.com',
  phone: '1234567890',
  status: 'active',
  productsCount: 1,
  rating: 4.5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockImage: ProductImage = {
  id: '1',
  url: 'image1.jpg',
  alt: 'Product 1 Image',
  isPrimary: true
};

export const handlers = [
  http.get(`${API_BASE_URL}/api/products`, () => {
    return HttpResponse.json<Product[]>([
      {
        _id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        images: [mockImage],
        producer: mockProducer,
        producerId: mockProducer._id,
        stock: 10,
        category: ProductCategory.Oil,
        unit: ProductUnit.Liter,
        status: ProductStatus.Active,
        rating: 4.5,
        reviewsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  }),

  http.post(`${API_BASE_URL}/api/products`, async ({ request }) => {
    const productData = await request.json() as Partial<Product>;
    const newProduct: Product = {
      _id: Math.random().toString(36).substring(2, 9),
      name: productData.name || '',
      description: productData.description || '',
      price: productData.price || 0,
      images: productData.images || [mockImage],
      producer: productData.producer || mockProducer,
      producerId: productData.producerId || mockProducer._id,
      stock: productData.stock || 0,
      category: productData.category || ProductCategory.Vegetables,
      unit: productData.unit || ProductUnit.Piece,
      status: productData.status || ProductStatus.Inactive,
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return HttpResponse.json(newProduct);
  }),

  http.put(`${API_BASE_URL}/api/products/:id`, async ({ request, params }) => {
    const productData = await request.json() as Partial<Product>;
    const updatedProduct: Product = {
      _id: params.id as string,
      name: productData.name || '',
      description: productData.description || '',
      price: productData.price || 0,
      images: productData.images || [mockImage],
      producer: productData.producer || mockProducer,
      producerId: productData.producerId || mockProducer._id,
      stock: productData.stock || 0,
      category: productData.category || ProductCategory.Vegetables,
      unit: productData.unit || ProductUnit.Piece,
      status: productData.status || ProductStatus.Inactive,
      rating: productData.rating || 0,
      reviewsCount: productData.reviewsCount || 0,
      createdAt: productData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return HttpResponse.json(updatedProduct);
  }),

  http.delete(`${API_BASE_URL}/api/products/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  })
]; 