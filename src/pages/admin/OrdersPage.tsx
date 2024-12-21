import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { BasePage } from '@/components/common/Layout/BasePage';

function OrdersPage() {
  return (
    <BasePage>
      <Box p={8}>
        <Heading mb={6}>Διαχείριση Παραγγελιών</Heading>
        {/* TODO: Add orders management content */}
      </Box>
    </BasePage>
  );
}

export default OrdersPage; 