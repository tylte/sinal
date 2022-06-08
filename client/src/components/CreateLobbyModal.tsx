import {
  Box,
  Button,
  Fade,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { Socket } from "socket.io-client";
import {
  maxPlayer1vs1,
  maxPlayerBr,
  minPlayer1vs1,
  minPlayerBr,
} from "src/utils/Const";
import { usePlayer, useSocket } from "src/utils/hooks";
import { GameMode, Lobby, Packet, Player } from "src/utils/types";

interface CreateLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: string;
  lobby?: Lobby;
}
export const CreateLobbyModal: React.FC<CreateLobbyModalProps> = ({
  isOpen,
  onClose,
  mode,
  lobby,
}) => {
  const [gameMode, setGameMode] = React.useState(lobby ? lobby.mode : "1vs1");
  const [isPublic, setIsPublic] = React.useState(lobby ? lobby.isPublic : true);
  const [lobbyName, setLobbyName] = React.useState(
    lobby ? lobby.name : "Nouveau Lobby"
  );
  const [nbPlaces, setNbPlaces] = React.useState(lobby ? lobby.totalPlace : 2);
  const [minPlaces, setminPlaces] = React.useState(
    lobby ? lobby.totalPlace : 2
  );
  const [maxPlaces, setmaxPlaces] = React.useState(
    lobby ? lobby.totalPlace : 2
  );
  const [nbLife, setNbLife] = useState(lobby ? lobby.nbLifePerPlayer : 6);
  const [nbRounds, setNbRounds] = useState(1);
  const { isOpen: openFade, onToggle } = useDisclosure({
    isOpen: gameMode === "1vs1",
  });
  const socket = useSocket();
  const [owner] = usePlayer();
  const router = useRouter();

  const handleButton = (socket: Socket | null, owner: Player | null) => {
    if (mode === "Update" && lobby !== undefined) {
      socket?.emit("update_lobby", {
        lobbyId: lobby.id,
        mode: gameMode,
        place: nbPlaces,
        isPublic,
        owner,
        name: lobbyName,
        nbRounds,
        nbLife,
      });
    } else if (mode === "Create") {
      socket?.emit(
        "create_lobby",
        {
          mode: gameMode,
          place: nbPlaces,
          isPublic,
          owner,
          name: lobbyName,
          nbRounds,
          nbLife,
        },
        (response: Packet) => {
          if (response.success) {
            router.push(`/lobby/${response.data}`);
          } else {
            console.log("createLobby client error : " + response.message);
          }
        }
      );
    }

    onClose();
  };

  const handleKeyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleButton(socket, owner);
    }
  };

  const handleLobbyName = (event: any) => {
    setLobbyName(event.target.value);
  };

  const handleGameMode = (value: GameMode) => {
    setGameMode(value);
    if (value == "battle-royale") {
      setmaxPlaces(maxPlayerBr);
      setminPlaces(minPlayerBr);
      setNbPlaces(maxPlayerBr);
    } else if (value == "1vs1") {
      onToggle();
      setmaxPlaces(maxPlayer1vs1);
      setminPlaces(minPlayer1vs1);
      setNbPlaces(maxPlayer1vs1);
    }
  };

  const handleIsPublic = (value: string) => {
    setIsPublic(value === "true");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === "Create" ? "Création de lobby" : "Modifier le lobby"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box onKeyDown={handleKeyPressed}>
            <Input autoFocus value={lobbyName} onChange={handleLobbyName} />
            {/* GAME MODE */}
            <Text my={2}>Mode de jeu</Text>
            <RadioGroup onChange={handleGameMode} value={gameMode}>
              <Stack direction="row">
                <Radio value="1vs1">1 vs 1</Radio>
                <Radio isDisabled={false} value="battle-royale">
                  Battle Royale
                </Radio>
                <Radio isDisabled={true} value="2vs2">
                  2 vs 2
                </Radio>
              </Stack>
            </RadioGroup>
            {/* PLACE */}
            <VStack>
              <HStack my={2}>
                <Text my={2}>Places</Text>
                {/* <Text> min : {minPlaces} </Text>
                <Text>max : {maxPlaces} </Text> */}
                <NumberInput
                  isDisabled={maxPlaces === minPlaces}
                  onChange={(valueString: string) =>
                    setNbPlaces(() => {
                      let result = parseInt(
                        valueString === "" ? "0" : valueString
                      );
                      if (result > maxPlaces) {
                        result = maxPlaces;
                      } else if (result < minPlaces) {
                        result = minPlaces;
                      }

                      return result;
                    })
                  }
                  value={nbPlaces}
                  min={minPlaces}
                  max={maxPlaces}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text my={2}>Vies</Text>
                <NumberInput
                  onChange={(valueString: string) =>
                    setNbLife(parseInt(valueString))
                  }
                  value={nbLife}
                  min={2}
                  max={10}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
              <Fade in={openFade} unmountOnExit={true}>
                <HStack>
                  <Text my={2}>Round(s)</Text>
                  <NumberInput
                    onChange={(valueString: string) =>
                      setNbRounds(parseInt(valueString))
                    }
                    value={nbRounds}
                    min={1}
                    max={5}
                    w={330}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </Fade>
            </VStack>
            {/* PUBLIC/PRIVE */}
            <Text my={2}>Visibilité</Text>
            <RadioGroup onChange={handleIsPublic} value={isPublic.toString()}>
              <Stack direction="row">
                <Radio value="true">Public</Radio>
                <Radio value="false">Privée</Radio>
              </Stack>
            </RadioGroup>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => handleButton(socket, owner)}
          >
            {mode === "Create" ? "Créer le lobby" : "Modifier"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
