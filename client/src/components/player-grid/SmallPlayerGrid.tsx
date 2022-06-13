import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import { TriesHistory } from "../../utils/types";
import { SmallPlayerGridRow } from "./SmallPlayerGridRow";
import { Text } from "@chakra-ui/react";

interface SmallPlayerGridProps {
  wordLength: number;
  nbLife: number;
  triesHistory: TriesHistory[];
  nbPlayer: number;
  namePlayer: string;
}

export const SmallPlayerGrid: React.FC<SmallPlayerGridProps> = ({
  wordLength: length,
  nbLife,
  triesHistory,
  nbPlayer,
  namePlayer,
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
    <Stack position={"relative"} overflow={"hidden"} spacing={1} margin={3}>
      <Box
        key={"box-" + namePlayer}
        bg={"rgba(0, 0, 0, 0.3)"}
        w={"100%"}
        h={"100%"}
        position={"absolute"}
      ></Box>
      <Text
        key={"text-" + namePlayer}
        position={"absolute"}
        left="50%"
        top="50%"
        width={"100%"}
        overflow={"hidden"}
        whiteSpace={"nowrap"}
        textOverflow={"ellipsis"}
        textColor={"white"}
        textAlign={"center"}
        transform={"translate(-50%, -50%)"}
      >
        {namePlayer}
      </Text>

      {rowsArray}
    </Stack>
  );
};
