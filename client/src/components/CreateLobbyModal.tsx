import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { Socket } from "socket.io-client";
import {
  defaultEliminationRate,
  defaultGlobalTime1vs1,
  defaultGlobalTimeBr,
  defaultNbLife,
  defaultNbRounds,
  defaultTimeAfterFirstGuess1vs1,
  defaultTimeAfterFirstGuessBr,
  maxPlayer1vs1,
  maxPlayerBr,
  minPlayer1vs1,
  minPlayerBr,
} from "src/utils/const";
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
  const [owner] = usePlayer();
  const socket = useSocket();
  const router = useRouter();

  const [lobbyName, setLobbyName] = useState(
    lobby ? lobby.name : `Lobby de ${owner?.name}`
  );
  const [gameMode, setGameMode] = useState(lobby ? lobby.mode : "1vs1");
  const [isPublic, setIsPublic] = useState(lobby ? lobby.isPublic : true);
  const [nbPlaces, setNbPlaces] = useState(
    lobby ? lobby.totalPlace : maxPlayer1vs1
  );
  const [minPlaces, setminPlaces] = useState(
    gameMode === "1vs1" ? minPlayer1vs1 : minPlayerBr
  );
  const [maxPlaces, setmaxPlaces] = useState(
    gameMode === "1vs1" ? maxPlayer1vs1 : maxPlayerBr
  );
  const [nbLife, setNbLife] = useState(
    lobby ? lobby.nbLifePerPlayer : defaultNbLife
  );

  const [nbRounds, setNbRounds] = useState(defaultNbRounds);
  const [eliminationRate, setEliminationRate] = useState(
    defaultEliminationRate
  );

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
        eliminationRate,
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
          eliminationRate,
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

  /**
   * Function to ensure that the value enter in the NumberInput is in the interval.
   * @param value - Value of the NumberInput
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns A value in the interval
   */
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
            <Box>
              <Text pb={1}>Nom</Text>
              <Input
                autoFocus
                value={lobbyName}
                onChange={handleLobbyName}
                mt={1}
              />
            </Box>
            {/* GAME MODE */}
            <Box pt={8}>
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
                <Text pr={1}>Vies</Text>
                <NumberInput
                  ml={1}
                  onChange={(valueString: string) =>
                    setNbLife(checkDataValidity(valueString, 1, 10))
                  }
                  value={nbLife}
                  min={1}
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
            {/* NbRounds (only for 1vs1) */}
            {gameMode === "1vs1" && (
              <Box display={"flex"} alignItems={"center"} pt={2}>
                <Text pr={1}>Round(s)</Text>
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
            )}
            {/* Elimination rate (only for Battle-Royale) */}
            {gameMode === "battle-royale" && (
              <Box display={"flex"} alignItems={"center"} pt={2}>
                <Text w={325} pr={1}>
                  Taux d'élimination (en %)
                </Text>
                <NumberInput
                  onChange={(valueString: string) =>
                    setEliminationRate(checkDataValidity(valueString, 1, 50))
                  }
                  value={eliminationRate}
                  min={1}
                  max={50}
                  w={"lg"}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            )}
            {/* Temps global */}
            <Box display={"flex"} alignItems={"center"} pt={2}>
              <Text pr={1}>Temps global (minutes)</Text>
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
            <Box display={"flex"} alignItems={"center"} pt={2}>
              <Text pr={1}>Temps après le 1er gagnant (secondes)</Text>
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
            {/* Accessibilité du lobby */}
            <Box pt={8}>
              <Text pb={2}>Visibilité</Text>
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
