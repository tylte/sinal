import { HStack } from "@chakra-ui/react";
import React from "react";
import { LetterResult } from "../../utils/types";
import { SmallPlayerGridCase } from "./SmallPlayerGridCase";

interface SmallPlayerGridRowProps {
  wordLength: number;
  letterResults?: LetterResult[];
  nbPlayer:number;
}

export const SmallPlayerGridRow: React.FC<SmallPlayerGridRowProps> = ({
  wordLength: length,
  letterResults,
  nbPlayer,
}) => {
  let playerRow =
    letterResults?.map((letter, index) => {
      return (
        <SmallPlayerGridCase
          key={index}
          letterResult={letter}
          nbPlayer={nbPlayer}
        />
      );
    }) || [];

  while (playerRow.length < length) {
    playerRow.push(
      <SmallPlayerGridCase key={playerRow.length} nbPlayer={nbPlayer} />
    );
  }

  return <HStack spacing={1}>{playerRow}</HStack>;
};