import React from 'react';
import {
  HStack,
  Select,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

export interface FilterField {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

interface BaseFilterProps {
  fields: FilterField[];
  onFilter: (filters: Record<string, string>) => void;
  currentFilters: Record<string, string>;
}

export const BaseFilter: React.FC<BaseFilterProps> = ({
  fields,
  onFilter,
  currentFilters,
}) => {
  const handleChange = (fieldId: string, value: string) => {
    onFilter({
      ...currentFilters,
      [fieldId]: value,
    });
  };

  return (
    <HStack spacing={4} wrap="wrap">
      {fields.map((field) => (
        <FormControl key={field.id} minW="200px">
          <FormLabel fontSize="sm">{field.label}</FormLabel>
          <Select
            value={currentFilters[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            size="sm"
          >
            <option value="">Όλα</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
      ))}
    </HStack>
  );
}; 