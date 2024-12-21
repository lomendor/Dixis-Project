import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  VStack,
  FormErrorMessage,
  useToast,
  ModalFooter,
} from '@chakra-ui/react';
import { Product, ProductFormData, ProductCategory, ProductUnit, ProductStatus } from '@/types/product';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (data: ProductFormData) => Promise<void>;
}

const productFormSchema = z.object({
  name: z.string().min(1, 'Το όνομα είναι υποχρεωτικό'),
  description: z.string().min(1, 'Η περιγραφή είναι υποχρεωτική'),
  price: z.number().min(0, 'Η τιμή πρέπει να είναι θετική'),
  stock: z.number().int().min(0, 'Το απόθεμα πρέπει να είναι θετικό'),
  category: z.nativeEnum(ProductCategory),
  unit: z.nativeEnum(ProductUnit),
  status: z.nativeEnum(ProductStatus),
  producerId: z.string().optional(),
});

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      unit: product.unit,
      status: product.status,
      producerId: product.producerId,
    } : {
      status: ProductStatus.Active,
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Σφάλμα',
        description: 'Υπήρξε ένα πρόβλημα κατά την αποθήκευση του προϊόντος',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {product ? 'Επεξεργασία Προϊόντος' : 'Νέο Προϊόν'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Όνομα</FormLabel>
                <Input {...register('name')} />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Περιγραφή</FormLabel>
                <Textarea {...register('description')} />
                <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.category}>
                <FormLabel>Κατηγορία</FormLabel>
                <Select {...register('category')}>
                  {Object.values(ProductCategory).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.price}>
                <FormLabel>Τιμή</FormLabel>
                <NumberInput min={0} precision={2}>
                  <NumberInputField {...register('price', { valueAsNumber: true })} />
                </NumberInput>
                <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.stock}>
                <FormLabel>Απόθεμα</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField {...register('stock', { valueAsNumber: true })} />
                </NumberInput>
                <FormErrorMessage>{errors.stock?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.unit}>
                <FormLabel>Μονάδα Μέτρησης</FormLabel>
                <Select {...register('unit')}>
                  {Object.values(ProductUnit).map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.unit?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.status}>
                <FormLabel>Κατάσταση</FormLabel>
                <Select {...register('status')}>
                  {Object.values(ProductStatus).map((status) => (
                    <option key={status} value={status}>
                      {status === ProductStatus.Active ? 'Ενεργό' :
                       status === ProductStatus.Inactive ? 'Ανενεργό' :
                       'Εκτός Αποθέματος'}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose} variant="ghost" isDisabled={isSubmitting}>
              Ακύρωση
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
            >
              {product ? 'Ενημέρωση' : 'Δημιουργία'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}; 