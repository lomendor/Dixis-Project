import React from 'react';
import { HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

interface BaseActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  viewLabel?: string;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  size?: 'sm' | 'md' | 'lg';
  spacing?: number;
  justify?: 'flex-start' | 'center' | 'flex-end';
}

export const BaseActionButtons: React.FC<BaseActionButtonsProps> = ({
  onEdit,
  onDelete,
  onView,
  editLabel = 'Επεξεργασία',
  deleteLabel = 'Διαγραφή',
  viewLabel = 'Προβολή',
  showEdit = true,
  showDelete = true,
  showView = false,
  size = 'sm',
  spacing = 2,
  justify = 'flex-end',
}) => {
  return (
    <HStack spacing={spacing} justify={justify}>
      {showView && onView && (
        <Tooltip label={viewLabel}>
          <IconButton
            aria-label={viewLabel}
            icon={<FiEye />}
            size={size}
            onClick={onView}
          />
        </Tooltip>
      )}
      
      {showEdit && onEdit && (
        <Tooltip label={editLabel}>
          <IconButton
            aria-label={editLabel}
            icon={<FiEdit2 />}
            size={size}
            onClick={onEdit}
          />
        </Tooltip>
      )}
      
      {showDelete && onDelete && (
        <Tooltip label={deleteLabel}>
          <IconButton
            aria-label={deleteLabel}
            icon={<FiTrash2 />}
            size={size}
            colorScheme="red"
            onClick={onDelete}
          />
        </Tooltip>
      )}
    </HStack>
  );
}; 