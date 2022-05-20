import { Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { PlayerGrid } from "../components/player-grid/PlayerGrid";
import { guessWord } from "../utils/api";
import { useClassicWordInput, useDictionary } from "../utils/hooks";
import { StartGameResponse, TriesHistory } from "../utils/types";
import { isWordCorrect } from "../utils/utils";

interface SoloProps {}

const NO_TRY_LEFT_ID = "NOTRY";
const NOT_ENOUGH_LETTER = "NOLETTER";
const NOT_IN_DICTIONARY = "NODICTIONARY";

const Solo: React.FC<SoloProps> = ({}) => {
  const [wordLength, setWordLength] = useState<number | null>(null);
  const [wordId, setWordId] = useState<string | null>(null);
  const [firstLetter, setFirstLetter] = useState<string | null>(null);
  const [nbLife, setNbLife] = useState<null | number>(null);
  const dictionary = useDictionary();

  useEffect(() => {
    // Request the word when mounted
    axios
      .post<StartGameResponse>("http://localhost:4000/start_game", {
        mode: "solo",
      })
      .then(({ data: { first_letter, id, length, nb_life } }) => {
        setWordLength(length);
        setFirstLetter(first_letter.toUpperCase());
        setWordId(id);
        setNbLife(nb_life);
        setWord(first_letter.toUpperCase());
      });
  }, []);

  const [triesHistory, setTriesHistory] = useState<TriesHistory[]>([]);
  const [word, setWord] = useState<string>("");
  const [hasWon, setHasWon] = useState(false);

  const toast = useToast();

  const onEnter = async () => {
    if (nbLife === null || firstLetter === null || wordId === null) {
      return;
    }
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

    if (triesHistory.length >= nbLife) {
      !toast.isActive(NO_TRY_LEFT_ID) &&
        toast({
          id: NO_TRY_LEFT_ID,
          title: "Vous n'avez plus d'essais !",
          status: "error",
          isClosable: true,
          duration: 2500,
        });
    }

    const result = await guessWord(lowerCaseWord, wordId);

    setTriesHistory((triesHistory) => [
      ...triesHistory,
      {
        result,
        wordTried: word,
      },
    ]);

    setWord(firstLetter);

    if (isWordCorrect(result)) {
      setHasWon(true);
      toast({
        title: "GGEZ 😎",
        status: "success",
        isClosable: true,
        duration: 2500,
      });
    }
  };

  useClassicWordInput(word, setWord, wordLength ?? 0, onEnter, hasWon);

  return (
    <Layout>
      <Text mb={5} align="center" fontSize={"larger"}>
        Partie Solo
      </Text>
      {nbLife === null ||
      wordId === null ||
      wordLength === null ||
      firstLetter === null ? (
        <Spinner />
      ) : (
        <PlayerGrid
          isPlayer={true}
          firstLetter={firstLetter}
          wordLength={wordLength}
          nbLife={nbLife}
          word={word}
          triesHistory={triesHistory}
        />
      )}
      {/* <NewGameModal isOpen={gameStatus.isFinished && !gameStatus.isWon} status={"error"} onClose={newGameOnClose} title={"PERDU"}description={
        "Vous avez perdu votre partie voulez vous en refaire une ?"
      } />
      <NewGameModal isOpen={gameStatus.isFinished && gameStatus.isWon} status={"success"} onClose={onClose} title={"GAGNER"} description={
        "Vous avez gagné votre partie voulez vous en refaire une ?"
      } /> */}
    </Layout>
  );
};

export default Solo;
