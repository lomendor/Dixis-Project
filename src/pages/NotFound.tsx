import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} textAlign="center">
        <Heading as="h1" size="4xl" color="gray.400">
          404
        </Heading>
        
        <Heading as="h2" size="xl">
          Η σελίδα δε βρέθηκε
        </Heading>
        
        <Text color="gray.600" fontSize="lg">
          Η σελίδα που αναζητάτε δεν υπάρχει ή έχει μετακινηθεί.
        </Text>

        <Box>
          <Button
            as={Link}
            to="/"
            colorScheme="green"
            size="lg"
          >
            Επιστροφή στην αρχική
          </Button>
        </Box>
      </VStack>
    </Container>
  );
} 