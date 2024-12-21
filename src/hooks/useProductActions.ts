import { useState } from 'react';
import { UseToastOptions } from '@chakra-ui/react';
import { Product, ProductFormData } from '@/types/product';

interface UseProductActionsProps {
  createProduct: (data: Omit<Product, '_id' | 'producer' | 'rating' | 'reviewsCount' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  onClose: () => void;
  toast: (options: UseToastOptions) => void;
}

export const useProductActions = ({
  createProduct,
  updateProduct,
  deleteProduct,
  onClose,
  toast,
}: UseProductActionsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCreateOrUpdate = async (data: ProductFormData) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct._id, data);
        toast({
          title: 'Επιτυχία',
          description: 'Το προϊόν ενημερώθηκε επιτυχώς',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        const newProductData = {
          ...data,
          producerId: data.producerId || '',
          images: [],
          rating: 0,
          reviewsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await createProduct(newProductData);
        toast({
          title: 'Επιτυχία',
          description: 'Το προϊόν δημιουργήθηκε επιτυχώς',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      onClose();
      setSelectedProduct(null);
    } catch (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Υπήρξε ένα πρόβλημα κατά την αποθήκευση του προϊόντος',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast({
        title: 'Επιτυχία',
        description: 'Το προϊόν διαγράφηκε επιτυχώς',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setSelectedProduct(null);
    } catch (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Υπήρξε ένα πρόβλημα κατά τη διαγραφή του προϊόντος',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  return {
    selectedProduct,
    setSelectedProduct,
    handleCreateOrUpdate,
    handleDelete,
  };
}; 