import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface EditTaskModeProps {
  taskText: string;
  inputValue: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

const EditTaskMode: React.FC<EditTaskModeProps> = ({
  taskText,
  inputValue,
  onChange,
  onSubmit
}) => {
  return (
    <Box flexDirection="column" marginBottom={1} borderStyle="round" borderColor="yellow" padding={1}>
      <Text bold color="yellow">Edit task:</Text>
      <Box marginTop={1}>
        <Text dimColor>Original: </Text>
        <Text>{taskText}</Text>
      </Box>
      <Box marginTop={1}>
        <Text>› </Text>
        <Box>
          <TextInput
            value={inputValue}
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder="Enter new task description and press Enter"
          />
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>(Press Enter to save, Escape to cancel)</Text>
      </Box>
    </Box>
  );
};

export default EditTaskMode; 