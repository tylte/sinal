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

  const onWordEnter = (word: string) => {
    setWord((word) => firstLetter);
    setTriesHistory((triesHistory) => [
      ...triesHistory,
      { result: [LetterResult.FOUND], wordTried: word },
    ]);
  };

  useClassicWordInput(word, setWord, wordLength, onWordEnter);
  // useWordInput(word, wordLength, onWordEnter, (e: KeyboardEvent) => {
  //   console.log("word : ", word);
  //   // Only one alphabetic caracter in the key (more detail https://www.toptal.com/developers/keycode/for/alt)
  //   const re = /^([a-zA-Z]{1})$/;
  //   if (re.test(e.key)) {
  //     setWord((word) => {
  //       let newCharacter = e.key.toUpperCase();
  //       if (word.length < wordLength) {
  //         return word + newCharacter;
  //       } else {
  //         return word;
  //       }
  //     });
  //   } else if (e.key === "Backspace") {
  //     // Remove last character of the word
  //     setWord((word) => {
  //       if (word.length > 1) {
  //         // Cannot remove first letter
  //         return word.slice(0, word.length - 1);
  //       } else {
  //         return word;
  //       }
  //     });
  //   } else if (e.key === "Enter" && word.length === wordLength) {
  //     // Function coming from props to let upper components decide what to do
  //     onWordEnter(word);
  //   }
  // });

  return (
    <Layout>
      <PlayerGrid
        isPlayer={true}
        wordLength={wordLength}
        nbLife={7}
        triesHistory={triesHistory}
        word={word}
        // setWord={setWord}
      />
    </Layout>
  );
};

export default Test;
