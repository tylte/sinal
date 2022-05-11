import {
  Button,
  HStack,
  PinInput,
  PinInputField,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import Confetti from "react-confetti";
import { guessWord } from "../utils/api";
import { DictionaryContext } from "../utils/dico";
import { TriesHistory } from "../utils/types";
import { getColorFromResult, isWordCorrect } from "../utils/utils";

const toast_length_id = "toast_length";
const toast_not_dictionary_id = "toast_not_dictionary_id";

interface PlayerGridProps {
  firstLetter: string;
  length: number;
  nbLife: number;
  id: string;
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({
  firstLetter,
  length,
  nbLife,
  id,
}) => {
  const dictionary = useContext(DictionaryContext);
  const [word, setWord] = useState(firstLetter);
  const [tryCount, setTryCount] = useState(0);
  const [triesHistory, setTriesHistory] = useState<TriesHistory[]>([]);
  const [hasWon, setHasWon] = useState(false);
  const toast = useToast();

  const handleWordChange = (str: string) => {
    // Check that first letter doesn't change and word will not contain digits
    const re = /\d+/g;
    if (str.charAt(0) === firstLetter && !re.test(str)) {
      setWord(str);
    }
  };

  const handleTryWord = async () => {
    if (!dictionary.has(word) || word.length !== length) {
      // TODO: Maybe make a toast for not in dictionary
      let text = "";
      let toast_id = "";
      if (word.length !== length) {
        toast_id = toast_length_id;
        text = "Mot trop court";
        console.log("Too short");
      } else {
        toast_id = toast_not_dictionary_id;
        text = "Le mot n'est pas dans le dictionnaire";
        console.log("Not in dictionary");
      }
      if (!toast.isActive(toast_id)) {
        toast({
          title: text,
          id: toast_id,
          status: "error",
          duration: 1500,
          isClosable: true,
        });
      }
    } else {
      let guessResult = await guessWord(word, id);
      console.log(guessResult);
      if (isWordCorrect(guessResult)) {
        // TODO: toast winning ?
        alert("Won!");
        setHasWon(true);
      }
      setTryCount((v) => (v = v + 1));
      const tries = triesHistory.slice();
      tries.push({ wordTried: word, result: guessResult });
      setWord(firstLetter);
      setTriesHistory(tries);
    }
  };

  const inputArray = [];
  for (let i = 0; i < nbLife; i++) {
    let value = firstLetter;
    let inputArrayField = [];

    if (i < triesHistory.length) {
      value = triesHistory[i].wordTried;
      inputArrayField = getColorFromResult(triesHistory[i].result).map(
        (color, index) => (
          <PinInputField key={index} backgroundColor={color} color="white" />
        )
      );
    } else {
      for (let i = 0; i < length; i++) {
        inputArrayField.push(
          <PinInputField key={i} backgroundColor="grey" color="white" />
        );
      }
    }

    inputArray.push(
      <HStack key={i}>
        <PinInput
          isDisabled={i != tryCount || hasWon}
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
      {hasWon && <Confetti />}
      {inputArray}
      <Button onClick={handleTryWord} mt={4}>
        try word
      </Button>
    </Stack>
  );
};
