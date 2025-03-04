import React from 'react';
import { Box, Text } from 'ink';
import figures from 'figures';

const Controls = () => {
  return (
    <Box borderStyle="round" borderColor="magenta" padding={1} flexDirection="column">
      <Text bold color="magenta">Keyboard Controls</Text>
      
      <Box marginTop={1} flexWrap="wrap">
        <Box marginRight={3} marginBottom={1}>
          <Text color="cyan">{figures.arrowUp}/{figures.arrowDown}</Text>
          <Text> Navigate</Text>
        </Box>
        
        <Box marginRight={3} marginBottom={1}>
          <Text color="cyan">Space</Text>
          <Text> Toggle</Text>
        </Box>
        
        <Box marginRight={3} marginBottom={1}>
          <Text color="cyan">p</Text>
          <Text> Priority mode</Text>
        </Box>
        
        <Box marginRight={3} marginBottom={1}>
          <Text color="cyan">1,2,3</Text>
          <Text> Set priority</Text>
        </Box>
        
        <Box marginRight={3} marginBottom={1}>
          <Text color="cyan">d</Text>
          <Text> Due date</Text>
        </Box>
        
        <Box marginRight={3} marginBottom={1}>
          <Text color="cyan">a</Text>
          <Text> Add task</Text>
        </Box>
        
        <Box marginRight={3} marginBottom={1}>
          <Text color="cyan">Enter/e</Text>
          <Text> Edit task</Text>
        </Box>
        
        <Box marginRight={3} marginBottom={1}>
          <Text color="cyan">s</Text>
          <Text> Scripts</Text>
        </Box>
        
        <Box marginRight={3} marginBottom={1}>
          <Text color="cyan">o</Text>
          <Text> Sort tasks</Text>
        </Box>
        
        <Box marginRight={3} marginBottom={1}>
          <Text color="cyan">Tab</Text>
          <Text> Reorder mode</Text>
        </Box>
        
        <Box marginRight={3} marginBottom={1}>
          <Text color="cyan">x</Text>
          <Text> Delete task</Text>
        </Box>
        
        <Box marginBottom={1}>
          <Text color="cyan">Esc</Text>
          <Text> Exit</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Controls;