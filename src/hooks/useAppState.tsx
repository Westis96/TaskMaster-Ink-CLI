import { useState } from 'react';

export type AppMode = 'list' | 'add' | 'priority' | 'date' | 'scripts';

export function useAppState() {
  const [mode, setMode] = useState<AppMode>('list');
  const [inputValue, setInputValue] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const setStatus = (message: string, duration: number = 2000) => {
    setStatusMessage(message);
    if (duration > 0) {
      setTimeout(() => setStatusMessage(''), duration);
    }
  };

  return {
    mode,
    setMode,
    inputValue,
    setInputValue,
    statusMessage,
    setStatus
  };
} 