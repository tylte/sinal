import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

interface CreateLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateLobbyModal: React.FC<CreateLobbyModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>creation de lobby</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <>
            OIYROIGHDOIGFOAIYSGASIHGDOIYGHFDIOGHAIDHOIQWGHEOIGHIADSHAGHIOGWQOIEGOIDGHFOIAGHOIQWHGIOGHOIDHQOIDGHOIQWGoi
          </>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
