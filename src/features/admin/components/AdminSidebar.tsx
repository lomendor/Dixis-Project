import React from 'react';
import { Box, VStack, Icon, Text } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings, 
  FiBarChart2,
  FiShield,
  FiPackage
} from 'react-icons/fi';
import { Leaf } from 'lucide-react';

const navigation = [
  { 
    name: 'Αρχική',
    icon: FiHome,
    href: '/admin/dashboard',
    description: 'Επισκόπηση συστήματος'
  },
  { 
    name: 'Παραγωγοί',
    icon: FiUsers,
    href: '/admin/producers',
    description: 'Διαχείριση παραγωγών'
  },
  { 
    name: 'Προϊόντα',
    icon: FiShoppingBag,
    href: '/admin/products',
    description: 'Διαχείριση προϊόντων'
  },
  { 
    name: 'Παραγγελίες',
    icon: FiPackage,
    href: '/admin/orders',
    description: 'Διαχείριση παραγγελιών'
  },
  { 
    name: 'Αναφορές',
    icon: FiBarChart2,
    href: '/admin/reports',
    description: 'Αναφορές & Στατιστικά'
  },
  { 
    name: 'Χρήστες',
    icon: FiShield,
    href: '/admin/users',
    description: 'Διαχείριση χρηστών'
  },
  { 
    name: 'Ρυθμίσεις',
    icon: FiSettings,
    href: '/admin/settings',
    description: 'Ρυθμίσεις συστήματος'
  }
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { colorMode } = useColorMode();
  const activeBg = colorMode === 'light' ? 'blue.50' : 'blue.900';
  const activeColor = colorMode === 'light' ? 'blue.600' : 'blue.200';
  const hoverBg = colorMode === 'light' ? 'gray.100' : 'gray.700';

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      h="100vh"
      w="64"
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderRightWidth="1px"
      px="4"
      py="4"
    >
      {/* Logo */}
      <Box mb="8" px="4">
        <Box as={RouterLink} to="/admin" display="flex" alignItems="center" gap="2">
          <Icon as={Leaf} boxSize="8" color="emerald.500" />
          <Text fontSize="xl" fontWeight="bold" color="emerald.600">
            Dixis Admin
          </Text>
        </Box>
      </Box>

      {/* Navigation Items */}
      <VStack gap="2" align="stretch">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <RouterLink
              key={item.name}
              to={item.href}
              style={{ textDecoration: 'none' }}
            >
              <Box
                p="3"
                borderRadius="md"
                display="flex"
                alignItems="center"
                bg={isActive ? activeBg : 'transparent'}
                color={isActive ? activeColor : 'inherit'}
                _hover={{
                  bg: isActive ? activeBg : hoverBg,
                  textDecoration: 'none'
                }}
              >
                <Icon as={item.icon} boxSize="5" />
                <Box ml="3">
                  <Text fontSize="sm" fontWeight="medium">
                    {item.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {item.description}
                  </Text>
                </Box>
              </Box>
            </RouterLink>
          );
        })}
      </VStack>
    </Box>
  );
}; 