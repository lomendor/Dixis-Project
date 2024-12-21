import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import type { RegisterData } from '@/features/auth/types/user';
import { BaseAuthLayout } from '@/components/common/Layout/BaseAuthLayout';

const schema = z.object({
  name: z.string().min(2, 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες'),
  email: z.string().email('Μη έγκυρη διεύθυνση email'),
  password: z.string().min(6, 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Οι κωδικοί δεν ταιριάζουν",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      toast({
        title: 'Επιτυχής εγγραφή',
        description: 'Ο λογαριασμός σας δημιουργήθηκε με επιτυχία',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Υπήρξε πρόβλημα κατά την εγγραφή',
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
            <Heading>Εγγραφή</Heading>
            <Text mt={2} color="gray.600">
              Δημιουργήστε το λογαριασμό σας
            </Text>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Όνομα</FormLabel>
                <Input
                  type="text"
                  placeholder="Το όνομά σας"
                  {...register('name')}
                />
                {errors.name && (
                  <Text color="red.500" fontSize="sm">
                    {errors.name.message}
                  </Text>
                )}
              </FormControl>

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

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Κωδικός</FormLabel>
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
                Εγγραφή
              </Button>
            </VStack>
          </form>

          <Box textAlign="center">
            <Text>
              Έχετε ήδη λογαριασμό;{' '}
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

export default RegisterPage; 