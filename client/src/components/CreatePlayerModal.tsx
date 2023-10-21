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
  Spacer,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { usePlayer, useSocket } from "../utils/hooks";
import { Packet } from "../utils/types";

interface CreatePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  path?: string;
}

export const CreatePlayerModal: React.FC<CreatePlayerModalProps> = ({
  isOpen,
  onClose,
  path,
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
    socket?.emit("create_player", pseudo, (player: Packet) => {
      if (setPlayer) {
        if (player.success) {
          setPlayer(player.data);
          if (path) {
            router.push(path);
          } else {
            router.push("/lobby");
          }
        } else {
          console.error(player.message);
        }
      } else {
        console.error("Couldn't create user !?");
      }
    });
  };

  const handleKeyDownCreatePlayer = (e: any) => {
    if (e.which === 13) {
      createPlayer();
    }
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
            autoFocus
            onKeyDown={handleKeyDownCreatePlayer}
            value={pseudo}
            onChange={handlePseudoChange}
            placeholder="Pseudonyme"
          />
        </ModalBody>

        <ModalFooter>
          {router.pathname !== "/" && (
            <>
              <Button
                colorScheme="gray"
                mr={3}
                onClick={() => {
                  router.push("/");
                }}
              >
                Page d'accueil
              </Button>
              <Spacer />
            </>
          )}
          <Button
            colorScheme="green"
            mr={3}
            onClick={createPlayer}
            isDisabled={pseudo.length === 0}
          >
            Rejoindre la bataille
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
