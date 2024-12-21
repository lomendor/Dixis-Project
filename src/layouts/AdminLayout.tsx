import React, { Suspense } from 'react';
import { Box, Flex, useColorMode, Spinner, Text } from '@chakra-ui/react';
import { AdminSidebar } from '../features/admin/components/AdminSidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

const LoadingFallback = () => (
  <Flex justify="center" align="center" h="100%" minH="400px">
    <Spinner size="xl" color="emerald.500" />
  </Flex>
);

const ErrorFallback = ({ error }: { error: Error }) => (
  <Flex direction="column" justify="center" align="center" h="100%" minH="400px">
    <Text fontSize="xl" color="red.500" mb={4}>
      Σφάλμα: {error.message}
    </Text>
  </Flex>
);

export const AdminLayout: React.FC = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const isAdmin = useAuthStore(state => state.isAdmin);
  
  const bgColor = colorMode === 'light' ? 'gray.50' : 'gray.900';
  const contentBg = colorMode === 'light' ? 'white' : 'gray.800';

  React.useEffect(() => {
    // Redirect if not admin
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  return (
    <Flex 
      minH="calc(100vh - var(--header-height))" 
      bg={bgColor} 
      mt="var(--header-height)"
      position="relative"
    >
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <Box flex="1" ml="64">
        {/* Page Content */}
        <Box
          as="main"
          p="6"
          bg={contentBg}
          borderRadius="lg"
          m="4"
          boxShadow="sm"
          minH="calc(100vh - var(--header-height) - 32px)"
        >
          <Suspense fallback={<LoadingFallback />}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Outlet />
            </ErrorBoundary>
          </Suspense>
        </Box>
      </Box>
    </Flex>
  );
}; 