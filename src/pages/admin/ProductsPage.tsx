import { useState } from 'react';
import { Box, Heading, Button, useToast } from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { useProducts } from '@/features/products/hooks/useProducts';
import { ProductModal } from '@/components/admin/products/ProductModal';
import { DeleteConfirmationModal } from '@/components/common/Modal/DeleteConfirmationModal';
import { BasePage } from '@/components/common/Layout/BasePage';
import { ProductList } from '@/components/admin/products/ProductList';
import type { Product, ProductFormData } from '@/types/product';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const toast = useToast();
  
  const { 
    products, 
    isLoading, 
    error,
    addProduct,
    updateProduct,
    deleteProduct 
  } = useProducts();

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleModalSubmit = async (data: ProductFormData) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct._id, data);
        toast({
          title: 'Επιτυχής ενημέρωση',
          description: 'Το προϊόν ενημερώθηκε με επιτυχία',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const newProduct = {
          ...data,
          images: data.images || [],
          rating: 0,
          reviewsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          producerId: data.producerId || 'default-producer'
        };
        
        await addProduct(newProduct);
        toast({
          title: 'Επιτυχής δημιουργία',
          description: 'Το προϊόν δημιουργήθηκε με επιτυχία',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Προέκυψε σφάλμα κατά την αποθήκευση',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      await deleteProduct(selectedProduct._id);
      toast({
        title: 'Επιτυχής διαγραφή',
        description: 'Το προϊόν διαγράφηκε με επιτυχία',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Προέκυψε σφάλμα κατά τη διαγραφή',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (error) {
    return (
      <BasePage>
        <Box p={8}>
          <Heading color="red.500">Σφάλμα φόρτωσης προϊόντων</Heading>
        </Box>
      </BasePage>
    );
  }

  return (
    <BasePage>
      <Box p={8}>
        {/* Header */}
        <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
          <Heading>Διαχείριση Προϊόντων</Heading>
          <Button
            leftIcon={<Plus />}
            colorScheme="green"
            onClick={handleCreate}
          >
            Νέο Προϊόν
          </Button>
        </Box>

        {/* Products List */}
        <ProductList
          products={products || []}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={(id: string) => {
            const product = products?.find(p => p._id === id);
            if (product) {
              handleDelete(product);
            }
          }}
        />

        {/* Product Modal */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSubmit}
          product={selectedProduct}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Διαγραφή Προϊόντος"
          message={`Είστε σίγουροι ότι θέλετε να διαγράψετε το προϊόν "${selectedProduct?.name}";`}
        />
      </Box>
    </BasePage>
  );
} 