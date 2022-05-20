import { HStack } from "@chakra-ui/react";
import React from "react";
import { LetterResult } from "../../utils/types";
import { PlayerGridCase } from "./PlayerGridCase";

interface PlayerGridRowProps {
  word: string;
  // firstLetter: string;
  wordLength: number;
  letterResults?: LetterResult[];
  isVisible?: boolean;
}

export const PlayerGridRow: React.FC<PlayerGridRowProps> = ({
  word,
  wordLength: length,
  letterResults,
}) => {
  let playerRow = [...word.slice(0, word.length)].map((letter, index) => {
    return (
      <PlayerGridCase
        key={index}
        letter={letter}
        letterResult={letterResults && letterResults[index]}
      />
    );
  });

  while (playerRow.length < length) {
    playerRow.push(<PlayerGridCase key={playerRow.length} />);
  }

  return <HStack spacing={1}>{playerRow}</HStack>;
};
