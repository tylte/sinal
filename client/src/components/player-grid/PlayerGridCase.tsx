import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { LetterResult } from "../../utils/types";
import { getColorFromResult } from "../../utils/utils";

interface PlayerGridCaseProps {
  letter?: string;
  letterResult?: LetterResult;
}

export const PlayerGridCase: React.FC<PlayerGridCaseProps> = ({
  letter,
  letterResult,
}) => {
  let color = getColorFromResult(letterResult);

  return (
    <Flex w={14} height={14} borderWidth="1px" backgroundColor={color}>
      <Text fontFamily={"revert"} fontWeight={"bold"} fontSize="2xl" m="auto">
        {letter}
      </Text>
    </Flex>
  );
};
