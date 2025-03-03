import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the absolute path to the repository root directory
const getRepoRoot = () => {
  // For ESM modules, we need to use this approach to get __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // Navigate up from src/lib/store to the repo root
  return join(__dirname, '..', '..', '..');
};

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  created_at: Date; // Changed from timestamp to Date
  updated_at: Date; // Changed from timestamp to Date
}

export type SortType = 'priority' | 'alphabetical' | 'dueDate' | 'createdAt';

interface TaskState {
  tasks: Task[];
  selectedIndex: number;
  navigateUp: () => void;
  navigateDown: () => void;
  toggleTask: () => boolean;
  deleteTask: () => void;
  addTask: (text: string) => void;
  editTask: (text: string) => void;
  setTaskPriority: (priority: 'low' | 'medium' | 'high') => void;
  setTaskDueDate: (dateStr: string) => void;
  sortByPriority: () => void;
  sortAlphabetically: () => void;
  sortByDueDate: () => void;
  sortByCreatedAt: () => void;
  sortTasks: (sortType: SortType) => void;
}

// Create file-based storage for Node.js environment
const nodeStorage = {
  getItem: (name: string): string | null => {
    try {
      const storagePath = join(getRepoRoot(), 'db', `${name}.json`);
      
      if (existsSync(storagePath)) {
        return readFileSync(storagePath, 'utf8');
      }
      return null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      const storagePath = join(getRepoRoot(), 'db', `${name}.json`);
      // Ensure the db directory exists
      const dbDir = join(getRepoRoot(), 'db');
      if (!existsSync(dbDir)) {
        mkdirSync(dbDir, { recursive: true });
      }
      writeFileSync(storagePath, value);
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  },
  removeItem: (name: string): void => {
    // Not implemented as we don't need it for this case
    console.log(`Would remove ${name} if needed`);
  }
};

// Map of month names to numeric values for date sorting
const monthToValue: Record<string, number> = {
  'January': 1, 'February': 2, 'March': 3, 'April': 4, 
  'May': 5, 'June': 6, 'July': 7, 'August': 8, 
  'September': 9, 'October': 10, 'November': 11, 'December': 12,
  'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'Jun': 6,
  'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
};

// Helper function to get date from common string terms
const getDateFromTerm = (term: string): Date | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (term.toLowerCase()) {
    case 'today':
      return today;
    case 'tomorrow':
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow;
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return yesterday;
    case 'next week':
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return nextWeek;
    case 'next month':
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      return nextMonth;
    case 'next year':
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);
      return nextYear;
    default:
      return null;
  }
};

// Function to convert dates from strings when loading from storage
const parseDatesInTask = (task: any): Task => {
  return {
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    created_at: task.created_at ? new Date(task.created_at) : new Date(),
    updated_at: task.updated_at ? new Date(task.updated_at) : new Date()
  };
};

// Function to assign timestamp to tasks that don't have them
const ensureTimestamps = (tasks: Task[]): Task[] => {
  const now = Date.now();
  return tasks.map(task => ({
    ...task,
    created_at: task.created_at || new Date(now),
    updated_at: task.updated_at || new Date(now)
  }));
};

// Default tasks to use when no saved state exists
const now = Date.now();
const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

