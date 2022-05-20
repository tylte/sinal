import { Stack } from "@chakra-ui/react";
import React from "react";
import { TriesHistory } from "../../utils/types";
import { PlayerGridRow } from "./PlayerGridRow";

interface PlayerGridProps {
  firstLetter?: string;
  isPlayer?: boolean;
  wordLength: number;
  nbLife: number;
  word: string;
  triesHistory: TriesHistory[];
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({
  isPlayer,
  wordLength: length,
  nbLife,
  firstLetter,
  word,
  // setWord,
  triesHistory,
  // onWordEnter,
}) => {
  if (isPlayer === undefined) {
    isPlayer = true;
  }
  if (firstLetter === undefined) {
    firstLetter = "";
  }

  const rowsArray = [];

  for (let i = 0; i < nbLife; i++) {
    let wordToShow = firstLetter;
    if (triesHistory.length > i) {
      wordToShow = triesHistory[i].wordTried;
    } else if (i === triesHistory.length) {
      wordToShow = word;
    }

    rowsArray.push(
      <PlayerGridRow
        key={i}
        word={wordToShow}
        letterResults={triesHistory[i]?.result}
        wordLength={length}
      />
    );
  }

  return (
    <Stack align={"center"} spacing={3}>
      {rowsArray}
    </Stack>
  );
};
