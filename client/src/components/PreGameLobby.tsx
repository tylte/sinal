import { ArrowBackIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { GameMode, Lobby, Player } from "../utils/types";
import { isLobbyJoinable } from "../utils/utils";
import { GiLaurelCrown } from "react-icons/gi";
import { useSocket } from "../utils/hooks";
import { CreateLobbyModal } from "./CreateLobbyModal";
import {
  defaultEliminationRate,
  defaultGlobalTime1vs1,
  defaultGlobalTimeBr,
  defaultTimeAfterFirstGuess1vs1,
  defaultTimeAfterFirstGuessBr,
} from "src/utils/Const";

interface PreGameLobbyProps {
  lobby: Lobby;
  player: Player;
  gameMode: GameMode;
}

export const PreGameLobby: React.FC<PreGameLobbyProps> = ({
  lobby: {
    name,
    totalPlace,
    state,
    playerList,
    id,
    owner,
    mode,
    lastGame,
    currentGameId,
    isPublic,
    nbLifePerPlayer,
  },
  player: { id: playerId },
  gameMode,
}) => {
  const socket = useSocket();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentPlace = playerList.length;

  const startGame = () => {
    if (gameMode === "battle-royale") {
      socket?.emit("start_game_br", {
        lobbyId: id,
        playerId,
        eliminationRate: defaultEliminationRate,
        globalTime: defaultGlobalTimeBr,
        timeAfterFirstGuess: defaultTimeAfterFirstGuessBr,
      });
    } else if (gameMode === "1vs1") {
      socket?.emit("start_game_1vs1", {
        lobbyId: id,
        playerId,
        globalTime: defaultGlobalTime1vs1,
        timeAfterFirstGuess: defaultTimeAfterFirstGuess1vs1,
      });
    }
  };

  const placeStatus = isLobbyJoinable(currentPlace, totalPlace, state)
    ? `En attente de joueur ${currentPlace}/${totalPlace}`
    : "Plein";

  return (
    <>
      <Box pt={8} pl={8}>
        {lastGame != null && (
          <>
            <Text fontSize={"3xl"} fontWeight={"bold"}>
              Dernière partie
            </Text>
            <Box>
              <Text fontWeight={"bold"}>Mode de jeu :</Text> {lastGame.gameMode}
            </Box>
            <Box>
              <Text fontWeight={"bold"}>Liste des joueurs :</Text>
              {lastGame.playerList.map((player) => (
                <Text key={player.id}>{player.name}</Text>
              ))}
            </Box>
            <Box>
              <Text fontWeight={"bold"}>Gagnant : </Text>
              {lastGame.winner
                ? lastGame.winner.id === playerId
                  ? lastGame.winner.name + " (Vous)"
                  : lastGame.winner.name
                : "Egalité"}
            </Box>
            <Box>
              <Text fontWeight={"bold"}>Mot(s) à deviner : </Text>
              <Stack spacing={1}>
                {lastGame.wordsToGuess.map((word, index) => (
                  <Text key={index}>
                    {word[0].toUpperCase() + word.slice(1)}
                  </Text>
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Box>
      <Flex direction={"column"} alignContent={"center"}>
        <Box mx="auto">
          <Text fontSize={"4xl"}>
            {name} - {mode} - {placeStatus}
          </Text>
        </Box>

        <Text fontSize={"2xl"}>Joueurs</Text>
        <Divider />
        <List>
          {playerList.map((player) => {
            return (
              <ListItem key={player.id}>
                <HStack>
                  {player.id === owner && (
                    <ListIcon as={GiLaurelCrown} color="green.500" />
                  )}
                  <Text fontSize={"xl"}>
                    {player.name} {player.id === playerId && "(Vous)"}
                  </Text>
                </HStack>
              </ListItem>
            );
          })}
        </List>
        <HStack mx="auto">
          <IconButton
            aria-label="quit lobby"
            icon={<ArrowBackIcon />}
            onClick={() => router.push("/lobby")}
          />
          <IconButton
            isDisabled={playerId !== owner}
            aria-label="option lobby"
            icon={<SettingsIcon />}
            onClick={onOpen}
          />
          <CreateLobbyModal
            isOpen={isOpen}
            onClose={onClose}
            mode="Update"
            lobby={{
              name,
              totalPlace,
              state,
              playerList,
              id,
              owner,
              mode,
              nbLifePerPlayer,
              isPublic,
              currentGameId,
              lastGame,
            }}
          />
          <Button
            isDisabled={playerId !== owner || playerList.length < totalPlace}
            colorScheme={"green"}
            onClick={startGame}
          >
            Commencer
          </Button>
        </HStack>
      </Flex>
    </>
  );
};
