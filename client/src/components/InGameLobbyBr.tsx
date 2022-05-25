import { Box, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import {
  addBrEvent,
  addGuessWordBrBroadcast,
  guessWordBr,
} from "src/utils/api";
import { useClassicWordInput, useDictionary, useSocket } from "src/utils/hooks";
import { isWordCorrect } from "src/utils/utils";
import {
  Player,
  BrGameState,
  BrGameInfo,
  KeyboardSettings,
} from "../utils/types";
import { PlayerGrid } from "./player-grid/PlayerGrid";
import { SmallPlayerGrid } from "./player-grid/SmallPlayerGrid";
import { getClassicKeyboardSettings } from "../utils/utils";

interface InGameLobbyBrProps {
  player: Player;
  gameInfo: BrGameInfo;
}

const NOT_ENOUGH_LETTER = "NOLETTER";
const NOT_IN_DICTIONARY = "NODICTIONARY";

export const InGameLobbyBr: React.FC<InGameLobbyBrProps> = ({
  player,
  gameInfo,
}) => {
  const [numberPlayer, setNumberPlayer] = useState(gameInfo.playerList.length);
  const [word, setWord] = useState("");
  const [gameState, setGameState] = useState<BrGameState[]>([]);
  const dictionary = useDictionary();
  const socket = useSocket();
  // const [result, setResult] = useState<LetterResult[]>([]);
  const startGame = (gameBr: BrGameInfo) => {
    setNumberPlayer(gameBr.playerList.length);
    setGameState((game) => [
      ...game,
      {
        playerId: player.id,
        firstLetter: gameInfo.firstLetter.toUpperCase(),
        isFinished: false,
        nbLife: 6,
        triesHistory: [],
        wordLength: gameInfo.length,
        hasWon: false,
        wordId: gameInfo.id,
        isVisible: true,
      },
    ]);
    gameBr.playerList.forEach((pl) => {
      if (player.id !== pl.id) {
        setGameState((game) => [
          ...game,
          {
            playerId: pl.id,
            firstLetter: gameInfo.firstLetter.toUpperCase(),
            isFinished: false,
            nbLife: 6,
            triesHistory: [],
            wordLength: gameInfo.length,
            hasWon: false,
            wordId: gameInfo.id,
            isVisible: true,
          },
        ]);
      }
    });
    setWord(gameBr.firstLetter.toUpperCase());
  };
  useEffect(() => {
    // Request the word when mounted
    startGame(gameInfo);
    addGuessWordBrBroadcast(socket, player.id, setGameState);
    addBrEvent(startGame, socket);
  }, []);
  const toast = useToast();
  const onEnter = async () => {
    if (gameState === null) {
      return;
    }
    const { nbLife, triesHistory, wordLength } = gameState[0];

    const lowerCaseWord = word.toLowerCase();
    if (lowerCaseWord.length !== wordLength) {
      !toast.isActive(NOT_ENOUGH_LETTER) &&
        toast({
          id: NOT_ENOUGH_LETTER,
          title: "Pas assez de lettres !",
          status: "error",
          isClosable: true,
          duration: 2500,
        });
      return;
    }

    if (!dictionary.has(lowerCaseWord)) {
      !toast.isActive(NOT_IN_DICTIONARY) &&
        toast({
          id: NOT_IN_DICTIONARY,
          title: "Le mot n'est pas dans le dictionnaire",
          status: "error",
          isClosable: true,
          duration: 2500,
        });
      return;
    }
    let result = await new Promise<number[]>((resolve) =>
      guessWordBr(lowerCaseWord, gameInfo.id, player.id, socket, (arg) => {
        console.log("arg : ", arg);
        if (arg.success) {
          resolve(arg.data);
        } else {
          resolve([]);
        }
      })
    );
    console.log("guessWordBr finish result : ", result);
    let newState = {
      ...gameState?.[0],
      triesHistory: [
        ...triesHistory,
        {
          result,
          wordTried: word,
        },
      ],
    };

    console.log("newState : ", newState);
    setWord(firstLetter);

    setGameState((gameState) =>
      gameState.map((game) =>
        game.playerId === player.id ? { ...newState } : { ...game }
      )
    );
    console.log("gameState triesHistory : ", gameState);
    if (isWordCorrect(result)) {
      setGameState(
        gameState.map((game) =>
          game.playerId === player.id
            ? { ...newState, isFinished: true, hasWon: true }
            : { ...game }
        )
      );
      toast({
        title: "GGEZ 😎",
        status: "success",
        isClosable: true,
        duration: 2500,
      });
    }
    if (triesHistory.length + 1 === nbLife) {
      setGameState(
        gameState.map((game) =>
          game.playerId === player.id
            ? { ...newState, isFinished: true, hasWon: false }
            : { ...game }
        )
      );
      toast({
        title: "Perdu ! Sadge",
        status: "error",
        isClosable: true,
        duration: 2500,
      });
    }
  };
  useClassicWordInput(
    word,
    setWord,
    gameState?.[0]?.wordLength ?? 0,
    onEnter,
    gameState?.[0]?.isFinished
  );
  const keyboardSettings: KeyboardSettings = getClassicKeyboardSettings(
    onEnter,
    setWord,
    gameInfo.length
  );

  if (gameState === null || gameState[0] === undefined) {
    return (
      <Flex>
        <Spinner mt={6} mx="auto" size="xl" />
      </Flex>
    );
  }
  const { hasWon, triesHistory, firstLetter, nbLife, wordLength, isFinished } =
    gameState[0];
  const grid = [];
  // save the grid of player
  const items: any[] = [];
  let j = 0;
  for (let i = 1; i < numberPlayer; ) {
    // 1 because 0 is the player
    for (j = 0; j < 6 && i < numberPlayer; j++) {
      const {
        hasWon,
        triesHistory,
        firstLetter,
        nbLife,
        wordLength,
        isFinished,
        isVisible,
      } = gameState?.[i] || {};
      items.push(
        <SmallPlayerGrid
          isVisible={isVisible}
          firstLetter={firstLetter}
          wordLength={wordLength}
          nbLife={nbLife}
          word={word}
          triesHistory={triesHistory}
          nbPlayer={numberPlayer}
        />
      );
      i++;
    }
    grid.push(
      <Flex direction={"column"} alignContent={"center"}>
        {items.slice(i - 1 - j, i - 1)}
      </Flex>
    );
  }
  return (
    <>
      {hasWon && <Confetti />}
      <Box>
        <Flex marginLeft={10} direction={"row"} alignContent={"center"}>
          {grid}
        </Flex>
      </Box>
      <Box>
        <Text align="center" fontSize="large">
          {player.name}
        </Text>
        <PlayerGrid
          isVisible={true}
          firstLetter={firstLetter}
          wordLength={wordLength}
          nbLife={nbLife}
          word={word}
          triesHistory={triesHistory}
          isFinished={isFinished}
          keyboardSetting={keyboardSettings}
        />
      </Box>
    </>
    // <Flex direction={"column"} align={"left"}>
    //   {hasWon && <Confetti />}
    //   <Text mb={5} align="center" fontSize={"larger"}>
    //     Partie Battle Royale
    //   </Text>
    //   <Flex direction={"row"} alignContent={"center"}>
    //     {grid}
    //     <Flex direction={"column"} alignContent={"center"}>
    //       <Text align="center" fontSize="large">
    //         {player.name}
    //       </Text>
    //       <PlayerGrid
    //         isVisible={true}
    //         firstLetter={firstLetter}
    //         wordLength={wordLength}
    //         nbLife={nbLife}
    //         word={word}
    //         triesHistory={triesHistory}
    //         isFinished={isFinished}
    //         keyboardSetting={keyboardSettings}
    //       />
    //     </Flex>
    //   </Flex>
    // </Flex>
  );
};
