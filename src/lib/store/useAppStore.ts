import { create } from 'zustand';

export type AppMode = 'list' | 'add' | 'priority' | 'date' | 'scripts' | 'sort' | 'deleteConfirm' | 'edit' | 'dnd';

interface AppState {
  mode: AppMode;
  inputValue: string;
  statusMessage: string;
  sortOptionIndex: number;
  dndOriginalTaskId?: string;
  setMode: (mode: AppMode) => void;
  setInputValue: (value: string) => void;
  setStatus: (message: string, duration?: number) => void;
  setSortOptionIndex: (index: number) => void;
  setDndOriginalTaskId: (id?: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'list',
  inputValue: '',
  statusMessage: '',
  sortOptionIndex: 0,
  dndOriginalTaskId: undefined,

  setMode: (mode) => set({ mode }),
  
  setInputValue: (inputValue) => set({ inputValue }),
  
  setStatus: (message, duration = 2000) => {
    set({ statusMessage: message });
    if (duration > 0) {
      setTimeout(() => set({ statusMessage: '' }), duration);
    }
  },

  setSortOptionIndex: (sortOptionIndex) => set({ sortOptionIndex }),
  
  setDndOriginalTaskId: (dndOriginalTaskId) => set({ dndOriginalTaskId })
})); 