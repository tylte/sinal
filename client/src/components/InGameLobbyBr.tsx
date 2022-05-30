import { Box, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import {
  addBrEvent,
  addGuessWordBrBroadcast,
  guessWordBr,
} from "src/utils/api";
import {
  useClassicWordInput,
  useDictionary,
  useIsChatting,
  useSocket,
} from "src/utils/hooks";
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
//to display the timer
const twoDigits = (num: number) => String(num).padStart(2, "0");

export const InGameLobbyBr: React.FC<InGameLobbyBrProps> = ({
  player,
  gameInfo,
}) => {
  //The number of player in the game
  const [numberPlayer, setNumberPlayer] = useState(gameInfo.playerList.length);
  const [word, setWord] = useState("");

  //Array of all the game state for each player
  const [gameState, setGameState] = useState<BrGameState[]>([]);
  const dictionary = useDictionary();
  const socket = useSocket();

  const isChatting = useIsChatting();

  //The time remaining for the timer in ms
  const [secondsRemaining, setSecondsRemaining] = useState(1);

  //the interval of the chrono
  const countRef = useRef<NodeJS.Timeout>(
    setInterval(() => {
      setSecondsRemaining((timer) => timer);
    }, 0)
  );

  //the chrono to display
  const secondsToDisplay = Math.trunc((secondsRemaining / 1000) % 60);
  const minutesRemaining = secondsRemaining / 1000 / 60;
  const minutesToDisplay = Math.trunc(minutesRemaining);

  //check if the time is finished
  const looseByTime = secondsRemaining <= 0;

  //start the game
  const startGame = () => {
    setGameState([]);
    setNumberPlayer(gameInfo.playerList.length);
    //Set the main player
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
    //set the other player
    gameInfo.playerList.forEach((pl) => {
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
    setWord(gameInfo.firstLetter.toUpperCase());

    //initialize the chrono
    clearInterval(countRef.current);
    if (gameInfo.endTime !== undefined) {
      setSecondsRemaining(gameInfo.endTime - Date.now());
    }
    countRef.current = setInterval(() => {
      setSecondsRemaining((timer) => timer - 1000);
    }, 1000);
  };

  //reset the game for the new word
  //TODO
  const resetGame = (gameBr: BrGameInfo) => {
    setGameState([]);
    setNumberPlayer(gameBr.playerList.length);
    setGameState((game) => [
      ...game,
      {
        playerId: player.id,
        firstLetter: gameBr.firstLetter.toUpperCase(),
        isFinished: false,
        nbLife: 6,
        triesHistory: [],
        wordLength: gameBr.length,
        hasWon: false,
        wordId: gameBr.id,
        isVisible: true,
      },
    ]);
    gameBr.playerList.forEach((pl) => {
      if (player.id !== pl.id) {
        setGameState((game) => [
          ...game,
          {
            playerId: pl.id,
            firstLetter: gameBr.firstLetter.toUpperCase(),
            isFinished: false,
            nbLife: 6,
            triesHistory: [],
            wordLength: gameBr.length,
            hasWon: false,
            wordId: gameBr.id,
            isVisible: true,
          },
        ]);
      }
    });
    setWord(gameBr.firstLetter.toUpperCase());

    //initialize the chrono
    clearInterval(countRef.current);
    if (gameBr.endTime !== undefined) {
      setSecondsRemaining(gameBr.endTime - Date.now());
    }
    countRef.current = setInterval(() => {
      setSecondsRemaining((timer) => timer - 1000);
    }, 1000);
  };

  //useEffect base of the game
  useEffect(() => {
    startGame();
    addGuessWordBrBroadcast(socket, player.id, setGameState);
    addBrEvent(
      resetGame,
      socket,
      player.id,
      toast,
      setSecondsRemaining,
      countRef,
      setGameState
    );
  }, []);

  const toast = useToast();

  //useEffect for the timer
  useEffect(() => {
    if (looseByTime) {
      clearInterval(countRef.current);
      toast({
        title: "perdu, le temps est dépassé",
        status: "error",
        isClosable: true,
        duration: 2500,
      });
      setGameState(
        gameState.map((game) =>
          game.playerId === player.id
            ? { ...game, isFinished: true, hasWon: false }
            : { ...game }
        )
      );
    }
  }, [looseByTime]);

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
        if (arg.success) {
          resolve(arg.data);
        } else {
          resolve([]);
        }
      })
    );
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
    setWord(firstLetter);

    setGameState((gameState) =>
      gameState.map((game) =>
        game.playerId === player.id ? { ...newState } : { ...game }
      )
    );
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
      //the game is finished so we stop the timer
      clearInterval(countRef.current);
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
      //the game is finished so we stop the timer
      clearInterval(countRef.current);
    }
  };

  useClassicWordInput(
    word,
    setWord,
    gameState?.[0]?.wordLength ?? 0,
    onEnter,
    gameState?.[0]?.isFinished || isChatting
  );

  const keyboardSettings: KeyboardSettings = getClassicKeyboardSettings(
    onEnter,
    setWord,
    gameInfo.length
  );

  //check if the game starting
  if (gameState === null || gameState[0] === undefined) {
    return (
      <Flex>
        <Spinner mt={6} mx="auto" size="xl" />
      </Flex>
    );
  }
  const { hasWon, triesHistory, firstLetter, nbLife, wordLength, isFinished } =
    gameState[0];

  //the component of the player
  const grid = [];
  // save the grid of player
  const items: any[] = [];
  let j = 0;
  for (let i = 1; i < numberPlayer; ) {
    // 1 because 0 is the player
    for (j = 0; j < 6 && i < numberPlayer; j++) {
      const {
        triesHistory,
        firstLetter,
        nbLife,
        wordLength,
        isVisible,
        playerId,
      } = gameState?.[i] || {};
      items.push(
        <SmallPlayerGrid
          key={playerId}
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
      <Flex key={i} direction={"column"} alignContent={"center"}>
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
        <Box as="span">
          <Text
            color={
              !hasWon && minutesToDisplay <= 0 && secondsToDisplay <= 30
                ? "red"
                : "white"
            }
            align="center"
            fontSize="larger"
          >
            {isFinished && hasWon && "GAGNER"}
            {isFinished && !hasWon && "PERDUE"}
          </Text>
          {!isFinished && !hasWon && (
            <Text
              color={
                !hasWon && minutesToDisplay <= 0 && secondsToDisplay <= 30
                  ? "red"
                  : "white"
              }
              align="center"
              fontSize="larger"
            >
              {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
            </Text>
          )}
        </Box>
        <PlayerGrid
          isVisible={true}
          firstLetter={firstLetter}
          wordLength={wordLength}
          nbLife={nbLife}
          word={word}
          triesHistory={triesHistory}
          isFinished={isFinished || isChatting}
          keyboardSetting={keyboardSettings}
        />
      </Box>
    </>
  );
};
