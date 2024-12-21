import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { BasePage } from '@/components/common/Layout/BasePage';

function UsersPage() {
  return (
    <BasePage>
      <Box p={8}>
        <Heading mb={6}>Διαχείριση Χρηστών</Heading>
        {/* TODO: Add users management content */}
      </Box>
    </BasePage>
  );
}

export default UsersPage; 