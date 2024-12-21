import { Box, Heading } from '@chakra-ui/react';
import {
  VStack,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import { Card } from '@/components/ui/Card';
import { 
  Bell, 
  Shield, 
  CreditCard,
  Settings
} from 'lucide-react';

export default function SettingsPage() {
  const toast = useToast();

  const handleSave = () => {
    toast({
      title: 'Επιτυχία',
      description: 'Οι ρυθμίσεις αποθηκεύτηκαν',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Ρυθμίσεις</Heading>
          <Text color="gray.600">Διαχειριστείτε τις ρυθμίσεις του συστήματος</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Γενικές Ρυθμίσεις */}
          <Card className="p-6">
            <VStack align="stretch" spacing={4}>
              <Box className="flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <Heading size="md">Γενικές Ρυθμίσεις</Heading>
              </Box>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Λειτουργία Συντήρησης</FormLabel>
                <Switch colorScheme="green" />
              </FormControl>

              <FormControl>
                <FormLabel>Όνομα Καταστήματος</FormLabel>
                <Input defaultValue="Dixis" />
              </FormControl>

              <FormControl>
                <FormLabel>Γλώσσα Συστήματος</FormLabel>
                <Select defaultValue="el">
                  <option value="el">Ελληνικά</option>
                  <option value="en">English</option>
                </Select>
              </FormControl>
            </VStack>
          </Card>

          {/* Ειδοποιήσεις */}
          <Card className="p-6">
            <VStack align="stretch" spacing={4}>
              <Box className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <Heading size="md">Ειδοποιήσεις</Heading>
              </Box>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Email Ειδοποιήσεις</FormLabel>
                <Switch colorScheme="green" defaultChecked />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Push Notifications</FormLabel>
                <Switch colorScheme="green" defaultChecked />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">SMS Ειδοποιήσεις</FormLabel>
                <Switch colorScheme="green" />
              </FormControl>
            </VStack>
          </Card>

          {/* Ασφάλεια */}
          <Card className="p-6">
            <VStack align="stretch" spacing={4}>
              <Box className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-gray-600" />
                <Heading size="md">Ασφάλεια</Heading>
              </Box>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Διπλός Έλεγχος Ταυτότητας</FormLabel>
                <Switch colorScheme="green" />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Καταγραφή Ενεργειών</FormLabel>
                <Switch colorScheme="green" defaultChecked />
              </FormControl>

              <FormControl>
                <FormLabel>Πολιτική Κωδικών</FormLabel>
                <Select defaultValue="strong">
                  <option value="basic">Βασική</option>
                  <option value="strong">Ισχυρή</option>
                  <option value="custom">Προσαρμοσμένη</option>
                </Select>
              </FormControl>
            </VStack>
          </Card>

          {/* Πληρωμές */}
          <Card className="p-6">
            <VStack align="stretch" spacing={4}>
              <Box className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <Heading size="md">Πληρωμές</Heading>
              </Box>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Δοκιμαστική Λειτουργία</FormLabel>
                <Switch colorScheme="green" />
              </FormControl>

              <FormControl>
                <FormLabel>Νόμισμα</FormLabel>
                <Select defaultValue="eur">
                  <option value="eur">Euro (€)</option>
                  <option value="usd">US Dollar ($)</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Προεπιλεγμένη Μέθοδος</FormLabel>
                <Select defaultValue="card">
                  <option value="card">Πιστωτική Κάρτα</option>
                  <option value="bank">Τραπεζική Μεταφορά</option>
                  <option value="cash">Αντικαταβολή</option>
                </Select>
              </FormControl>
            </VStack>
          </Card>
        </SimpleGrid>

        <Box pt={4}>
          <Button colorScheme="green" size="lg" onClick={handleSave}>
            Αποθήκευση Αλλαγών
          </Button>
        </Box>
      </VStack>
    </Box>
  );
} 