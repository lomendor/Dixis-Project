import React from 'react';
import {
  Table as ChakraTable,
  TableContainer,
  Box,
} from '@chakra-ui/react';

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (item: any) => void;
}

export const Table: React.FC<TableProps> = ({ columns, data, onRowClick }) => {
  return (
    <Box overflowX="auto">
      <TableContainer>
        <ChakraTable variant="simple">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.accessor}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                style={{
                  cursor: onRowClick ? 'pointer' : 'default',
                }}
              >
                {columns.map((column) => (
                  <td key={`${index}-${column.accessor}`}>
                    {column.render
                      ? column.render(item[column.accessor], item)
                      : item[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </ChakraTable>
      </TableContainer>
    </Box>
  );
};

export default Table; 