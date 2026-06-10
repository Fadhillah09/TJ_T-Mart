import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistState {
  wishlistedIds: number[];
  toggleWishlist: (id: number) => void;
  setWishlistedIds: (ids: number[]) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      wishlistedIds: [],
      toggleWishlist: (id) =>
        set((state) => {
          const isExist = state.wishlistedIds.includes(id);
          const next = isExist
            ? state.wishlistedIds.filter((x) => x !== id)
            : [...state.wishlistedIds, id];
          return { wishlistedIds: next };
        }),
      setWishlistedIds: (ids) => set({ wishlistedIds: ids }),
      clearWishlist: () => set({ wishlistedIds: [] }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
