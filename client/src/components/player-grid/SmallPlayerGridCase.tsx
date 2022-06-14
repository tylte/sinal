import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { LetterResult } from "../../utils/types";
import { getColorFromResult } from "../../utils/utils";

interface SmallPlayerGridCaseProps {
  letterResult?: LetterResult;
  nbPlayer: number;
}

export const SmallPlayerGridCase: React.FC<SmallPlayerGridCaseProps> = ({
  letterResult,
  nbPlayer,
}) => {
  let color = getColorFromResult(letterResult);

  let size = 75 / nbPlayer;
  if(size <= 75 / 10) size = 75/10;//Max size of the grid for other player

  return (
    <Flex w={size} height={size} bgColor={color}>
      <Text color={"white"} m="auto"></Text>
    </Flex>
  );
};
