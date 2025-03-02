import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface AddTaskModeProps {
  inputValue: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

const AddTaskMode: React.FC<AddTaskModeProps> = ({
  inputValue,
  onChange,
  onSubmit
}) => {
  return (
    <Box flexDirection="column" marginBottom={1} borderStyle="round" borderColor="green" padding={1}>
      <Text bold color="green">Add a new task:</Text>
      <Box marginTop={1}>
        <Text>› </Text>
        <Box>
          <TextInput
            value={inputValue}
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder="Enter task description and press Enter"
          />
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>(Press Enter to submit, Escape to cancel)</Text>
      </Box>
    </Box>
  );
};

export default AddTaskMode; 