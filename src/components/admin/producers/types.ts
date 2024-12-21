export interface Producer {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'pending' | 'inactive';
  productsCount: number;
  rating: number;
  lastLogin: string;
  joinedAt: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
    expiryDate?: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    issuedDate: string;
    expiryDate: string;
    status: 'active' | 'expired' | 'revoked';
  }[];
} 