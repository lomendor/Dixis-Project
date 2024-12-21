import { Box, Text, Icon, Flex } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface StatsCardProps {
  title: string;
  value: string;
  icon: IconType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="sm">
      <Flex alignItems="center" mb={2}>
        <Box
          p={2}
          borderRadius="md"
          bg="blue.50"
          color="blue.600"
          mr={4}
        >
          <Icon as={icon} boxSize={6} />
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">
            {title}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {value}
          </Text>
        </Box>
      </Flex>
      {trend && (
        <Flex alignItems="center" mt={2}>
          <Icon
            as={trend.isPositive ? FiTrendingUp : FiTrendingDown}
            color={trend.isPositive ? 'green.500' : 'red.500'}
            mr={1}
          />
          <Text
            fontSize="sm"
            color={trend.isPositive ? 'green.500' : 'red.500'}
          >
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </Text>
          <Text fontSize="sm" color="gray.500" ml={1}>
            από τον προηγούμενο μήνα
          </Text>
        </Flex>
      )}
    </Box>
  );
}
