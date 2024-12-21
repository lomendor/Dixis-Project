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
  Switch,
  HStack,
  Box,
} from '@chakra-ui/react';
import { Product, ProductFormData, ProductCategory, ProductUnit, ProductStatus } from '@/types/models/product.types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productFormSchema } from '@/features/products/schemas/product.schema';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (data: ProductFormData) => Promise<void>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const toast = useToast();
  const defaultValues = React.useMemo<ProductFormData>(() => {
    if (product) {
      return {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        unit: product.unit,
        status: product.status,
        producerId: product.producerId?.toString() || '',
        minimumOrder: product.minimumOrder || null,
        maximumOrder: product.maximumOrder || null,
        isPromoted: product.isPromoted || false,
        promotionPrice: product.promotionPrice || null,
        promotionEndsAt: product.promotionEndsAt ? new Date(product.promotionEndsAt) : null,
        featured: product.featured || false,
        tags: product.tags || [],
        seo: product.seo || null,
        images: product.images || [],
      };
    }
    return {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: ProductCategory.Vegetables,
      unit: ProductUnit.Piece,
      status: ProductStatus.Active,
      producerId: '',
      minimumOrder: null,
      maximumOrder: null,
      isPromoted: false,
      promotionPrice: null,
      promotionEndsAt: null,
      featured: false,
      tags: [],
      images: [],
      seo: null,
    };
  }, [product]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const isPromoted = watch('isPromoted');

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
                       status === ProductStatus.Draft ? 'Πρόχειρο' :
                       'Εκτός Αποθέματος'}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.minimumOrder}>
                <FormLabel>Ελάχιστη Ποσότητα Παραγγελίας</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField {...register('minimumOrder', { valueAsNumber: true })} />
                </NumberInput>
                <FormErrorMessage>{errors.minimumOrder?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.maximumOrder}>
                <FormLabel>Μέγιστη Ποσότητα Παραγγελίας</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField {...register('maximumOrder', { valueAsNumber: true })} />
                </NumberInput>
                <FormErrorMessage>{errors.maximumOrder?.message}</FormErrorMessage>
              </FormControl>

              <HStack width="100%" justify="space-between">
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Προωθούμενο</FormLabel>
                  <Switch {...register('isPromoted')} />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Προτεινόμενο</FormLabel>
                  <Switch {...register('featured')} />
                </FormControl>
              </HStack>

              {isPromoted && (
                <Box width="100%">
                  <FormControl isInvalid={!!errors.promotionPrice} mb={4}>
                    <FormLabel>Τιμή Προσφοράς</FormLabel>
                    <NumberInput min={0} precision={2}>
                      <NumberInputField {...register('promotionPrice', { valueAsNumber: true })} />
                    </NumberInput>
                    <FormErrorMessage>{errors.promotionPrice?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.promotionEndsAt}>
                    <FormLabel>Λήξη Προσφοράς</FormLabel>
                    <Input
                      type="datetime-local"
                      {...register('promotionEndsAt', {
                        setValueAs: (v) => v ? new Date(v) : undefined
                      })}
                    />
                    <FormErrorMessage>{errors.promotionEndsAt?.message}</FormErrorMessage>
                  </FormControl>
                </Box>
              )}
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