import React from 'react';
import { Box, Container } from '@chakra-ui/react';

interface BasePageProps {
  children: React.ReactNode;
}

export const BasePage: React.FC<BasePageProps> = ({ children }) => {
  return (
    <Box as="main" minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};

export default BasePage; 