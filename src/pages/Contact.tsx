import React from 'react';
import { Box, Container, Heading, Text, VStack, FormControl, FormLabel, Input, Textarea, Button } from '@chakra-ui/react';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            Επικοινωνήστε μαζί μας
          </Heading>
          <Text color="gray.600">
            Είμαστε εδώ για να σας βοηθήσουμε. Στείλτε μας το μήνυμά σας και θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Όνομα</FormLabel>
              <Input type="text" placeholder="Το όνομά σας" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Το email σας" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Θέμα</FormLabel>
              <Input type="text" placeholder="Το θέμα του μηνύματός σας" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Μήνυμα</FormLabel>
              <Textarea
                placeholder="Το μήνυμά σας"
                rows={6}
                resize="vertical"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="green"
              size="lg"
              width="full"
            >
              Αποστολή Μηνύματος
            </Button>
          </VStack>
        </Box>

        <Box mt={8}>
          <VStack spacing={4} align="stretch">
            <Heading as="h2" size="md">
              Άλλοι τρόποι επικοινωνίας
            </Heading>
            <Text>
              <strong>Email:</strong> info@dixis.com
            </Text>
            <Text>
              <strong>Τηλέφωνο:</strong> +30 210 1234567
            </Text>
            <Text>
              <strong>Διεύθυνση:</strong> Λεωφόρος Παραδείγματος 123, Αθήνα
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
} 