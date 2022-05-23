import { Stack } from "@chakra-ui/react";
import React from "react";
import { TriesHistory } from "../../utils/types";
import { SmallPlayerGridRow } from "./SmallPlayerGridRow";

interface SmallPlayerGridProps {
  firstLetter?: string;
  isVisible?: boolean;
  wordLength: number;
  nbLife: number;
  word: string;
  triesHistory: TriesHistory[];
  nbPlayer:number;
}

export const SmallPlayerGrid: React.FC<SmallPlayerGridProps> = ({
  isVisible,
  wordLength: length,
  nbLife,
  firstLetter,
  word,
  triesHistory,
  nbPlayer,
}) => {
  if (isVisible === undefined) {
    isVisible = true;
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
      <SmallPlayerGridRow
        key={i}
        word={wordToShow}
        letterResults={triesHistory[i]?.result}
        wordLength={length}
        isVisible={isVisible}
        nbPlayer={nbPlayer}
      />
    );
  }

  return (
    <Stack spacing={1} margin={5}>
      {rowsArray}
    </Stack>
  );
};