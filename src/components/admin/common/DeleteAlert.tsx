import React from 'react';
import {
  Button,
  Text,
  useDisclosure,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
} from '@chakra-ui/react';

interface DeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export const DeleteAlert: React.FC<DeleteAlertProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
      size="md"
    >
      <ModalOverlay 
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
        }}
      />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="lg" fontWeight="bold">
            {title}
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text>{description}</Text>
        </ModalBody>

        <ModalFooter>
          <Button 
            ref={cancelRef} 
            onClick={onClose} 
            variant="outline"
            size="md"
          >
            Ακύρωση
          </Button>
          <Button 
            colorScheme="red" 
            onClick={onConfirm} 
            ml={3}
            size="md"
            _hover={{ bg: 'red.600' }}
            _active={{ bg: 'red.700' }}
          >
            Διαγραφή
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 