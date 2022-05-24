import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { LetterResult } from "../../utils/types";
import { getColorFromResult } from "../../utils/utils";

interface PlayerGridCaseProps {
  letter?: string;
  letterResult?: LetterResult;
  isVisible?: boolean;
}

export const PlayerGridCase: React.FC<PlayerGridCaseProps> = ({
  letter,
  letterResult,
  isVisible,
}) => {
  let color = getColorFromResult(letterResult);

  let letterToShow = letter;

  if (!isVisible && letter !== undefined) {
    console.log("isVisible ; ", isVisible);
    letterToShow = "●";
  }

  return (
    <Flex w={14} height={14} bgColor={color}>
      <Text
        userSelect={"none"}
        color={"white"}
        fontFamily={"revert"}
        fontWeight={"bold"}
        fontSize="2xl"
        m="auto"
      >
        {letterToShow}
      </Text>
    </Flex>
  );
};
