import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { Script } from '../../hooks/useScriptManager.js';

interface ScriptModeProps {
  scripts: Script[];
  selectedIndex: number;
  scriptOutput: string;
  isRunningScript: boolean;
}

const ScriptMode: React.FC<ScriptModeProps> = ({
  scripts,
  selectedIndex,
  scriptOutput,
  isRunningScript
}) => {
  return (
    <Box flexDirection="column" marginBottom={1} borderStyle="round" borderColor="cyan" padding={1}>
      <Box justifyContent="space-between">
        <Text bold color="cyan">Available Python Scripts:</Text>
        <Text>
          <Text backgroundColor="blue" color="white" bold> B </Text>
          <Text> Back to tasks</Text>
        </Text>
      </Box>
      
      {scripts.length === 0 ? (
        <Box marginTop={1}>
          <Text italic dimColor>No Python scripts found in the current directory.</Text>
        </Box>
      ) : (
        <Box marginTop={1} flexDirection="column">
          {scripts.map((script, i) => (
            <Box key={script.id}>
              <Text 
                color={selectedIndex === i ? 'cyan' : undefined}
                backgroundColor={selectedIndex === i ? 'blue' : undefined}
                bold={selectedIndex === i}
              >
                {selectedIndex === i ? '› ' : '  '}{script.name}
                {script.description && <Text dimColor> - {script.description}</Text>}
              </Text>
            </Box>
          ))}
        </Box>
      )}
      
      {isRunningScript && (
        <Box marginTop={1}>
          <Text color="yellow"><Spinner type="dots"/> Running script...</Text>
        </Box>
      )}
      
      {scriptOutput && (
        <Box marginTop={1} flexDirection="column" borderStyle="round" borderColor="gray" padding={1}>
          <Text bold>Script Output:</Text>
          <Text>{scriptOutput}</Text>
        </Box>
      )}
      
      <Box marginTop={1}>
        <Text dimColor>(Press Enter to run selected script, B or Escape to return to task list)</Text>
      </Box>
    </Box>
  );
};

export default ScriptMode; 