import { HStack } from "@chakra-ui/react";
import React from "react";
import { LetterResult } from "../../utils/types";
import { PlayerGridCase } from "./PlayerGridCase";

interface PlayerGridRowProps {
  word: string;
  // firstLetter: string;
  wordLength: number;
  isCurrentAttempt: boolean;
  letterResults?: LetterResult[];
}

export const PlayerGridRow: React.FC<PlayerGridRowProps> = ({
  word,
  wordLength: length,
  letterResults,
  // firstLetter,
  isCurrentAttempt,
}) => {
  let playerRow: JSX.Element[] = [...word.slice(0, word.length)].map(
    (letter, index) => {
      return (
        <PlayerGridCase
          key={index}
          letter={letter}
          letterResult={
            letterResults !== undefined ? letterResults[index] : undefined
          }
        />
      );
    }
  );
  // if (isCurrentAttempt) {
  //   playerRow.push(
  //     ...[...word.slice(1, word.length)].map((letter, index) => {
  //       return <PlayerGridCase key={index + 1} letter={letter} />;
  //     })
  //   );
  // }
  //  else {
  //   for (let i = 0; i < length; i++) {
  //     if (i === 0) {
  //       return <PlayerGridCase key={i} letter={firstLetter} />;
  //     } else {
  //       return <PlayerGridCase key={i} />;
  //     }
  //   }
  // }

  while (playerRow.length < length) {
    playerRow.push(<PlayerGridCase key={playerRow.length} />);
  }

  return <HStack spacing={0}>{playerRow}</HStack>;
};
