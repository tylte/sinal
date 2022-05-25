import { Flex } from "@chakra-ui/react";
import React from "react";
import { TriesHistory } from "../../utils/types";
import { getLetterToColorFromTriesHistory } from "../../utils/utils";
import { KeyboardKey } from "./KeyboardKey";

interface KeyboardProps {
  onEnter: () => void;
  onBackspace: () => void;
  onKeydown: (letter: string) => void;
  triesHistory: TriesHistory[];
  isClickable: boolean;
}

const FRIST_ROW_LETTERS = "AZERTYUIOP";
const SECOND_ROW_LETTERS = "QSDFGHJKLM";
const THIRD_ROW_LETTERS = "WXCVBN";

export const Keyboard: React.FC<KeyboardProps> = ({
  onEnter,
  onKeydown: setWord,
  onBackspace,
  triesHistory,
  isClickable,
}) => {
  const letterToColor = getLetterToColorFromTriesHistory(triesHistory);

  return (
    <Flex direction={"column"} alignItems={"center"}>
      <Flex>
        {[...FRIST_ROW_LETTERS].map((letter) => {
          return (
            <KeyboardKey
              isClickable={isClickable}
              onClick={setWord}
              key={letter}
              letter={letter}
              color={letterToColor.get(letter)}
            />
          );
        })}
      </Flex>
      <Flex>
        {[...SECOND_ROW_LETTERS].map((letter) => {
          return (
            <KeyboardKey
              isClickable={isClickable}
              onClick={setWord}
              key={letter}
              letter={letter}
              color={letterToColor.get(letter)}
            />
          );
        })}
      </Flex>
      <Flex>
        <KeyboardKey
          isClickable={isClickable}
          onClick={onEnter}
          size="large"
          letter={"ENTER"}
        />
        {[...THIRD_ROW_LETTERS].map((letter) => {
          return (
            <KeyboardKey
              isClickable={isClickable}
              onClick={setWord}
              key={letter}
              letter={letter}
              color={letterToColor.get(letter)}
            />
          );
        })}
        <KeyboardKey
          isClickable={isClickable}
          onClick={onBackspace}
          letter={"⇽"}
        />
      </Flex>
    </Flex>
  );
};
