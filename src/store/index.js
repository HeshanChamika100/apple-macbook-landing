import { create } from "zustand";

const useMacbookStore = create((set) => ({
  color: '#6b6b6b',
  setColor: (color) => set({ color }),

  scale: 0.08,
  setScale: (scale) => set({ scale }),

  reset: () => set({ color: '#6b6b6b', scale: 0.08 }),
}));

export default useMacbookStore;