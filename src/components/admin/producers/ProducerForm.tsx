import React from 'react';
import {
  Box,
  Stack,
  Heading,
  Input,
  Button,
  useToast as useChakraToast,
} from '@chakra-ui/react';
import { Form } from '../common/Form';
import { Producer } from './types';

interface ProducerFormProps {
  producer?: Producer;
  onSubmit: (data: Partial<Producer>) => Promise<void>;
  isLoading?: boolean;
}

export const ProducerForm: React.FC<ProducerFormProps> = ({
  producer,
  onSubmit,
  isLoading = false,
}) => {
  const toast = useChakraToast();

  const fields = [
    {
      name: 'name',
      label: 'Όνομα',
      type: 'text',
      validation: { required: true },
      component: <Input />,
    },
    {
      name: 'companyName',
      label: 'Επωνυμία Εταιρείας',
      type: 'text',
      validation: { required: true },
      component: <Input />,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      validation: {
        required: true,
        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      },
      component: <Input type="email" />,
    },
    {
      name: 'phone',
      label: 'Τηλέφωνο',
      type: 'tel',
      validation: {
        required: true,
        pattern: /^[0-9+\-\s()]*$/,
      },
      component: <Input type="tel" />,
    },
    {
      name: 'location',
      label: 'Τοποθεσία',
      type: 'text',
      validation: { required: true },
      component: <Input />,
    },
  ];

  const handleSubmit = async (data: Partial<Producer>) => {
    try {
      await onSubmit(data);
      toast({
        title: 'Επιτυχία',
        description: producer
          ? 'Ο παραγωγός ενημερώθηκε επιτυχώς'
          : 'Ο παραγωγός δημιουργήθηκε επιτυχώς',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box p={4}>
      <Stack gap={4}>
        <Heading size="lg">
          {producer ? 'Επεξεργασία Παραγωγού' : 'Νέος Παραγωγός'}
        </Heading>
        <Form
          fields={fields}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialValues={producer}
        />
      </Stack>
    </Box>
  );
}; 