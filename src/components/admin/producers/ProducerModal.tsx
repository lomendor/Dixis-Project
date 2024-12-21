import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { Producer, NewProducer } from '@/types';

interface ProducerModalProps {
  isOpen: boolean;
  onClose: () => void;
  producer?: Producer;
  onSubmit: (data: NewProducer) => Promise<void>;
}

export const ProducerModal: React.FC<ProducerModalProps> = ({
  isOpen,
  onClose,
  producer,
  onSubmit,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: NewProducer = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: formData.get('status') as 'active' | 'inactive',
      productsCount: producer?.productsCount || 0,
    };
    await onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {producer ? 'Επεξεργασία Παραγωγού' : 'Νέος Παραγωγός'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Όνομα</FormLabel>
                <Input
                  name="name"
                  defaultValue={producer?.name}
                  placeholder="Όνομα παραγωγού"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  defaultValue={producer?.email}
                  placeholder="email@example.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Κηλέφωνο</FormLabel>
                <Input
                  name="phone"
                  defaultValue={producer?.phone}
                  placeholder="Τηλέφωνο επικοινωνίας"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Κατάσταση</FormLabel>
                <Select
                  name="status"
                  defaultValue={producer?.status || 'active'}
                >
                  <option value="active">Ενεργός</option>
                  <option value="inactive">Ανενεργός</option>
                </Select>
              </FormControl>

              <Button type="submit" colorScheme="blue" width="100%">
                {producer ? 'Αποθήκευση' : 'Δημιουργία'}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 