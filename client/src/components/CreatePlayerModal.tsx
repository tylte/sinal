import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Input,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface CreatePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePlayerModal: React.FC<CreatePlayerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  const [pseudo, setPseudo] = useState("");

  const handlePseudoChange = (e: any) => {
    setPseudo(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>rejoindre multijoueur</ModalHeader>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <AlertIcon />
          <AlertTitle>avertissement !</AlertTitle>
          <AlertDescription>
            vous êtes sur le point de jouer contre de vrais joueurs humains,
            entrez à vos risques et périls
          </AlertDescription>
        </Alert>
        <ModalCloseButton />
        <ModalBody>
          <Input
            value={pseudo}
            onChange={handlePseudoChange}
            placeholder="pseudonyme"
          />
        </ModalBody>

        <ModalFooter>
          <Flex>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => router.push("/lobby")}
              isDisabled={pseudo.length === 0}
            >
              join the battle
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
