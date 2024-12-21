import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: string;
  isCentered?: boolean;
  showCloseButton?: boolean;
  overlayProps?: Record<string, any>;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  isCentered = true,
  showCloseButton = true,
  overlayProps = { style: { backdropFilter: 'blur(4px)' } }
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size={size}
      isCentered={isCentered}
      motionPreset="slideInBottom"
    >
      <ModalOverlay {...overlayProps} />
      <ModalContent>
        {title && <ModalHeader>{title}</ModalHeader>}
        {showCloseButton && <ModalCloseButton />}
        
        <ModalBody>
          {children}
        </ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
}; 