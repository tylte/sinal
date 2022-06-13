import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Confetti from "react-confetti";
import {
  leaveGame,
  lobbyOneVsOneAddEvents,
  lobbyOneVsOneRemoveEvents,
} from "../utils/api";
import {
  useClassicWordInput,
  useDictionary,
  useIsChatting,
  useSocket,
} from "../utils/hooks";
import {
  BrGameInfo,
  Game1vs1,
  KeyboardSettings,
  Lobby,
  MyFocus,
  Player,
  Player1vs1,
  TriesHistory,
} from "../utils/types";
import { getClassicKeyboardSettings } from "../utils/utils";
import { Chrono } from "./Chrono";
import { PlayerGrid } from "./player-grid/PlayerGrid";

interface OneVsOneGameLobbyProps {
  player: Player;
  gameState: Game1vs1;
  lobby: Lobby;
  setGameState: Dispatch<SetStateAction<Game1vs1 | BrGameInfo | null>>;
}

export const OneVsOneGameLobby: React.FC<OneVsOneGameLobbyProps> = ({
  player: { id: playerId, name },
  gameState: {
    playerOne,
    playerTwo,
    firstLetter,
    id: gameId,
    length: game_length,
    endTime,
    roundNumber,
    nbRoundsTotal,
  },
  lobby: lobby,
  setGameState,
}) => {
  const socket = useSocket();
  const dictionary = useDictionary();
  const toast = useToast();
  const isChatting = useIsChatting();

  // TriesHistory of the player and his opponent.
  const [tryHistory, setTryHistory] = useState<TriesHistory[]>([]);
  const [tryHistoryP2, setTryHistoryP2] = useState<TriesHistory[]>([]);

  // Word of the player and his opponent.
  const [word, setWord] = useState(firstLetter.toUpperCase());
  const [wordP2, setWordP2] = useState(firstLetter.toUpperCase());

  const [hasWon, setHasWon] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [endPoint, setEndPoint] = useState(endTime);

  const [focus, setFocus] = useState<MyFocus>({
    index: 1,
    isBorder: false,
    focusMode: "overwrite",
    firstLetterWritable: false,
  });

  const adversaire: Player1vs1 =
    playerOne.id !== playerId ? playerOne : playerTwo;

  useEffect(() => {
    if (socket) {
      lobbyOneVsOneAddEvents(
        socket,
        toast,
        playerId,
        setHasWon,
        tryHistoryP2,
        setTryHistoryP2,
        setWordP2,
        setIsFinished,
        setEndPoint,
        setGameState,
        setTryHistory,
        setWord
      );
    }
    return () => {
      if (socket) {
        lobbyOneVsOneRemoveEvents(socket);
        //leave the game
        leaveGame(socket, playerId, gameId, lobby.id);
      }
    };
  }, [socket]);

  useEffect(() => {
    socket?.emit("update_word", { word, gameId, playerId });
  }, [word]);

  const onEnter = () => {
    if (word.length !== game_length) {
      !toast.isActive("NO LETTER") &&
        toast({
          id: "NO LETTER",
          title: "Pas assez de lettres !",
          status: "error",
          isClosable: true,
          duration: 2500,
        });
      return;
    }

    if (!dictionary.has(word.toLowerCase())) {
      !toast.isActive("NODICTIONARY") &&
        toast({
          id: "NODICTIONARY",
          title: "Le mot n'est pas dans le dictionnaire",
          status: "error",
          isClosable: true,
          duration: 2500,
        });
      return;
    }
    // Word taken into account
    setFocus((focus) => {
      return { ...focus, index: 1, isBorder: false };
    });

    socket?.emit(
      "guess_word_1vs1",
      {
        word: word.toLowerCase(),
        gameId: gameId,
        playerId,
        lobbyId: lobby.id,
      },
      (res: any) => {
        setTryHistory([...tryHistory, { result: res.data, wordTried: word }]);
      }
    );

    setWord(firstLetter.toUpperCase());
  };

  const onTimeFinish = () => {
    setHasWon(false);
    setIsFinished(true);
  };

  useClassicWordInput(
    word,
    setWord,
    game_length,
    onEnter,
    focus,
    setFocus,
    firstLetter.toUpperCase(),
    isFinished || isChatting
  );

  const keyboardSettings: KeyboardSettings = getClassicKeyboardSettings(
    onEnter,
    setWord,
    focus,
    setFocus,
    game_length
  );

  return (
    <>
      <Box p={8}>
        <Flex height="100%" direction={"column"}>
          <Box m="auto">
            <Text mb="4" align={"center"}>
              {adversaire.name}
            </Text>
            <PlayerGrid
              isVisible={false}
              wordLength={game_length}
              nbLife={playerOne.nbLife}
              firstLetter={firstLetter}
              word={wordP2}
              triesHistory={tryHistoryP2}
              isFinished={isFinished || isChatting}
            />
          </Box>
        </Flex>
      </Box>
      <Box>
        {hasWon && <Confetti />}
        <Text mb="4" align={"center"}>
          {name}
        </Text>
        {/* the result of the game */}
        {isFinished && (
          <Text
            color={!hasWon ? "red" : "white"}
            align="center"
            fontSize="larger"
          >
            {hasWon && "GAGNER"}
            {!hasWon && "PERDU"}
          </Text>
        )}
        <Text align={"center"}>
          Round {roundNumber}/{nbRoundsTotal}
        </Text>
        {!isFinished && (
          <Chrono endPoint={endPoint} onTimeFinish={onTimeFinish}></Chrono>
        )}
        <PlayerGrid
          focus={focus}
          isVisible={true}
          wordLength={game_length}
          nbLife={playerOne.nbLife}
          firstLetter={firstLetter.toUpperCase()}
          word={word}
          triesHistory={tryHistory}
          keyboardSetting={keyboardSettings}
          isFinished={isFinished}
        />
      </Box>
    </>
  );
};
