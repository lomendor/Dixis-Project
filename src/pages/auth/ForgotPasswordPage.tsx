import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
  Link,
  Heading,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BaseAuthLayout } from '@/components/common/Layout/BaseAuthLayout';

const schema = z.object({
  email: z.string().email('Μη έγκυρη διεύθυνση email'),
});

type ForgotPasswordFormData = z.infer<typeof schema>;

const ForgotPasswordPage: React.FC = () => {
  const { resetPasswordRequest } = useAuth();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await resetPasswordRequest(data.email);
      toast({
        title: 'Email εστάλη',
        description: 'Ελέγξτε το email σας για οδηγίες επαναφοράς του κωδικού σας',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Υπήρξε πρόβλημα κατά την αποστολή του email',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <BaseAuthLayout>
      <Box w="100%" maxW="400px" p={8}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading>Επαναφορά Κωδικού</Heading>
            <Text mt={2} color="gray.600">
              Εισάγετε το email σας για να λάβετε οδηγίες επαναφοράς
            </Text>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                />
                {errors.email && (
                  <Text color="red.500" fontSize="sm">
                    {errors.email.message}
                  </Text>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                width="100%"
                isLoading={isSubmitting}
              >
                Αποστολή Οδηγιών
              </Button>
            </VStack>
          </form>

          <Box textAlign="center">
            <Text>
              Θυμηθήκατε τον κωδικό σας;{' '}
              <Link color="green.500" href="/login">
                Συνδεθείτε εδώ
              </Link>
            </Text>
          </Box>
        </VStack>
      </Box>
    </BaseAuthLayout>
  );
};

export default ForgotPasswordPage; 