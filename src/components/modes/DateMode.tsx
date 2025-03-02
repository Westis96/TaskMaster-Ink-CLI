import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface DateModeProps {
  inputValue: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

const DateMode: React.FC<DateModeProps> = ({
  inputValue,
  onChange,
  onSubmit
}) => {
  return (
    <Box flexDirection="column" marginBottom={1} borderStyle="round" borderColor="magenta" padding={1}>
      <Text bold color="magenta">Set due date for selected task:</Text>
      <Box marginTop={1}>
        <Text>› </Text>
        <Box>
          <TextInput
            value={inputValue}
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder="Enter due date (e.g., Tomorrow, Next week)"
          />
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>(Press Enter to submit, Escape to cancel)</Text>
      </Box>
    </Box>
  );
};

export default DateMode; 