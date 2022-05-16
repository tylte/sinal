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
import { usePlayer, useSocket } from "../utils/hooks";

interface CreatePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePlayerModal: React.FC<CreatePlayerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const socket = useSocket();
  const [_, setPlayer] = usePlayer();

  const [pseudo, setPseudo] = useState("");

  const handlePseudoChange = (e: any) => {
    let newPseudo = e.target.value as string;
    if (newPseudo.length < 50) {
      setPseudo(newPseudo);
    }
  };

  const createPlayer = () => {
    socket?.emit("create_player", pseudo, (playerId: string) => {
      if (setPlayer) {
        setPlayer({ id: playerId, name: pseudo });
        router.push("/lobby");
      } else {
        console.error("Couldn't create user !?");
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choisissez un pseudo</ModalHeader>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <AlertIcon />
          <AlertTitle>Attention !</AlertTitle>
          <AlertDescription>
            Vous êtes sur le point de jouer contre de vrais joueurs humains,
            entrez à vos risques et périls.
          </AlertDescription>
        </Alert>
        <ModalCloseButton />
        <ModalBody>
          <Input
            value={pseudo}
            onChange={handlePseudoChange}
            placeholder="Pseudonyme"
          />
        </ModalBody>

        <ModalFooter>
          <Flex>
            <Button
              colorScheme="green"
              mr={3}
              onClick={createPlayer}
              isDisabled={pseudo.length === 0}
            >
              Rejoindre la bataille
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
