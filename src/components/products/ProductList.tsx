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
import type { Product } from '@/types/product';
import { productToCartItem } from '@/types/cart';

export const ProductList: React.FC = () => {
  const { products, isLoading } = useProducts();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddToCart = (product: Product) => {
    const cartItem = productToCartItem(product);
    addItem(cartItem);
    
    toast({
      title: 'Επιτυχία',
      description: 'Το προϊόν προστέθηκε στο καλάθι',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="container.xl" mx="auto" px={4} py={8}>
      <Heading as="h2" mb={8}>Προϊόντα</Heading>
      
      <InputGroup mb={8}>
        <Input
          placeholder="Αναζήτηση προϊόντων..."
          size="lg"
          onChange={handleSearch}
        />
        <InputRightElement h="full">
          <SearchIcon color="gray.500" />
        </InputRightElement>
      </InputGroup>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {filteredProducts.map((product) => (
          <Card key={product._id}>
            {product.images[0] && (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                height="200px"
                objectFit="cover"
                fallback={<Box height="200px" bg="gray.100" />}
              />
            )}
            <CardBody>
              <VStack align="start" spacing={2}>
                <Heading size="md">{product.name}</Heading>
                <Text>{product.description}</Text>
                <Text fontWeight="bold" fontSize="lg">
                  {product.price.toFixed(2)}€
                </Text>
                <Text color="gray.600">
                  {product.unit}
                </Text>
              </VStack>
            </CardBody>
            <CardFooter>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="blue"
                width="full"
                onClick={() => handleAddToCart(product)}
                isLoading={isLoading}
                isDisabled={product.stock <= 0}
              >
                {product.stock > 0 ? 'Προσθήκη στο καλάθι' : 'Εξαντλήθηκε'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}; 