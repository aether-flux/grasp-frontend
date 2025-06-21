import { create } from 'zustand';

export const useSyllabusStore = create((set) => ({
  elaboratedText: '',
  setElaboratedText: (text) => set({ elaboratedText: text }),
  reset: () => set({ elaboratedText: '' }),
}));

