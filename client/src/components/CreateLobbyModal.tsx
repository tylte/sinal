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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { Socket } from "socket.io-client";
import {
  defaultGlobalTime1vs1,
  defaultGlobalTimeBr,
  defaultTimeAfterFirstGuess1vs1,
  defaultTimeAfterFirstGuessBr,
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

  const [globalTime, setGlobalTime] = useState(
    lobby ? lobby.globalTime : defaultGlobalTime1vs1 / 60000
  );

  const [timeAfterFirstGuess, setTimeAfterFirstGuess] = useState(
    lobby ? lobby.timeAfterFirstGuess : defaultTimeAfterFirstGuess1vs1 / 1000
  );

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
        globalTime: globalTime * 60000,
        timeAfterFirstGuess: timeAfterFirstGuess * 1000,
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
          globalTime: globalTime * 60000,
          timeAfterFirstGuess: timeAfterFirstGuess * 1000,
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
      setGlobalTime(defaultGlobalTimeBr / 60000);
      setTimeAfterFirstGuess(defaultTimeAfterFirstGuessBr / 1000);
    } else if (value == "1vs1") {
      onToggle();
      setmaxPlaces(maxPlayer1vs1);
      setminPlaces(minPlayer1vs1);
      setNbPlaces(maxPlayer1vs1);
      setGlobalTime(defaultGlobalTime1vs1 / 60000);
      setTimeAfterFirstGuess(defaultTimeAfterFirstGuess1vs1 / 1000);
    }
  };

  const handleIsPublic = (value: string) => {
    setIsPublic(value === "true");
  };

  const checkDataValidity = (value: string, min: number, max: number) => {
    let result = parseInt(value === "" ? "0" : value);
    if (result > max) {
      result = max;
    } else if (result < min) {
      result = min;
    }

    return result;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={"center"}>
          {mode === "Create" ? "Création de lobby" : "Modifier le lobby"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box onKeyDown={handleKeyPressed}>
            <Box pb={4}>
              <Text pb={1}>Nom</Text>
              <Input
                autoFocus
                value={lobbyName}
                onChange={handleLobbyName}
                mt={1}
              />
            </Box>
            {/* GAME MODE */}
            <Box pt={4}>
              <Text pb={2}>Mode de jeu</Text>
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
            </Box>
            <HStack pt={2}>
              {/* NbPlaces */}
              <Box display={"flex"} alignItems={"center"} mr={2}>
                <Text mr={1}>Places</Text>
                <NumberInput
                  ml={1}
                  isDisabled={maxPlaces === minPlaces}
                  onChange={(valueString: string) =>
                    setNbPlaces(
                      checkDataValidity(valueString, minPlaces, maxPlaces)
                    )
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
              </Box>
              {/* NbLife */}
              <Box display={"flex"} alignItems={"center"} ml={2}>
                <Text mr={1}>Vies</Text>
                <NumberInput
                  ml={1}
                  onChange={(valueString: string) =>
                    setNbLife(checkDataValidity(valueString, 1, 10))
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
              </Box>
            </HStack>
            {/* Temps global */}
            <Box display={"flex"} alignItems={"center"}>
              <Text mr={1}>Temps global (minutes)</Text>
              <NumberInput
                ml={1}
                onChange={(valueString: string) =>
                  setGlobalTime(checkDataValidity(valueString, 1, 10))
                }
                value={globalTime}
                min={1}
                max={10}
                w={"lg"}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            {/* Time after the first player guess */}
            <Box display={"flex"} alignItems={"center"}>
              <Text mr={1}>Temps après 1er gagnant (secondes)</Text>
              <NumberInput
                ml={1}
                onChange={(valueString: string) =>
                  setTimeAfterFirstGuess(checkDataValidity(valueString, 0, 300))
                }
                value={timeAfterFirstGuess}
                min={0}
                max={300}
                w={"lg"}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            <Fade in={openFade} unmountOnExit={true}>
              {/* NbRounds */}
              <Box display={"flex"} alignItems={"center"} pt={2}>
                <Text pr={2}>Round(s)</Text>
                <NumberInput
                  onChange={(valueString: string) =>
                    setNbRounds(checkDataValidity(valueString, 1, 5))
                  }
                  value={nbRounds}
                  min={1}
                  max={5}
                  w={"lg"}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </Fade>
            {/* PUBLIC/PRIVE */}
            <Box pt={6}>
              <Text my={2}>Visibilité</Text>
              <RadioGroup onChange={handleIsPublic} value={isPublic.toString()}>
                <Stack direction="row">
                  <Radio value="true">Public</Radio>
                  <Radio value="false">Privée</Radio>
                </Stack>
              </RadioGroup>
            </Box>
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
