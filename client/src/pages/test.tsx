import { useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { PlayerGrid } from "../components/player-grid/PlayerGrid";
import { useClassicWordInput } from "../utils/hooks";
import { LetterResult, TriesHistory } from "../utils/types";

interface TestProps {}

const Test: React.FC<TestProps> = ({}) => {
  const firstLetter = "W";
  const wordLength = 8;

  const [triesHistory, setTriesHistory] = useState<TriesHistory[]>([]);
  const [word, setWord] = useState<string>(firstLetter);
  console.log("wordTried : ", triesHistory);
  const toast = useToast();
  const nbLife = 7;

  const onEnter = () => {
    if (word.length === wordLength) {
      if (triesHistory.length < nbLife) {
        setTriesHistory((triesHistory) => [
          ...triesHistory,
          {
            result: [
              LetterResult.FOUND,
              LetterResult.NOT_FOUND,
              LetterResult.FOUND,
              LetterResult.RIGHT_POSITION,
              LetterResult.FOUND,
              LetterResult.FOUND,
              LetterResult.NOT_FOUND,
              LetterResult.RIGHT_POSITION,
            ],
            wordTried: word,
          },
        ]);
        setWord(firstLetter);
      } else {
        toast({ title: "Vous n'avez plus d'essais !", status: "error" });
      }
    } else {
      toast({ title: "Pas assez de lettres !", status: "error" });
    }
  };

  useClassicWordInput(word, setWord, wordLength, onEnter, false);

  return (
    <Layout>
      <PlayerGrid
        isPlayer={true}
        wordLength={wordLength}
        nbLife={nbLife}
        triesHistory={triesHistory}
        word={word}
        // setWord={setWord}
      />
    </Layout>
  );
};

export default Test;
