import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { LetterResult } from "../../utils/types";
import { getColorFromResult } from "../../utils/utils";

interface PlayerGridCaseProps {
  letter?: string;
  letterResult?: LetterResult;
  isVisible?: boolean;
  isFocus?: boolean;
  isGradient?: boolean;
}

export const PlayerGridCase: React.FC<PlayerGridCaseProps> = ({
  letter,
  letterResult,
  isVisible,
  isFocus,
  isGradient,
}) => {
  if (isGradient === undefined) {
    isGradient = false;
  }

  let color = getColorFromResult(letterResult);

  let letterToShow = letter;

  if (!isVisible && letter !== undefined) {
    letterToShow = "●";
  }

  return (
    <Flex
      w={14}
      height={14}
      // bgColor={color}
      bgColor={isFocus && !isGradient ? "red" : color}
      bgGradient={
        isFocus && isGradient
          ? `linear(to-r, ${color} 0%, ${color} 80%, red 50%)`
          : undefined
      }
    >
      <Text
        boxSizing="border-box"
        userSelect={"none"}
        color={"white"}
        fontFamily={"revert"}
        fontWeight={"bold"}
        fontSize="2xl"
        m={"auto"}
      >
        {letterToShow}
      </Text>
    </Flex>
  );
};
