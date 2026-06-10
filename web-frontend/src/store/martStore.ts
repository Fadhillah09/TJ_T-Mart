import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Mart } from '@/types';

interface MartState {
  activeMart: Mart | null;
  setActiveMart: (mart: Mart | null) => void;
}

export const useMartStore = create<MartState>()(
  persist(
    (set) => ({
      activeMart: null,
      setActiveMart: (mart) => set({ activeMart: mart }),
    }),
    {
      name: 'mart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
