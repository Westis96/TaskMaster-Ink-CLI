import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

interface StatusBarProps {
  tasks: Array<{
    completed: boolean;
    updated_at: Date;
    dueDate?: Date;
  }>;
  mode: string;
  statusMessage?: string;
}

const StatusBar = ({ tasks, mode, statusMessage }: StatusBarProps) => {
  // Calculate the start and end of today
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Set to beginning of tomorrow
  
  // Filter tasks to those due today or in the future (active tasks)
  const activeTasks = tasks.filter(task => {
    // Exclude tasks with no due date (consider them inactive)
    if (!task.dueDate) return false;
    
    // Include tasks due today or in the future
    return task.dueDate >= today;
  });
  
  const totalActiveTasks = activeTasks.length;
  const totalTasks = tasks.length;
  
  // Count active tasks that were completed today
  const dailyCompletedTasks = activeTasks.filter(task => {
    return task.completed && 
           task.updated_at >= today && 
           task.updated_at < tomorrow;
  }).length;
  
  // Count active tasks that are not completed (still pending)
  const pendingActiveTasks = activeTasks.filter(task => !task.completed).length;
  
  const progress = totalActiveTasks > 0 ? Math.round((dailyCompletedTasks / totalActiveTasks) * 100) : 0;
  
  const getProgressBar = () => {
    const width = 20;
    const filledCount = Math.round((progress / 100) * width);
    const emptyCount = width - filledCount;
    
    return (
      <Text>
        <Text color="green">{'█'.repeat(filledCount)}</Text>
        <Text color="gray">{'█'.repeat(emptyCount)}</Text>
      </Text>
    );
  };

  const getModeIndicator = () => {
    switch (mode) {
      case 'list':
        return <Text backgroundColor="blue" color="white" bold> TASK MODE </Text>;
      case 'scripts':
        return <Text backgroundColor="cyan" color="black" bold> SCRIPT MODE </Text>;
      case 'add':
        return <Text backgroundColor="green" color="white" bold> ADD MODE </Text>;
      case 'priority':
        return <Text backgroundColor="yellow" color="black" bold> PRIORITY MODE </Text>;
      case 'date':
        return <Text backgroundColor="magenta" color="white" bold> DATE MODE </Text>;
      default:
        return null;
    }
  };
  
  return (
    <Box borderStyle="single" borderColor="gray" padding={1} marginTop={1} flexDirection="column">
      <Box>
        <Box flexGrow={1}>
          <Box marginRight={2}>
            <Text>
              {mode === 'add' ? (
                <Text>
                  <Text color="green"><Spinner type="dots" /></Text>
                  <Text> Adding new task</Text>
                </Text>
              ) : mode === 'scripts' ? (
                <Text>
                  <Text color="cyan"><Spinner type="dots" /></Text>
                  <Text> Python Scripts</Text>
                </Text>
              ) : (
                <Text>
                  <Text>Daily tasks completed: </Text>
                  <Text color="cyan">{dailyCompletedTasks}/{totalActiveTasks}</Text>
                </Text>
              )}
            </Text>
          </Box>
          
          {mode !== 'scripts' && (
            <Box flexGrow={1}>
              {getProgressBar()}<Text> </Text><Text>{progress}%</Text>
            </Box>
          )}
        </Box>
        
        <Box>
          {getModeIndicator()}
        </Box>
      </Box>
      
      <Box marginTop={1} justifyContent="space-between">
        <Box>
          {statusMessage ? (
            <Text color="yellow" bold>{statusMessage}</Text>
          ) : (
            <Text color="yellow">✨ Waiting for input...</Text>
          )}
        </Box>
        <Box>
          <Text dimColor>{new Date().toLocaleTimeString()}</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default StatusBar;