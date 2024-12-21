import React from 'react';
import {
  IconButton,
  HStack,
  Tooltip,
  useDisclosure,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Button,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  isDeleting?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  onView,
  isDeleting = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleDelete = () => {
    onDelete?.();
    onClose();
  };

  return (
    <>
      <HStack spacing={2}>
        {onView && (
          <Tooltip label="Προβολή">
            <IconButton
              aria-label="View"
              icon={<ViewIcon />}
              size="sm"
              onClick={onView}
              colorScheme="blue"
              variant="ghost"
            />
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip label="Επεξεργασία">
            <IconButton
              aria-label="Edit"
              icon={<EditIcon />}
              size="sm"
              onClick={onEdit}
              colorScheme="green"
              variant="ghost"
            />
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip label="Διαγραφή">
            <IconButton
              aria-label="Delete"
              icon={<DeleteIcon />}
              size="sm"
              onClick={onOpen}
              colorScheme="red"
              variant="ghost"
              disabled={isDeleting}
            />
          </Tooltip>
        )}
      </HStack>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Επιβεβαίωση Διαγραφής</ModalHeader>
          <ModalBody>
            Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το στοιχείο;
            Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.
          </ModalBody>
          <ModalFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Ακύρωση
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              marginLeft={3}
              disabled={isDeleting}
            >
              Διαγραφή
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ActionButtons; 