import React, { useState } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from '@chakra-ui/icons';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types/models/product.types';
import { productToCartItem } from '@/types/common/cart.types';

export const ProductList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, isLoading, error } = useProducts();
  const { addItem } = useCart();
  const toast = useToast();

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    addItem(productToCartItem(product));
    toast({
      title: 'Προστέθηκε στο καλάθι',
      description: `${product.name} προστέθηκε στο καλάθι σας`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (error) {
    return <Box>Σφάλμα κατά τη φόρτωση των προϊόντων</Box>;
  }

  return (
    <Box maxW="container.xl" mx="auto" px={4} py={8}>
      <Heading as="h2" mb={8}>Προϊόντα</Heading>
      
      <InputGroup mb={8}>
        <Input
          placeholder="Αναζήτηση προϊόντων..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputRightElement>
          <SearchIcon color="gray.500" />
        </InputRightElement>
      </InputGroup>

      {isLoading ? (
        <Box>Φόρτωση...</Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredProducts?.map((product) => (
            <Card key={product._id} maxW="sm">
              <CardBody>
                <Image
                  src={product.images[0]?.url ?? '/images/placeholder.jpg'}
                  alt={product.name}
                  borderRadius="lg"
                  objectFit="cover"
                  height="200px"
                  width="100%"
                  fallback={<Box height="200px" bg="gray.100" />}
                />
                <VStack mt="6" spacing="3" align="start">
                  <Heading size="md">{product.name}</Heading>
                  <Text>{product.description}</Text>
                  <Text color="blue.600" fontSize="2xl">
                    {product.price}€
                  </Text>
                </VStack>
              </CardBody>
              <CardFooter>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="blue"
                  onClick={() => handleAddToCart(product)}
                >
                  Προσθήκη στο καλάθι
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}; 
