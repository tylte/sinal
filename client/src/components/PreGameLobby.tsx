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
import { LinkAfterGame1vs1 } from "./LinkPostGame1vs1";
import Head from "next/head";

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
    language,
    lastGame,
    currentGameId,
    isPublic,
    nbLifePerPlayer,
    nbRounds,
    globalTime,
    timeAfterFirstGuess,
    eliminationRate,
  },
  player,
  gameMode,
}) => {
  const socket = useSocket();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { id: playerId } = player;

  const currentPlace = playerList.length;

  const startGame = () => {
    if (gameMode === "battle-royale") {
      socket?.emit("start_game_br", {
        lobbyId: id,
        playerId,
        eliminationRate: eliminationRate,
        globalTime: globalTime,
        timeAfterFirstGuess: timeAfterFirstGuess,
      });
    } else if (gameMode === "1vs1") {
      socket?.emit("start_game_1vs1", {
        lobbyId: id,
        playerId,
        globalTime: globalTime,
        timeAfterFirstGuess: timeAfterFirstGuess,
      });
    }
  };

  const textGameMode =
    gameMode === "1vs1"
      ? "1 vs 1"
      : gameMode === "battle-royale"
      ? "Battle Royale"
      : "";

  const placeStatus = isLobbyJoinable(currentPlace, totalPlace, state)
    ? `En attente ${currentPlace}/${totalPlace}`
    : "Plein";

  return (
    <>
      <Head>
        <meta
          property="og:description"
          content={`Rejoignez-moi dans une partie de ${textGameMode} !`}
          key="description"
        />
      </Head>

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
            <LinkAfterGame1vs1 game={lastGame} />
          </>
        )}
      </Box>
      <Flex direction={"column"} alignContent={"center"}>
        <Box mx="auto">
          <Text fontSize={"4xl"}>
            {name} - {mode === "battle-royale" ? "BR" : mode} - {placeStatus}
          </Text>
          <Text textAlign={"center"} fontStyle={"italic"}>
            Vies : {nbLifePerPlayer}{" "}
            {mode === "1vs1" && `- Rounds : ${nbRounds}`}
            {mode === "battle-royale" &&
              `- Ratio d'éliminés : ${eliminationRate}%`}{" "}
            - Temps global : {globalTime / 60000} minutes - Temps après 1er
            gagnant : {timeAfterFirstGuess / 1000} secondes
          </Text>
          <Text textAlign={"center"} fontStyle={"italic"}>
            Langue : {language}
          </Text>
        </Box>

        <HStack mx="auto" my={4}>
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
            owner={player}
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
              language,
              nbLifePerPlayer,
              nbRounds,
              isPublic,
              currentGameId,
              lastGame,
              globalTime: globalTime / 60000,
              timeAfterFirstGuess: timeAfterFirstGuess / 1000,
              eliminationRate,
            }}
          />
          <Button
            isDisabled={playerId !== owner || playerList.length < 2}
            colorScheme={"green"}
            onClick={startGame}
          >
            Commencer
          </Button>
        </HStack>

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
      </Flex>
    </>
  );
};
