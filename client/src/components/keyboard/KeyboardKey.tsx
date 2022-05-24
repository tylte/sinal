import { Flex, Text } from "@chakra-ui/react";
import React from "react";

type size = "normal" | "large";

interface KeyboardKeyProps {
  letter: string;
  size?: size;
  onClick: (letter: string) => void;
  color?: string;

  isClickable: boolean;
}

export const KeyboardKey: React.FC<KeyboardKeyProps> = ({
  letter,
  size,
  onClick,
  color,
  isClickable,
}) => {
  let height = 12;
  let width = 12;

  if (size === "large") {
    width = 20;
  }

  return (
    <Flex
      pointerEvents={isClickable ? "all" : "none"}
      onClick={() => onClick(letter)}
      bg={color ?? "GrayText"}
      m="2px"
      borderRadius="sm"
      height={height}
      width={width}
      color={"white"}
    >
      <Text userSelect={"none"} m="auto">
        {letter}
      </Text>
    </Flex>
  );
};
