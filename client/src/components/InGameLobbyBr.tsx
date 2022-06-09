import { Box, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import {
  addBrEvent,
  addGuessWordBrBroadcast,
  guessWordBr,
  removeBrEvent,
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
  MyFocus,
} from "../utils/types";
import { PlayerGrid } from "./player-grid/PlayerGrid";
import { SmallPlayerGrid } from "./player-grid/SmallPlayerGrid";
import { getClassicKeyboardSettings } from "../utils/utils";
import { Chrono } from "./Chrono";

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
  //The number of player in the game
  const [numberPlayer, setNumberPlayer] = useState(gameInfo.playerList.length);
  //the word the player try
  const [word, setWord] = useState("");

  //Array of all the game state for each player
  const [gameState, setGameState] = useState<BrGameState[]>([]);
  const dictionary = useDictionary();
  const socket = useSocket();

  const isChatting = useIsChatting();

  const [endPoint, setEndPoint] = useState(gameInfo.endTime);

  //the focus in the grid
  const [focus, setFocus] = useState<MyFocus>({
    index: 1,
    isBorder: false,
    focusMode: "overwrite",
  });

  //start the game
  const startGame = () => {
    //the first player
    setNumberPlayer(gameInfo.playerList.length);
    let newGameState = [];
    newGameState.push({
      playerId: player.id,
      firstLetter: gameInfo.firstLetter.toUpperCase(),
      isFinished: false,
      nbLife: 6,
      triesHistory: [],
      wordLength: gameInfo.length,
      hasWon: false,
      wordId: gameInfo.id,
    });
    //the other player
    gameInfo.playerList.forEach((pl) => {
      if (player.id !== pl.id) {
        newGameState.push({
          playerId: pl.id,
          firstLetter: gameInfo.firstLetter.toUpperCase(),
          isFinished: false,
          nbLife: 6,
          triesHistory: [],
          wordLength: gameInfo.length,
          hasWon: false,
          wordId: gameInfo.id,
        });
      }
    });
    setGameState(newGameState);
    setWord(gameInfo.firstLetter.toUpperCase());
  };

  //load the new word
  const resetGame = (gameBr: BrGameInfo) => {
    //check if the player win the previous word
    let playerIn =
      gameBr.playerList.find((pl) => {
        return pl.id === player.id;
      }) !== undefined;
    if (playerIn) {
      setEndPoint(gameBr.endTime);
      let newGameState = [];
      //the first player
      newGameState.push({
        playerId: player.id,
        firstLetter: gameBr.firstLetter.toUpperCase(),
        isFinished: false,
        nbLife: 6,
        triesHistory: [],
        wordLength: gameBr.length,
        hasWon: false,
        wordId: gameBr.id,
        isVisible: true,
      });
      //the other player
      setNumberPlayer(gameBr.playerList.length);
      gameBr.playerList.forEach((pl) => {
        if (player.id !== pl.id) {
          newGameState.push({
            playerId: pl.id,
            firstLetter: gameBr.firstLetter.toUpperCase(),
            isFinished: false,
            nbLife: 6,
            triesHistory: [],
            wordLength: gameBr.length,
            hasWon: false,
            wordId: gameBr.id,
            isVisible: true,
          });
        }
      });
      setGameState(newGameState);
      setWord(gameBr.firstLetter.toUpperCase());
      setEndPoint(gameBr.endTime);
    } else {
      // set the game for the looser
      setGameState((gameSate) =>
        gameSate.map((game) =>
          game.playerId === player.id
            ? { ...game, isFinished: true, hasWon: false }
            : { ...game }
        )
      );
    }
  };

  //useEffect base of the game
  useEffect(() => {
    //start the game
    startGame();
  }, []);

  //use effect for the socket exchange
  useEffect(() => {
    if (socket) {
      //the broadcast of the gessWordBr
      addGuessWordBrBroadcast(socket, player.id, setGameState);
      //all the other event
      addBrEvent(
        resetGame,
        socket,
        player.id,
        toast,
        setEndPoint,
        setGameState
      );
    }
    return () => {
      //remove all the event
      removeBrEvent(socket);
      socket?.emit("leave_game", {gameId:gameInfo.id, playerId:player.id, lobbyId:""}, () => {})
    };
  }, [socket]);

  const toast = useToast();

  const onTimeFinish = () => {
    setGameState(
      gameState.map((game) =>
        game.playerId === player.id
          ? { ...game, isFinished: true, hasWon: false }
          : { ...game }
      )
    );
  };

  const onEnter = async () => {
    if (gameState === null) {
      return;
    }
    //the param of the current player
    const { nbLife, triesHistory, wordLength } = gameState[0];

    const lowerCaseWord = word.toLowerCase();

    //check the number of letter
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

    //check the word
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

    // Word taken into account
    setFocus((focus) => {
      return { ...focus, index: 1, isBorder: false };
    });

    //check the word
    let result = await new Promise<number[]>((resolve) =>
      guessWordBr(lowerCaseWord, gameInfo.id, player.id, socket, (arg) => {
        if (arg.success) {
          resolve(arg.data);
        } else {
          resolve([]);
        }
      })
    );
    //set the triesHistory
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

    //change the gameState of the player
    setGameState((gameState) =>
      gameState.map((game) =>
        game.playerId === player.id ? { ...newState } : { ...game }
      )
    );

    //check if the word is find
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

    //check if the number of try exceed the nbLife
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
    gameState[0]?.wordLength ?? 0,
    onEnter,
    focus,
    setFocus,
    gameState[0]?.isFinished || isChatting
  );

  const keyboardSettings: KeyboardSettings = getClassicKeyboardSettings(
    onEnter,
    setWord,
    focus,
    setFocus,
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
  //the param of the current player
  const { hasWon, triesHistory, firstLetter, nbLife, wordLength, isFinished } =
    gameState[0];

  //the component of the player, any[] to use the pop function
  const grid = [];
  // save the grid of player, any[] to use the pop function
  const items = [];
  let j = 0;
  for (let i = 1; i < numberPlayer; ) {
    // 1 because 0 is the player
    for (j = 0; j < 6 && i < numberPlayer; j++) {
      const { triesHistory, nbLife, wordLength, playerId } =
        gameState?.[i] || {};
      items.push(
        <SmallPlayerGrid
          key={playerId}
          wordLength={wordLength}
          nbLife={nbLife}
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
