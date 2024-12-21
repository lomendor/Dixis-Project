import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  producerId: string;
  producerName: string;
}

export interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        const updatedItems = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        return {
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + item.price,
        };
      }
      return {
        items: [...state.items, { ...item, quantity: 1 }],
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + item.price,
      };
    });
  },
  removeItem: (id) => {
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;
      return {
        items: state.items.filter((i) => i.id !== id),
        totalItems: state.totalItems - item.quantity,
        totalPrice: state.totalPrice - (item.price * item.quantity),
      };
    });
  },
  updateQuantity: (id, quantity) => {
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;
      const quantityDiff = quantity - item.quantity;
      const updatedItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      );
      return {
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalPrice: state.totalPrice + (item.price * quantityDiff),
      };
    });
  },
  clearCart: () => {
    set({ items: [], totalItems: 0, totalPrice: 0 });
  },
})); 