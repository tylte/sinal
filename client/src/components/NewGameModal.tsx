import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

interface NewGameModalProps {
  isOpen: boolean;
  status:"info" | "warning" | "success" | "error" | undefined;
  description:string;
  title:string;
  onClose: () => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  status,
  description,
  title,
  onClose,
}) => {
  const router = useRouter();
  const newGame = () => {
    router.reload();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Partie finie</ModalHeader>
        <Alert
          status={status}
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <AlertIcon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            {description}
          </AlertDescription>
        </Alert>
        <ModalCloseButton />
        <ModalFooter>
          <Flex>
            <Button
              colorScheme="green"
              onClick={newGame}
            >
              Refaire une partie
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
