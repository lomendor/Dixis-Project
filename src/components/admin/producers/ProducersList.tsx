import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Select as ChakraSelect,
  Stack,
  Heading,
  useToast as useChakraToast,
} from '@chakra-ui/react';
import { Table } from '../common/Table';
import { ActionButtons } from '../common/ActionButtons';
import { Producer } from './types';
import { AddIcon } from '@chakra-ui/icons';

export const ProducersList: React.FC = () => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const toast = useChakraToast();

  useEffect(() => {
    fetchProducers();
  }, []);

  const fetchProducers = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/producers');
      const data = await response.json();
      setProducers(data);
    } catch (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Δεν ήταν δυνατή η φόρτωση των παραγωγών',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Όνομα', accessor: 'name' },
    { header: 'Εταιρεία', accessor: 'companyName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Τηλέφωνο', accessor: 'phone' },
    { header: 'Τοποθεσία', accessor: 'location' },
    {
      header: 'Κατάσταση',
      accessor: 'status',
      render: (value: string) => (
        <ChakraSelect
          value={value}
          size="sm"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(e.target.value)}
        >
          <option value="active">Ενεργός</option>
          <option value="pending">Σε αναμονή</option>
          <option value="inactive">Ανενεργός</option>
        </ChakraSelect>
      ),
    },
    {
      header: 'Ενέργειες',
      accessor: 'actions',
      render: (_: any, item: Producer) => (
        <ActionButtons
          onView={() => handleView(item)}
          onEdit={() => handleEdit(item)}
          onDelete={() => handleDelete(item.id)}
        />
      ),
    },
  ];

  const handleStatusChange = async (status: string) => {
    // TODO: Implement status change
  };

  const handleView = (producer: Producer) => {
    // TODO: Implement view
  };

  const handleEdit = (producer: Producer) => {
    // TODO: Implement edit
  };

  const handleDelete = async (id: string) => {
    // TODO: Implement delete
  };

  const handleAddNew = () => {
    // TODO: Implement add new
  };

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" marginBottom={4}>
        <Heading size="lg">Παραγωγοί</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={handleAddNew}
        >
          Νέος Παραγωγός
        </Button>
      </Stack>

      <Stack direction="row" marginBottom={4} gap={4}>
        <Input
          placeholder="Αναζήτηση..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ChakraSelect
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
          width="200px"
        >
          <option value="all">Όλες οι καταστάσεις</option>
          <option value="active">Ενεργοί</option>
          <option value="pending">Σε αναμονή</option>
          <option value="inactive">Ανενεργοί</option>
        </ChakraSelect>
      </Stack>

      <Table
        columns={columns}
        data={producers}
      />
    </Box>
  );
}; 