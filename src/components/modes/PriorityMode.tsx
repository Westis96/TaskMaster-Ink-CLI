import React from 'react';
import { Box, Text } from 'ink';

const PriorityMode: React.FC = () => {
  return (
    <Box flexDirection="column" marginBottom={1} borderStyle="round" borderColor="blue" padding={1}>
      <Text bold color="blue">Set priority for selected task:</Text>
      <Box marginTop={1} flexDirection="column">
        <Text>Press <Text color="blue" bold>1</Text> or <Text color="blue" bold>l</Text> for <Text color="blue">Low</Text> priority</Text>
        <Text>Press <Text color="yellow" bold>2</Text> or <Text color="yellow" bold>m</Text> for <Text color="yellow">Medium</Text> priority</Text>
        <Text>Press <Text color="red" bold>3</Text> or <Text color="red" bold>h</Text> for <Text color="red">High</Text> priority</Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>(Press Escape to cancel)</Text>
      </Box>
    </Box>
  );
};

export default PriorityMode; 