import { Box, Button, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Layout } from "../components/Layout";
import { PlayerGrid } from "../components/player-grid/PlayerGrid";
import { guessWord } from "../utils/api";
import { serverHttpUrl } from "../utils/const";
import { useClassicWordInput, useDictionary } from "../utils/hooks";
import {
  KeyboardSettings,
  MyFocus,
  SoloGameState,
  StartGameResponse,
} from "../utils/types";
import { getClassicKeyboardSettings, isWordCorrect } from "../utils/utils";

interface SoloProps {}

const NOT_ENOUGH_LETTER = "NOLETTER";
const NOT_IN_DICTIONARY = "NODICTIONARY";

const Solo: React.FC<SoloProps> = ({}) => {
  const [gameState, setGameState] = useState<SoloGameState | null>(null);
  const [word, setWord] = useState("");
  const [focus, setFocus] = useState<MyFocus>({
    index: 1,
    isBorder: false,
    focusMode: "overwrite",
    firstLetterWritable: false,
  });

  const dictionary = useDictionary();

  const startGame = () => {
    axios
      .post<StartGameResponse>(`${serverHttpUrl}/start_game`, {
        mode: "solo",
      })
      .then(({ data: { firstLetter, id, length, nb_life } }) => {
        setGameState({
          firstLetter: firstLetter.toUpperCase(),
          isFinished: false,
          nbLife: nb_life,
          triesHistory: [],
          wordLength: length,
          hasWon: false,
          wordId: id,
        });
        setWord(firstLetter.toUpperCase());
      });
  };
  useEffect(() => {
    // Request the word when mounted
    startGame();
  }, []);

  const toast = useToast();

  const onEnter = async () => {
    if (gameState === null) {
      return;
    }
    const { nbLife, triesHistory, wordId, wordLength } = gameState;

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
    // Guess will be counted
    setFocus((focus) => {
      return { ...focus, index: 1, isBorder: false };
    });

    const { result, word: actualWord } = await guessWord(lowerCaseWord, wordId);

    let newState = {
      ...gameState,
      triesHistory: [
        ...triesHistory,
        {
          result,
          wordTried: word,
        },
      ],
    };
    setWord(firstLetter);

    if (isWordCorrect(result)) {
      setGameState({ ...newState, isFinished: true, hasWon: true });
      toast({
        title: "Gagné !",
        status: "success",
        isClosable: true,
        duration: 2500,
      });
      return;
    }

    if (triesHistory.length + 1 === nbLife) {
      setGameState({ ...newState, isFinished: true, hasWon: false });
      toast({
        title: `Perdu ! le mot était : ${actualWord}`,
        status: "error",
        isClosable: true,
        duration: 2500,
      });
      return;
    }

    setGameState(newState);
  };

  useClassicWordInput(
    word,
    setWord,
    gameState?.wordLength ?? 0,
    onEnter,
    focus,
    setFocus,
    word.charAt(0).toUpperCase(),
    gameState?.isFinished
  );

  if (gameState === null) {
    return (
      <Flex>
        <Spinner mt={6} mx="auto" size="xl" />
      </Flex>
    );
  }

  const { hasWon, triesHistory, firstLetter, nbLife, wordLength, isFinished } =
    gameState;

  const keyboardSettings: KeyboardSettings = getClassicKeyboardSettings(
    onEnter,
    setWord,
    focus,
    setFocus,
    wordLength
  );

  return (
    <Layout>
      {hasWon && <Confetti />}
      <Flex direction={"column"} alignContent={"center"}>
        <Text mb={5} align="center" fontSize={"larger"}>
          Partie Solo
        </Text>
        <PlayerGrid
          isFinished={isFinished}
          firstLetter={firstLetter}
          wordLength={wordLength}
          nbLife={nbLife}
          word={word}
          triesHistory={triesHistory}
          keyboardSetting={keyboardSettings}
          focus={focus}
        />
        {isFinished && (
          <Box mt={6} mx="auto">
            <Button colorScheme={"green"} onClick={startGame}>
              Rejouer ?
            </Button>
          </Box>
        )}
      </Flex>
    </Layout>
  );
};

export default Solo;
