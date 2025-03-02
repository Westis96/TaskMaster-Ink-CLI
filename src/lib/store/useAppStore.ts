import { create } from 'zustand';

export type AppMode = 'list' | 'add' | 'priority' | 'date' | 'scripts' | 'sort' | 'deleteConfirm' | 'edit';

interface AppState {
  mode: AppMode;
  inputValue: string;
  statusMessage: string;
  sortOptionIndex: number;
  setMode: (mode: AppMode) => void;
  setInputValue: (value: string) => void;
  setStatus: (message: string, duration?: number) => void;
  setSortOptionIndex: (index: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'list',
  inputValue: '',
  statusMessage: '',
  sortOptionIndex: 0,

  setMode: (mode) => set({ mode }),
  
  setInputValue: (inputValue) => set({ inputValue }),
  
  setStatus: (message, duration = 2000) => {
    set({ statusMessage: message });
    if (duration > 0) {
      setTimeout(() => set({ statusMessage: '' }), duration);
    }
  },

  setSortOptionIndex: (sortOptionIndex) => set({ sortOptionIndex })
})); 