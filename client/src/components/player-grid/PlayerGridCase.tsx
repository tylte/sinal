import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { LetterResult, MyFocus } from "../../utils/types";
import { getColorFromResult, getGradientFromFocus } from "../../utils/utils";

interface PlayerGridCaseProps {
  letter?: string;
  letterResult?: LetterResult;
  isVisible?: boolean;
  focus?: MyFocus;
}

export const PlayerGridCase: React.FC<PlayerGridCaseProps> = ({
  letter,
  letterResult,
  isVisible,
  focus,
}) => {
  let color = getColorFromResult(letterResult);

  let isFocus = focus !== undefined;

  let letterToShow = letter;

  if (!isVisible && letter !== undefined && letter !== " ") {
    letterToShow = "●";
  }

  let caseGradient = getGradientFromFocus(focus, color);

  let isGradient = caseGradient !== undefined;

  return (
    <Flex
      w={14}
      height={14}
      // bgColor={color}
      bgColor={isFocus && !isGradient ? "red" : color}
      bgGradient={isFocus && isGradient ? caseGradient : undefined}
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
