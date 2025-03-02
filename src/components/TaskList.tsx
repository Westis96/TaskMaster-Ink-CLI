import React from 'react';
import { Box, Text } from 'ink';
import figures from 'figures';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

interface TaskListProps {
  tasks: Task[];
  selectedIndex: number;
}

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'high':
      return 'red';
    case 'medium':
      return 'yellow';
    case 'low':
      return 'blue';
    default:
      return undefined;
  }
};

const getPrioritySymbol = (priority?: string) => {
  switch (priority) {
    case 'high':
      return figures.arrowUp;
    case 'medium':
      return figures.arrowRight;
    case 'low':
      return figures.arrowDown;
    default:
      return ' ';
  }
};

const VISIBLE_TASKS = 9; // Number of tasks visible at once

// Format date in a human-readable way
const formatDate = (date?: Date): string => {
  if (!date) return '-';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  // Check for special dates
  if (date.getTime() === today.getTime()) {
    return 'Today';
  } else if (date.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else if (date.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }
  
  // Otherwise format as MM/DD
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const TaskList = ({ tasks, selectedIndex }: TaskListProps) => {
  // Calculate which tasks to show based on selectedIndex
  const calculateVisibleRange = () => {
    if (tasks.length <= VISIBLE_TASKS) {
      return [0, tasks.length - 1];
    }

    // Start position should keep the selected task in view
    let start = selectedIndex - Math.floor(VISIBLE_TASKS / 2);
    
    // Ensure start is not negative
    start = Math.max(0, start);
    
    // Ensure we don't try to show past the end of the list
    if (start + VISIBLE_TASKS > tasks.length) {
      start = tasks.length - VISIBLE_TASKS;
    }
    
    return [start, start + VISIBLE_TASKS - 1];
  };
  
  const [startIdx, endIdx] = calculateVisibleRange();
  const visibleTasks = tasks.slice(startIdx, endIdx + 1);
  
  // Determine if scrolling indicators should be shown
  const showUpIndicator = startIdx > 0;
  const showDownIndicator = endIdx < tasks.length - 1;
  
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      {tasks.length === 0 ? (
        <Text italic dimColor>No tasks yet. Press 'a' to add a task.</Text>
      ) : (
        <>
          <Box marginBottom={1}>
            <Box width={3}><Text bold>P</Text></Box>
            <Box width={4}><Text bold>S</Text></Box>
            <Box flexGrow={1}><Text bold>Task</Text></Box>
            <Box width={10}><Text bold>Due Date</Text></Box>
          </Box>
          
          {/* Scroll indicators */}
          <Box height={1} justifyContent="center">
            {showUpIndicator ? (
              <Text color="cyan">{figures.arrowUp} {startIdx} more above</Text>
            ) : (
              <Text> </Text>
            )}
          </Box>
          
          {/* Fixed height task container */}
          <Box flexDirection="column" height={Math.min(VISIBLE_TASKS, tasks.length)}>
            {visibleTasks.map((task, i) => {
              const actualIndex = startIdx + i;
              return (
                <Box key={task.id} marginY={0.2}>
                  <Box width={3}>
                    <Text color={getPriorityColor(task.priority)}>
                      {getPrioritySymbol(task.priority)}
                    </Text>
                  </Box>
                  <Box width={4}>
                    <Text color={task.completed ? 'green' : 'yellow'}>
                      {task.completed ? figures.circleFilled : figures.circle}
                    </Text>
                  </Box>
                  <Box flexGrow={1}>
                    <Text 
                      color={selectedIndex === actualIndex ? 'cyan' : undefined}
                      backgroundColor={selectedIndex === actualIndex ? 'blue' : undefined}
                      bold={selectedIndex === actualIndex}
                      strikethrough={task.completed}
                      dimColor={task.completed && selectedIndex !== actualIndex}
                    >
                      {selectedIndex === actualIndex ? figures.pointer : ' '} {task.text}
                    </Text>
                  </Box>
                  <Box width={10}>
                    <Text dimColor={task.completed}>
                      {formatDate(task.dueDate)}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
          
          {/* Bottom scroll indicator */}
          <Box height={1} justifyContent="center">
            {showDownIndicator ? (
              <Text color="cyan">{figures.arrowDown} {tasks.length - endIdx - 1} more below</Text>
            ) : (
              <Text> </Text>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default TaskList;