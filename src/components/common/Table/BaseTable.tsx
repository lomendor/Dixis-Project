import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Spinner,
  Center,
  ResponsiveValue
} from '@chakra-ui/react';
import { Column } from '@/types/product';

export interface SortConfig {
  key: keyof any;
  direction: 'asc' | 'desc';
}

interface BaseTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onSort?: (key: keyof T) => void;
  sortConfig?: SortConfig;
}

type TableWidth = ResponsiveValue<string | number | "auto" | "inherit" | "initial" | "fit-content" | "max-content" | "min-content">;

export const BaseTable = <T extends Record<string, any>>({
  columns,
  data,
  isLoading,
  onSort,
  sortConfig,
}: BaseTableProps<T>) => {
  if (isLoading) {
    return (
      <Center py={8}>
        <Spinner />
      </Center>
    );
  }

  if (!data.length) {
    return (
      <Center py={8}>
        <Text color="gray.500">Δεν βρέθηκαν δεδομένα</Text>
      </Center>
    );
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            {columns.map((column, index) => (
              <Th
                key={index}
                onClick={() => column.sortable && onSort?.(column.accessor as keyof T)}
                cursor={column.sortable ? 'pointer' : 'default'}
                textAlign={column.align || 'left'}
                width={column.width as TableWidth || 'auto'}
              >
                {column.header}
                {column.sortable && sortConfig?.key === column.accessor && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <Td
                  key={colIndex}
                  textAlign={column.align || 'left'}
                >
                  {column.cell
                    ? column.cell(row[column.accessor as keyof T], row)
                    : String(row[column.accessor as keyof T] ?? '')}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}; 