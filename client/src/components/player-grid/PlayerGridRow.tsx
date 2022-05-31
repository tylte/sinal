import { HStack } from "@chakra-ui/react";
import React from "react";
import { LetterResult, MyFocus } from "../../utils/types";
import { PlayerGridCase } from "./PlayerGridCase";

interface PlayerGridRowProps {
  word: string;
  // firstLetter: string;
  wordLength: number;
  letterResults?: LetterResult[];
  isVisible?: boolean;
  focus?: MyFocus;
}

export const PlayerGridRow: React.FC<PlayerGridRowProps> = ({
  word,
  wordLength: length,
  letterResults,
  isVisible,
  focus,
}) => {
  let playerRow = [...word].map((letter, index) => {
    return (
      <PlayerGridCase
        key={index}
        letter={letter}
        isVisible={isVisible}
        letterResult={letterResults && letterResults[index]}
        focus={focus?.index === index ? focus : undefined}
      />
    );
  });
  let index = word.length;
  while (playerRow.length < length) {
    playerRow.push(
      <PlayerGridCase
        isVisible={isVisible}
        key={playerRow.length}
        focus={focus?.index === index ? focus : undefined}
      />
    );
    index++;
  }

  return <HStack spacing={1}>{playerRow}</HStack>;
};
