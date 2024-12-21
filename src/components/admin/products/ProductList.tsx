import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  Button,
  Text,
  Flex,
  Spinner,
  Badge,
  Tooltip
} from '@chakra-ui/react';
import { 
  FiEdit2, 
  FiTrash2, 
  FiChevronLeft, 
  FiChevronRight, 
  FiSearch,
  FiDownload,
  FiArrowUp,
  FiArrowDown,
  FiFilter
} from 'react-icons/fi';
import type { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  loading?: boolean;
}

type SortField = 'name' | 'category' | 'price' | 'stock' | 'status' | 'producer';
type SortOrder = 'asc' | 'desc';

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Μοναδικές κατηγορίες για το φίλτρο
  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(p => p.category));
    return Array.from(uniqueCategories).sort();
  }, [products]);

  // Φιλτράρισμα προϊόντων
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.producer?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchTerm, statusFilter, categoryFilter]);

  // Ταξινόμηση προϊόντων
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'producer') {
        aValue = a.producer?.name || '';
        bValue = b.producer?.name || '';
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredProducts, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'green', label: 'Ενεργό' },
      inactive: { color: 'gray', label: 'Ανενεργό' },
      out_of_stock: { color: 'red', label: 'Εξαντλημένο' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'gray', label: status };
    return <Badge colorScheme={config.color}>{config.label}</Badge>;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Όνομα', 'Κατηγορία', 'Τιμή', 'Απόθεμα', 'Κατάσταση', 'Παραγωγός'];
    const csvData = sortedProducts.map(product => [
      product.name,
      product.category,
      `${product.price.toFixed(2)}€`,
      `${product.stock} ${product.unit}`,
      product.status,
      product.producer?.name || '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.csv';
    link.click();
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />;
  };

  return (
    <Box>
      {/* Φίλτρα, Αναζήτηση και Εξαγωγή */}
      <HStack spacing={4} mb={4}>
        <Box flex={1}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch />
            </InputLeftElement>
            <Input
              placeholder="Αναζήτηση προϊόντων..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Box>
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          w="200px"
          icon={<FiFilter />}
        >
          <option value="all">Όλες οι κατηγορίες</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          w="200px"
          icon={<FiFilter />}
        >
          <option value="all">Όλες οι καταστάσεις</option>
          <option value="active">Ενεργά</option>
          <option value="inactive">Ανενεργά</option>
          <option value="out_of_stock">Εξαντλημένα</option>
        </Select>
        <Tooltip label="Εξαγωγή σε CSV">
          <IconButton
            aria-label="Export to CSV"
            icon={<FiDownload />}
            onClick={exportToCSV}
            colorScheme="green"
          />
        </Tooltip>
      </HStack>

      {/* Πίνακας */}
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => handleSort('name')}>
                <HStack spacing={1}>
                  <Text>Όνομα</Text>
                  {getSortIcon('name')}
                </HStack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('category')}>
                <HStack spacing={1}>
                  <Text>Κατηγορία</Text>
                  {getSortIcon('category')}
                </HStack>
              </Th>
              <Th isNumeric cursor="pointer" onClick={() => handleSort('price')}>
                <HStack spacing={1} justify="flex-end">
                  <Text>Τιμή</Text>
                  {getSortIcon('price')}
                </HStack>
              </Th>
              <Th isNumeric cursor="pointer" onClick={() => handleSort('stock')}>
                <HStack spacing={1} justify="flex-end">
                  <Text>Απόθεμα</Text>
                  {getSortIcon('stock')}
                </HStack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('status')}>
                <HStack spacing={1}>
                  <Text>Κατάσταση</Text>
                  {getSortIcon('status')}
                </HStack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('producer')}>
                <HStack spacing={1}>
                  <Text>Παραγωγός</Text>
                  {getSortIcon('producer')}
                </HStack>
              </Th>
              <Th>Ενέργειες</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedProducts.map((product) => (
              <Tr key={product._id}>
                <Td>{product.name}</Td>
                <Td>{product.category}</Td>
                <Td isNumeric>{product.price.toFixed(2)}€</Td>
                <Td isNumeric>{product.stock} {product.unit}</Td>
                <Td>{getStatusBadge(product.status)}</Td>
                <Td>{product.producer?.name || '-'}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Edit product"
                      icon={<FiEdit2 />}
                      size="sm"
                      colorScheme="blue"
                      onClick={() => onEdit(product)}
                    />
                    <IconButton
                      aria-label="Delete product"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => onDelete(product._id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <Flex justify="space-between" align="center" mt={4}>
        <HStack spacing={4}>
          <Text color="gray.600">
            Προβολή {paginatedProducts.length} από {sortedProducts.length} προϊόντα
          </Text>
          <Select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            w="120px"
            size="sm"
          >
            <option value={5}>5 ανά σελίδα</option>
            <option value={10}>10 ανά σελίδα</option>
            <option value={20}>20 ανά σελίδα</option>
            <option value={50}>50 ανά σελίδα</option>
          </Select>
        </HStack>
        <HStack spacing={2}>
          <Button
            leftIcon={<FiChevronLeft />}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            isDisabled={currentPage === 1}
            size="sm"
          >
            Προηγούμενο
          </Button>
          <Text>
            Σελίδα {currentPage} από {totalPages}
          </Text>
          <Button
            rightIcon={<FiChevronRight />}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            isDisabled={currentPage === totalPages}
            size="sm"
          >
            Επόμενο
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}; 