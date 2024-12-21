import { z } from 'zod';
import { ProductCategory, ProductUnit, ProductStatus } from '@/types/models/product.types';

export const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url('Μη έγκυρο URL εικόνας'),
  alt: z.string().optional(),
  isPrimary: z.boolean().optional(),
  order: z.number().int().min(0).optional()
});

export const productSeoSchema = z.object({
  title: z.string().min(1, 'Ο τίτλος SEO είναι υποχρεωτικός'),
  description: z.string().min(1, 'Η περιγραφή SEO είναι υποχρεωτική'),
  slug: z.string().min(1, 'Το slug είναι υποχρεωτικό'),
  keywords: z.array(z.string())
}).optional();

export const productFormSchema = z.object({
  name: z.string().min(2, 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες'),
  description: z.string().min(10, 'Η περιγραφή πρέπει να έχει τουλάχιστον 10 χαρακτήρες'),
  price: z.number().min(0.01, 'Η τιμή πρέπει να είναι μεγαλύτερη από 0'),
  stock: z.number().int().min(0, 'Το απόθεμα δεν μπορεί να είναι αρνητικό'),
  category: z.nativeEnum(ProductCategory, {
    errorMap: () => ({ message: 'Παρακαλώ επιλέξτε κατηγορία' })
  }),
  unit: z.nativeEnum(ProductUnit, {
    errorMap: () => ({ message: 'Παρακαλώ επιλέξτε μονάδα μέτρησης' })
  }),
  status: z.nativeEnum(ProductStatus, {
    errorMap: () => ({ message: 'Παρακαλώ επιλέξτε κατάσταση' })
  }).default(ProductStatus.Active),
  producerId: z.string(),
  images: z.array(productImageSchema),
  seo: productSeoSchema,
  minimumOrder: z.number().int().min(0).nullable(),
  maximumOrder: z.number().int().min(0).nullable(),
  tags: z.array(z.string()),
  isPromoted: z.boolean(),
  promotionPrice: z.number().min(0).nullable(),
  promotionEndsAt: z.date().nullable(),
  featured: z.boolean()
}).refine(
  (data) => {
    if (data.maximumOrder === null || data.minimumOrder === null) return true;
    return data.maximumOrder >= data.minimumOrder;
  },
  {
    message: 'Η μέγιστη ποσότητα πρέπει να είναι μεγαλύτερη από την ελάχιστη',
    path: ['maximumOrder']
  }
).refine(
  (data) => {
    if (data.promotionPrice === null) return true;
    return data.promotionPrice < data.price;
  },
  {
    message: 'Η τιμή προσφοράς πρέπει να είναι μικρότερη από την κανονική τιμή',
    path: ['promotionPrice']
  }
); 