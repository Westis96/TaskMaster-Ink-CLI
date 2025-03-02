import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  created_at: Date;
  updated_at: Date;
}

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Add some sample tasks on first render
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const now = new Date();
    
    setTasks([
      { id: nanoid(), text: 'Learn Ink', completed: false, priority: 'high', dueDate: today, created_at: now, updated_at: now },
      { id: nanoid(), text: 'Build a CLI app', completed: true, priority: 'medium', dueDate: yesterday, created_at: now, updated_at: now },
      { id: nanoid(), text: 'Share with friends', completed: false, priority: 'low', dueDate: tomorrow, created_at: now, updated_at: now },
      { id: nanoid(), text: 'Add more features', completed: false, priority: 'medium', dueDate: nextWeek, created_at: now, updated_at: now },
      { id: nanoid(), text: 'Write documentation', completed: false, priority: 'high', created_at: now, updated_at: now }
    ]);
  }, []);

  // Navigate up
  const navigateUp = () => {
    setSelectedIndex(prev => Math.max(prev - 1, 0));
  };

  // Navigate down
  const navigateDown = () => {
    setSelectedIndex(prev => Math.min(prev + 1, tasks.length - 1));
  };

  // Toggle task completion
  const toggleTask = () => {
    if (tasks.length === 0) return false;
    
    setTasks(prev => 
      prev.map((task, i) => 
        i === selectedIndex ? { ...task, completed: !task.completed, updated_at: new Date() } : task
      )
    );
    
    return !tasks[selectedIndex].completed;
  };

  // Delete task
  const deleteTask = () => {
    if (tasks.length === 0) return;
    
    setTasks(prev => prev.filter((_, i) => i !== selectedIndex));
    setSelectedIndex(prev => Math.min(prev, tasks.length - 2));
  };

  // Add new task
  const addTask = (text: string) => {
    if (text.trim() === '') return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const now = new Date();
    
    setTasks(prev => [
      ...prev,
      {
        id: nanoid(),
        text,
        completed: false,
        priority: 'medium',
        dueDate: today, // Default due date is today
        created_at: now,
        updated_at: now
      }
    ]);
  };

  // Set task priority
  const setTaskPriority = (priority: 'low' | 'medium' | 'high') => {
    if (tasks.length === 0) return;
    
    setTasks(prev => 
      prev.map((task, i) => 
        i === selectedIndex ? { ...task, priority, updated_at: new Date() } : task
      )
    );
  };

  // Set task due date
  const setTaskDueDate = (dateStr: string) => {
    if (tasks.length === 0) return;
    
    let dueDate: Date | undefined;
    
    // Try to interpret common terms
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (dateStr.toLowerCase()) {
      case 'today':
        dueDate = today;
        break;
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        dueDate = tomorrow;
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        dueDate = yesterday;
        break;
      case 'next week':
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        dueDate = nextWeek;
        break;
      default:
        // Try to parse as date
        try {
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            dueDate = parsedDate;
          }
        } catch (e) {
          // Invalid date, leave dueDate as undefined
        }
    }
    
    setTasks(prev => 
      prev.map((task, i) => 
        i === selectedIndex ? { ...task, dueDate, updated_at: new Date() } : task
      )
    );
  };

  return {
    tasks,
    selectedIndex,
    navigateUp,
    navigateDown,
    toggleTask,
    deleteTask,
    addTask,
    setTaskPriority,
    setTaskDueDate
  };
} 