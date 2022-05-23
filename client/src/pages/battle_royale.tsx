import { Box, Button, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Layout } from "../components/Layout";
import { PlayerGrid } from "../components/player-grid/PlayerGrid";
import { guessWordBr } from "../utils/api";
import { useClassicWordInput, useDictionary } from "../utils/hooks";
import { BrGameState, StartGameResponse } from "../utils/types";
import { isWordCorrect } from "../utils/utils";

interface BattleRoyaleProps {}

const NOT_ENOUGH_LETTER = "NOLETTER";
const NOT_IN_DICTIONARY = "NODICTIONARY";

const BattleRoyale: React.FC<BattleRoyaleProps> = ({}) => {
  const [gameState, setGameState] = useState<BrGameState | null>(null);
  const [word, setWord] = useState("");

  const dictionary = useDictionary();

  const startGame = () => {
    axios
      .post<StartGameResponse>("http://localhost:4000/start_game", {
        mode: "BattleRoyale",
      })
      .then(({ data: { first_letter, id, length, nb_life } }) => {
        setGameState({
          firstLetter: first_letter.toUpperCase(),
          isFinished: false,
          nbLife: nb_life,
          triesHistory: [],
          wordLength: length,
          hasWon: false,
          wordId: id,
        });
        setWord(first_letter.toUpperCase());
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
    // const { nbLife, triesHistory, wordId, wordLength } = gameState;

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
    let newState;
    await guessWordBr(lowerCaseWord, player.lobbyId, player.id, socket, (result) => {
      newState = {
        ...gameState,
        triesHistory: [
          ...triesHistory,
          {
            result,
            wordTried: word,
          },
        ],
      };
    });

    setWord(firstLetter);

    if (isWordCorrect(result)) {
      setGameState({ ...newState, isFinished: true, hasWon: true });
      toast({
        title: "GGEZ 😎",
        status: "success",
        isClosable: true,
        duration: 2500,
      });
      return;
    }

    if (triesHistory.length + 1 === nbLife) {
      setGameState({ ...newState, isFinished: true, hasWon: false });
      toast({
        title: "Perdu ! Sadge",
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

  return (
    <Layout>
      {hasWon && <Confetti />}
      <Flex direction={"column"} alignContent={"center"}>
        <Text mb={5} align="center" fontSize={"larger"}>
          Partie Battle Royale
        </Text>
        <PlayerGrid
          isVisible={true}
          firstLetter={firstLetter}
          wordLength={wordLength}
          nbLife={nbLife}
          word={word}
          triesHistory={triesHistory}
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

export default BattleRoyale;
