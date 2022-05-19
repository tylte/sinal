import { HStack } from "@chakra-ui/react";
import React from "react";
import { PlayerGridCase } from "./PlayerGridCase";

interface PlayerGridRowProps {
  word: string;
  length: number;
}

export const PlayerGridRow: React.FC<PlayerGridRowProps> = ({
  word,
  length,
}) => {
  let playerRow = [...word].map((letter) => <PlayerGridCase letter={letter} />);

  while (playerRow.length < length) {
    playerRow.push(<PlayerGridCase />);
  }

  return <HStack spacing={2}>{playerRow}</HStack>;
};
