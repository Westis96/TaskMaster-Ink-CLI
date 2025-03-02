import { create } from 'zustand';
import { nanoid } from 'nanoid';

export interface Script {
  id: string;
  name: string;
  path: string;
  description?: string;
}

interface ScriptState {
  scripts: Script[];
  selectedIndex: number;
  scriptOutput: string;
  isRunningScript: boolean;
  navigateUp: () => void;
  navigateDown: () => void;
  clearOutput: () => void;
  runSelectedScript: (onStatusChange: (message: string) => void) => void;
  setScripts: (scripts: Script[]) => void;
}

export const useScriptStore = create<ScriptState>((set, get) => ({
  scripts: [],
  selectedIndex: 0,
  scriptOutput: '',
  isRunningScript: false,

  navigateUp: () => set((state) => ({
    selectedIndex: Math.max(state.selectedIndex - 1, 0)
  })),

  navigateDown: () => set((state) => ({
    selectedIndex: Math.min(state.selectedIndex + 1, state.scripts.length - 1)
  })),

  clearOutput: () => set({ scriptOutput: '' }),

  runSelectedScript: (onStatusChange) => {
    const { scripts, selectedIndex } = get();
    if (scripts.length === 0) return;
    
    const selectedScript = scripts[selectedIndex];
    onStatusChange(`Running script: ${selectedScript.name}...`);
    set({ isRunningScript: true });
    
    // Use Node.js child_process to run the Python script
    import('child_process').then(({ exec }) => {
      exec(`python ${selectedScript.path}`, (error, stdout, stderr) => {
        set({ isRunningScript: false });
        
        if (error) {
          onStatusChange(`Error running script: ${error.message}`);
          set({ scriptOutput: stderr });
        } else {
          onStatusChange(`Script ${selectedScript.name} completed successfully!`);
          set({ scriptOutput: stdout });
        }
        
        // Clear status message after 3 seconds
        setTimeout(() => onStatusChange(''), 3000);
      });
    });
  },

  setScripts: (scripts) => set({ scripts })
})); 