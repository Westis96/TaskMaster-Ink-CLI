import React from 'react';
import { Box, Text } from 'ink';
import figures from 'figures';

interface SortOption {
  key: string;
  type: string;
  label: string;
  description: string;
}

interface SortModeProps {
  selectedIndex: number;
}

// These sort options must match the ones defined in App.tsx
const sortOptions: SortOption[] = [
  { key: 'p', type: 'priority', label: 'Priority', description: 'Sort by task priority (high to low)' },
  { key: 'a', type: 'alphabetical', label: 'Alphabetical', description: 'Sort tasks alphabetically (A to Z)' },
  { key: 'd', type: 'dueDate', label: 'Due Date', description: 'Sort by due date (earliest first)' },
  { key: 'c', type: 'createdAt', label: 'Created Date', description: 'Sort by creation date (newest first)' }
];

const SortMode: React.FC<SortModeProps> = ({ selectedIndex }) => {
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Choose a sorting method:</Text>
      
      {sortOptions.map((option, index) => (
        <Box key={option.key} marginY={1} flexDirection="row">
          <Text color={selectedIndex === index ? 'green' : undefined}>
            {selectedIndex === index ? figures.pointer + ' ' : '  '}
            <Text color="blue">[{option.key}]</Text>
            <Text bold={selectedIndex === index}> {option.label}</Text>
            <Text> - {option.description}</Text>
          </Text>
        </Box>
      ))}
      
      <Box marginTop={1}>
        <Text color="gray">Use ↑↓ arrows to navigate, Enter to select, or press ESC to cancel</Text>
      </Box>
    </Box>
  );
};

export default SortMode; 