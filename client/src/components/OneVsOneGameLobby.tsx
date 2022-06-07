import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import {
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
  Game1vs1,
  KeyboardSettings,
  MyFocus,
  Player,
  TriesHistory,
} from "../utils/types";
import { getClassicKeyboardSettings } from "../utils/utils";
import { Chrono } from "./Chrono";
import { PlayerGrid } from "./player-grid/PlayerGrid";

interface OneVsOneGameLobbyProps {
  player: Player;
  gameState: Game1vs1;
}

export const OneVsOneGameLobby: React.FC<OneVsOneGameLobbyProps> = ({
  player: { id: playerId, name, lobbyId },
  gameState: {
    playerOne,
    playerTwo,
    firstLetter,
    id: gameId,
    length: game_length,
    endTime,
  },
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
  });

  const adversaire: { id: string; name: string; nb_life: number } =
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
        setEndPoint
      );
    }
    return () => {
      if (socket) {
        lobbyOneVsOneRemoveEvents(socket);
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
              nbLife={6}
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
        {!isFinished && (
          <Chrono endPoint={endPoint} onTimeFinish={onTimeFinish}></Chrono>
        )}
        <PlayerGrid
          focus={focus}
          isVisible={true}
          wordLength={game_length}
          nbLife={6}
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
