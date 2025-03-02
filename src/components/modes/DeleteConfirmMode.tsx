import React from 'react';
import { Box, Text } from 'ink';
import { Task } from '../../lib/store/useTaskStore.js';

interface DeleteConfirmModeProps {
  task: Task;
}

const DeleteConfirmMode: React.FC<DeleteConfirmModeProps> = ({ task }) => {
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="red">
          Are you sure you want to delete this task?
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text>"</Text>
        <Text bold>{task.text}</Text>
        <Text>"</Text>
      </Box>
      <Box marginTop={1}>
        <Text>Press </Text>
        <Text color="green" bold>y</Text>
        <Text> to confirm, or </Text>
        <Text color="red" bold>n</Text>
        <Text> to cancel.</Text>
      </Box>
    </Box>
  );
};

export default DeleteConfirmMode; 