import React from 'react';
import { SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Box } from '@chakra-ui/react';

interface StatItemProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

interface BaseStatsProps {
  items: StatItemProps[];
}

export const BaseStats: React.FC<BaseStatsProps> = ({ items }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={6}>
      {items.map((item, index) => (
        <Stat key={index} p={4} bg="white" borderRadius="lg" shadow="sm">
          {item.icon && <Box mb={2}>{item.icon}</Box>}
          <StatLabel>{item.label}</StatLabel>
          <StatNumber>{item.value}</StatNumber>
          {item.change !== undefined && (
            <StatHelpText>
              <StatArrow type={item.change >= 0 ? 'increase' : 'decrease'} />
              {Math.abs(item.change)}%
            </StatHelpText>
          )}
        </Stat>
      ))}
    </SimpleGrid>
  );
}; 