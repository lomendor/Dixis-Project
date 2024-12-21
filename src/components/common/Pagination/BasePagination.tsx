import React from 'react';
import {
  Button,
  ButtonGroup,
  Select,
  HStack,
  Text,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface BasePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const BasePagination: React.FC<BasePaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const pageSizeOptions = [10, 20, 50, 100];
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <HStack spacing={4} justify="space-between" w="100%">
      <HStack spacing={2}>
        <Text fontSize="sm" color="gray.600">
          {totalItems === 0
            ? 'Δεν βρέθηκαν αποτελέσματα'
            : `${startItem}-${endItem} από ${totalItems} αποτελέσματα`}
        </Text>
        {onPageSizeChange && (
          <Select
            size="sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            width="auto"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} ανά σελίδα
              </option>
            ))}
          </Select>
        )}
      </HStack>

      <ButtonGroup size="sm" variant="outline" spacing={2}>
        <Button
          leftIcon={<FiChevronLeft />}
          onClick={handlePrevious}
          isDisabled={currentPage === 1}
        >
          Προηγούμενη
        </Button>
        <Button
          rightIcon={<FiChevronRight />}
          onClick={handleNext}
          isDisabled={currentPage === totalPages}
        >
          Επόμενη
        </Button>
      </ButtonGroup>
    </HStack>
  );
}; 