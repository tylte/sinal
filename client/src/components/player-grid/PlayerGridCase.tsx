import { Flex, Text } from "@chakra-ui/react";
import React from "react";

interface PlayerGridCaseProps {
  letter?: string;
}

export const PlayerGridCase: React.FC<PlayerGridCaseProps> = ({ letter }) => {
  return (
    <Flex
      w={14}
      height={14}
      borderWidth="1px"
      backgroundColor={"blackAlpha.900"}
    >
      <Text fontFamily={"revert"} fontWeight={"bold"} m="auto">
        {letter}
      </Text>
    </Flex>
  );
};
