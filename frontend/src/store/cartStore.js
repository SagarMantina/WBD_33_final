
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      setCart: (cart) => set({ cart }),
      clearCart: () => set({ cart: [] }),
      addToCart: (item) => {
        const exists = get().cart.some((i) => i=== item);
        if (!exists) {
          set({ cart: [...get().cart, item] });
        }
      },
      removeFromCart: (item) =>
        set({ cart: get().cart.filter((i) => i !== item) }),
      isInCart: (game_name) => get().cart.some((i) => i === game_name),
    }),
    {
      name: 'cart-storage', 
    }
  )
);