const defaultTasks: Task[] = [
  { id: nanoid(), text: 'Learn Ink', completed: false, priority: 'high' as const, dueDate: today, created_at: new Date(now), updated_at: new Date(now) },
  { id: nanoid(), text: 'Build a CLI app', completed: true, priority: 'medium' as const, dueDate: yesterday, created_at: new Date(now - 86400000), updated_at: new Date(now - 3600000) },
  { id: nanoid(), text: 'Share with friends', completed: false, priority: 'low' as const, dueDate: tomorrow, created_at: new Date(now - 172800000), updated_at: new Date(now - 7200000) },
  { id: nanoid(), text: 'Add more features', completed: false, priority: 'medium' as const, dueDate: nextWeek, created_at: new Date(now - 259200000), updated_at: new Date(now - 10800000) },
  { id: nanoid(), text: 'Write documentation', completed: false, priority: 'high' as const, created_at: new Date(now - 345600000), updated_at: new Date(now - 14400000) }
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: defaultTasks,
      selectedIndex: 0,

      navigateUp: () => set((state) => ({
        selectedIndex: Math.max(state.selectedIndex - 1, 0)
      })),

      navigateDown: () => set((state) => ({
        selectedIndex: Math.min(state.selectedIndex + 1, state.tasks.length - 1)
      })),

      toggleTask: () => {
        const { tasks, selectedIndex } = get();
        if (tasks.length === 0) return false;

        const updatedTasks = [...tasks];
        updatedTasks[selectedIndex] = {
          ...updatedTasks[selectedIndex],
          completed: !updatedTasks[selectedIndex].completed,
          updated_at: new Date()
        };
        
        set({ tasks: updatedTasks });
        return updatedTasks[selectedIndex].completed;
      },

      deleteTask: () => {
        const { tasks, selectedIndex } = get();
        if (tasks.length === 0) return;

        set({
          tasks: tasks.filter((_, i) => i !== selectedIndex),
          selectedIndex: Math.min(selectedIndex, tasks.length - 2)
        });
      },

      addTask: (text) => {
        if (text.trim() === '') return;
        
        const now = Date.now();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: nanoid(),
              text,
              completed: false,
              priority: 'medium' as const,
              dueDate: today, // Default due date is today
              created_at: new Date(now),
              updated_at: new Date(now)
            }
          ]
        }));
      },

      editTask: (text) => {
        const { tasks, selectedIndex } = get();
        if (tasks.length === 0 || selectedIndex < 0 || selectedIndex >= tasks.length) return;

        const updatedTasks = [...tasks];
        updatedTasks[selectedIndex] = {
          ...updatedTasks[selectedIndex],
          text,
          updated_at: new Date()
        };
        
        set({ tasks: updatedTasks });
      },

      setTaskPriority: (priority) => {
        const { tasks, selectedIndex } = get();
        if (tasks.length === 0) return;

        const updatedTasks = tasks.map((task, i) =>
          i === selectedIndex ? { 
            ...task, 
            priority,
            updated_at: new Date() 
          } : task
        );
        
        set({ tasks: updatedTasks });
      },

      setTaskDueDate: (dateStr) => {
        const { tasks, selectedIndex } = get();
        if (tasks.length === 0) return;

        let dueDate: Date | undefined;

        // Try to parse the date string
        const termDate = getDateFromTerm(dateStr);
        if (termDate) {
          dueDate = termDate;
        } else {
          try {
            const parsedDate = new Date(dateStr);
            if (!isNaN(parsedDate.getTime())) {
              dueDate = parsedDate;
            }
          } catch (e) {
            // If parsing fails, leave as undefined
          }
        }

        const updatedTasks = [...tasks];
        updatedTasks[selectedIndex] = {
          ...updatedTasks[selectedIndex],
          dueDate,
          updated_at: new Date()
        };
        
        set({ tasks: updatedTasks });
      },

      sortByPriority: () => {
        const { tasks } = get();
        if (tasks.length <= 1) return;

        // Ensure all tasks have timestamps
        const tasksWithTimestamps = ensureTimestamps(tasks);

        // Helper function to convert priority to numeric value for sorting
        const getPriorityValue = (priority?: 'low' | 'medium' | 'high'): number => {
          switch (priority) {
            case 'high': return 3;
            case 'medium': return 2;
            case 'low': return 1;
            default: return 0;
          }
        };

        const sortedTasks = [...tasksWithTimestamps].sort((a, b) => {
          // Sort by priority (high to low)
          return getPriorityValue(b.priority) - getPriorityValue(a.priority);
        });

        set({ tasks: sortedTasks });
      },

      sortAlphabetically: () => {
        const { tasks } = get();
        if (tasks.length <= 1) return;

        // Ensure all tasks have timestamps
        const tasksWithTimestamps = ensureTimestamps(tasks);

        const sortedTasks = [...tasksWithTimestamps].sort((a, b) => {
          // Sort alphabetically by task text
          return a.text.localeCompare(b.text);
        });

        set({ tasks: sortedTasks });
      },

      sortByDueDate: () => {
        const { tasks } = get();
        if (tasks.length <= 1) return;

        // Ensure all tasks have timestamps
        const tasksWithTimestamps = ensureTimestamps(tasks);

        const sortedTasks = [...tasksWithTimestamps].sort((a, b) => {
          // Sort by due date (earliest first)
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1; // Tasks without due dates go last
          if (!b.dueDate) return -1;
          
          return a.dueDate.getTime() - b.dueDate.getTime();
        });

        set({ tasks: sortedTasks });
      },

      sortByCreatedAt: () => {
        const { tasks } = get();
        if (tasks.length <= 1) return;

        // Ensure all tasks have timestamps
        const tasksWithTimestamps = ensureTimestamps(tasks);

        const sortedTasks = [...tasksWithTimestamps].sort((a, b) => {
          // Sort by created_at date (newest first)
          return b.created_at.getTime() - a.created_at.getTime();
        });

        set({ tasks: sortedTasks });
      },

      sortTasks: (sortType) => {
        switch (sortType) {
          case 'priority':
            get().sortByPriority();
            break;
          case 'alphabetical':
            get().sortAlphabetically();
            break;
          case 'dueDate':
            get().sortByDueDate();
            break;
          case 'createdAt':
            get().sortByCreatedAt();
            break;
        }
      }
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => nodeStorage),
      partialize: (state) => ({ tasks: state.tasks }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Parse dates when loading from storage
          state.tasks = state.tasks.map(parseDatesInTask);
        }
      }
    }
  )
); 