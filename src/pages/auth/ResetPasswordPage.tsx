import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BaseAuthLayout } from '@/components/common/Layout/BaseAuthLayout';

const schema = z.object({
  password: z.string().min(6, 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Οι κωδικοί δεν ταιριάζουν",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof schema>;

const ResetPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const toast = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast({
        title: 'Σφάλμα',
        description: 'Μη έγκυρο token επαναφοράς κωδικού',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await resetPassword(token, data.password);
      toast({
        title: 'Επιτυχία',
        description: 'Ο κωδικός σας άλλαξε με επιτυχία',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Υπήρξε πρόβλημα κατά την αλλαγή του κωδικού',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!token) {
    return (
      <BaseAuthLayout>
        <Box textAlign="center" p={8}>
          <Heading size="lg" mb={4}>Μη έγκυρος σύνδεσμος</Heading>
          <Text>Ο σύνδεσμος επαναφοράς κωδικού δεν είναι έγκυρος ή έχει λήξει.</Text>
        </Box>
      </BaseAuthLayout>
    );
  }

  return (
    <BaseAuthLayout>
      <Box w="100%" maxW="400px" p={8}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading>Επαναφορά Κωδικού</Heading>
            <Text mt={2} color="gray.600">
              Εισάγετε τον νέο σας κωδικό
            </Text>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Νέος Κωδικός</FormLabel>
                <Input
                  type="password"
                  placeholder="******"
                  {...register('password')}
                />
                {errors.password && (
                  <Text color="red.500" fontSize="sm">
                    {errors.password.message}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Επιβεβαίωση Κωδικού</FormLabel>
                <Input
                  type="password"
                  placeholder="******"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <Text color="red.500" fontSize="sm">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                width="100%"
                isLoading={isSubmitting}
              >
                Αλλαγή Κωδικού
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </BaseAuthLayout>
  );
};

export default ResetPasswordPage; 