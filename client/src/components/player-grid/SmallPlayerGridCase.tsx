import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { LetterResult } from "../../utils/types";
import { getColorFromResult } from "../../utils/utils";

interface SmallPlayerGridCaseProps {
  letterResult?: LetterResult;
  nbPlayer:number;
}

export const SmallPlayerGridCase: React.FC<SmallPlayerGridCaseProps> = ({
  letterResult,
  nbPlayer,
}) => {
  let color = getColorFromResult(letterResult);

  let size = 100/nbPlayer
  if (size < 100/7) size = 100/7;
  return (
    <Flex w={size} height={size} bgColor={color}>
      <Text
        color={"white"}
        m="auto"
      >
      </Text>
    </Flex>
  );
};