import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { BasePage } from '@/components/common/Layout/BasePage';

function ProducersPage() {
  return (
    <BasePage>
      <Box p={8}>
        <Heading mb={6}>Διαχείριση Παραγωγών</Heading>
        {/* TODO: Add producers management content */}
      </Box>
    </BasePage>
  );
}

export default ProducersPage; 