import {
  Button,
  HStack,
  PinInput,
  PinInputField,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface PlayerGridProps {
  firstLetter: string;
  length: number;
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({
  firstLetter,
  length,
}) => {
  const [word, setWord] = useState("");
  const [tryCount, setTryCount] = useState(0);
  const [lastTries, setLastTries] = useState<string[]>([]);

  console.log(tryCount);
  console.log(word);
  console.log(word);

  const handleWordChange = (str: string) => {
    // TODO: Don't accept letters
    setWord(str);
  };

  const handleTryWord = () => {
    setTryCount((v) => (v = v + 1));
    const tries = lastTries.slice();
    tries.push(word);
    setWord("");
    setLastTries(tries);
  };

  const inputArrayField = [];
  for (let i = 0; i < length; i++) {
    inputArrayField.push(<PinInputField key={i} />);
  }
  const inputArray = [];
  for (let i = 0; i < length; i++) {
    let value = "";
    if (i < lastTries.length) {
      value = lastTries[i];
    }

    inputArray.push(
      <HStack key={i}>
        <PinInput
          isDisabled={i != tryCount}
          onChange={handleWordChange}
          value={i != tryCount ? value : word}
          type="alphanumeric"
          placeholder="?"
        >
          {inputArrayField}
        </PinInput>
      </HStack>
    );
  }

  return (
    <Stack spacing={5} align={"center"}>
      {inputArray}
      <Button onClick={handleTryWord} mt={4}>
        try word
      </Button>
    </Stack>
  );
};
