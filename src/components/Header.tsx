import React from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';

const Header = () => {
  return (
    <Box flexDirection="column" alignItems="center" marginBottom={1}>
      <Box>
        <BigText text="TaskMaster" />
      </Box>
      <Box marginTop={-1}>
        <Text italic dimColor>Your tasks, beautifully organized</Text>
      </Box>
    </Box>
  );
};

export default Header;