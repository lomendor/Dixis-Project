export interface Producer {
  _id: string;
  name: string;
  description?: string;
  email: string;
  phone: string;
  location?: string;
  address?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
  };
  status: 'active' | 'inactive';
  productsCount: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewProducer {
  name: string;
  email: string;
  phone: string;
  description?: string;
  location?: string;
  address?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
  };
  status?: 'active' | 'inactive';
} 