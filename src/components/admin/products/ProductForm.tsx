import { useState, useEffect, forwardRef } from 'react';
import {
  Box,
  Input,
  Textarea,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputProps,
} from '@chakra-ui/number-input';
import {
  Select,
  SelectProps,
} from '@chakra-ui/select';
import { Form } from '../common';
import { useProducers } from '../../../hooks/useProducers';
import { FileUpload } from '../common';
import type { Product, ProductFormData } from '../../../types/product';
import { ProductCategory, ProductUnit, ProductStatus } from '../../../types/product';
import api from '../../../lib/api';

interface CustomNumberInputProps extends Omit<NumberInputProps, 'children'> {
  min?: number;
  max?: number;
  precision?: number;
  step?: number;
}

const CustomNumberInput = forwardRef<HTMLInputElement, CustomNumberInputProps>((props: CustomNumberInputProps, ref) => {
  return (
    <NumberInput ref={ref} {...props}>
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
});

const CustomSelect = forwardRef<HTMLSelectElement, SelectProps>((props: SelectProps, ref) => {
  return (
    <Select ref={ref} {...props} />
  );
});

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSubmit: (values: ProductFormData) => Promise<void>;
}

export default function ProductForm({ product, onClose, onSubmit }: ProductFormProps) {
  const [fileList, setFileList] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { producers } = useProducers();

  useEffect(() => {
    if (product) {
      // Θα χρειαστεί να μετατρέψουμε τα URLs των εικόνων σε File objects
      // Αυτό θα πρέπει να γίνει με fetch των εικόνων και μετατροπή σε Blob
      // Προς το παρόν αφήνουμε κενή τη λίστα
      setFileList([]);
    }
  }, [product]);

  const handleSubmit = async (values: ProductFormData) => {
    try {
      setLoading(true);

      // Πρώτα ανεβάζουμε τις εικόνες αν υπάρχουν
      let imageUrls: string[] = [];
      if (fileList.length > 0) {
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('files', file);
        });

        const uploadResponse = await api.post('/admin/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrls = uploadResponse.data.urls;
      }

      // Προετοιμάζουμε τα δεδομένα του προϊόντος
      const productData: ProductFormData = {
        ...values,
        images: imageUrls.map((url, index) => ({
          id: `temp-${index}`,
          url,
          alt: values.name,
          isPrimary: index === 0
        })),
        price: Number(values.price),
        stock: Number(values.stock),
      };

      await onSubmit(productData);

      toast({
        title: product ? 'Ενημέρωση Προϊόντος' : 'Νέο Προϊόν',
        description: product ? 'Το προϊόν ενημερώθηκε επιτυχώς' : 'Το προϊόν δημιουργήθηκε επιτυχώς',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
      toast({
        title: 'Σφάλμα',
        description: 'Παρουσιάστηκε σφάλμα κατά την αποθήκευση',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'name',
      label: 'Όνομα Προϊόντος',
      type: 'text',
      validation: { required: true },
      component: <Input />
    },
    {
      name: 'category',
      label: 'Κατηγορία',
      type: 'select',
      validation: { required: true },
      component: (
        <CustomSelect placeholder="Επιλέξτε κατηγορία">
          {Object.values(ProductCategory).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </CustomSelect>
      )
    },
    {
      name: 'description',
      label: 'Περιγραφή',
      type: 'textarea',
      validation: { required: true },
      component: <Textarea rows={4} />
    },
    {
      name: 'price',
      label: 'Τιμή',
      type: 'number',
      validation: { required: true },
      component: (
        <CustomNumberInput
          min={0}
          precision={2}
          step={0.01}
        />
      )
    },
    {
      name: 'stock',
      label: 'Απόθεμα',
      type: 'number',
      validation: { required: true },
      component: (
        <CustomNumberInput
          min={0}
        />
      )
    },
    {
      name: 'unit',
      label: 'Μονάδα Μέτρησης',
      type: 'select',
      validation: { required: true },
      component: (
        <CustomSelect placeholder="Επιλέξτε μονάδα">
          {Object.values(ProductUnit).map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </CustomSelect>
      )
    },
    {
      name: 'status',
      label: 'Κατάσταση',
      type: 'select',
      validation: { required: true },
      component: (
        <CustomSelect>
          <option value={ProductStatus.Active}>Ενεργό</option>
          <option value={ProductStatus.Inactive}>Ανενεργό</option>
          <option value={ProductStatus.OutOfStock}>Εξαντλημένο</option>
        </CustomSelect>
      )
    },
    {
      name: 'producerId',
      label: 'Παραγωγός',
      type: 'select',
      validation: { required: false },
      component: (
        <CustomSelect placeholder="Επιλέξτε παραγωγό">
          {producers?.map((producer) => (
            <option key={producer._id} value={producer._id}>
              {producer.name}
            </option>
          ))}
        </CustomSelect>
      )
    },
  ];

  return (
    <Form
      fields={fields}
      onSubmit={handleSubmit}
      initialValues={product || {}}
      isLoading={loading}
      onCancel={onClose}
    >
      <Box mt={4}>
        <Text mb={2}>Εικόνες Προϊόντος</Text>
        <FileUpload
          files={fileList}
          onChange={setFileList}
          maxFiles={5}
          maxSize={2 * 1024 * 1024}
          acceptedFileTypes={['image/*']}
        />
      </Box>
    </Form>
  );
} 