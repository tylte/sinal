import { Stack } from "@chakra-ui/react";
import React from "react";
import { TriesHistory } from "../../utils/types";
import { SmallPlayerGridRow } from "./SmallPlayerGridRow";

interface SmallPlayerGridProps {
  wordLength: number;
  nbLife: number;
  triesHistory: TriesHistory[];
  nbPlayer:number;
}

export const SmallPlayerGrid: React.FC<SmallPlayerGridProps> = ({
  wordLength: length,
  nbLife,
  triesHistory,
  nbPlayer,
}) => {

  const rowsArray = [];

  for (let i = 0; i < nbLife; i++) {

    rowsArray.push(
      <SmallPlayerGridRow
        key={i}
        letterResults={triesHistory[i]?.result}
        wordLength={length}
        nbPlayer={nbPlayer}
      />
    );
  }

  return (
    <Stack spacing={1} margin={3}>
      {rowsArray}
    </Stack>
  );
};