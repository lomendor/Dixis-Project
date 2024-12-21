import React, { ReactNode } from 'react';
import {
  Box,
  Container,
  Flex,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';

interface BaseAuthLayoutProps {
  children: ReactNode;
  maxW?: string;
}

export const BaseAuthLayout: React.FC<BaseAuthLayoutProps> = ({
  children,
  maxW = 'md'
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Flex minH="100vh" bg={bgColor} py={12} px={4}>
      <Container maxW={maxW}>
        <Box mb={8} textAlign="center">
          <Image
            src="/logo.png"
            alt="Dixis Logo"
            mx="auto"
            h="60px"
            fallbackSrc="https://via.placeholder.com/150x60?text=Dixis"
          />
        </Box>
        
        <Box
          bg={cardBgColor}
          py={8}
          px={{ base: 4, md: 10 }}
          shadow="base"
          rounded="lg"
        >
          {children}
        </Box>
      </Container>
    </Flex>
  );
}; 