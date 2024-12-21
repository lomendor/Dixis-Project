import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  BoxProps,
  useColorModeValue,
} from '@chakra-ui/react';

interface BaseCardProps extends BoxProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  title,
  subtitle,
  children,
  headerActions,
  footer,
  isLoading,
  error,
  ...boxProps
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      shadow="sm"
      {...boxProps}
    >
      {(title || headerActions) && (
        <Box p="4" borderBottomWidth="1px" borderColor={borderColor}>
          <Stack
            direction="row"
            justify="space-between"
            align="center"
            spacing={4}
          >
            <Box>
              {title && <Heading size="md">{title}</Heading>}
              {subtitle && (
                <Text mt="1" color="gray.500" fontSize="sm">
                  {subtitle}
                </Text>
              )}
            </Box>
            {headerActions && <Box>{headerActions}</Box>}
          </Stack>
        </Box>
      )}

      <Box p="4">
        {error ? (
          <Text color="red.500">
            {error.message || 'Υπήρξε ένα σφάλμα κατά τη φόρτωση των δεδομένων'}
          </Text>
        ) : (
          children
        )}
      </Box>

      {footer && (
        <Box
          p="4"
          borderTopWidth="1px"
          borderColor={borderColor}
          bg={useColorModeValue('gray.50', 'gray.900')}
        >
          {footer}
        </Box>
      )}
    </Box>
  );
}; 