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

  return (
    <Flex w={75/nbPlayer} height={75/nbPlayer} bgColor={color}>
      <Text
        color={"white"}
        m="auto"
      >
      </Text>
    </Flex>
  );
};