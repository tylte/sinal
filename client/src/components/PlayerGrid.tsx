import {
  Button,
  HStack,
  PinInput,
  PinInputField,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Confetti from "react-confetti";
import { guessWord, guessWordMulti } from "../utils/api";
import { useDictionary, useSocket } from "../utils/hooks";
import { GameMode, Packet, Player, TriesHistory } from "../utils/types";
import { getColorFromResult, isWordCorrect } from "../utils/utils";

const toast_length_id = "toast_length";
const toast_not_dictionary_id = "toast_not_dictionary_id";

interface PlayerGridProps {
  isPlayer : boolean;
  isSolo : boolean;
  mode? : GameMode;
  firstLetter: string;
  length: number;
  nbLife: number;
  id: string;
  player: Player | undefined;
  lobbyId: string | null;
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({
  isSolo,
  isPlayer,
  mode,
  firstLetter,
  length,
  nbLife,
  id,
  player,
  lobbyId,
}) => {
  const firstLetterUpper = firstLetter.toUpperCase();
  const dictionary = useDictionary();
  const [word, setWord] = useState(firstLetterUpper);
  const [tryCount, setTryCount] = useState(0);
  const [triesHistory, setTriesHistory] = useState<TriesHistory[]>([]);
  const [hasWon, setHasWon] = useState(false);
  const toast = useToast();
  const socket = useSocket();

  const handleKeyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleTryWord();
    }
  };

  const handleWordChange = (str: string) => {
    // Check that first letter doesn't change and word will not contain digits
    let str_upper = str.toUpperCase();
    const re = /\d+/g;
    if (str_upper.charAt(0) === firstLetterUpper && !re.test(str_upper)) {
      setWord(str_upper);
      if (player !== undefined) {
        let { id} = player;
        socket?.emit("update_word", { word, playerId: id, lobbyId });
      }
    }
  };

  const handleTryWord = async () => {
    let word_lowercase = word.toLowerCase();
    if (!dictionary.has(word_lowercase) || word_lowercase.length !== length) {
      let text = "";
      let toast_id = "";
      if (word_lowercase.length !== length) {
        toast_id = toast_length_id;
        text = "Mot trop court";
      } else {
        toast_id = toast_not_dictionary_id;
        text = "Le mot n'est pas dans le dictionnaire";
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
      if ( isSolo ) {
        let guessResult = await guessWord(word_lowercase, id);
        if (isWordCorrect(guessResult)) {
          toast({
            title: "Vous avez trouvé le mot !",
            status: "success",
            duration: 1500,
            isClosable: true,
          });
          setHasWon(true);
        }
        setTryCount((v) => (v = v + 1));
        const tries = triesHistory.slice();
        tries.push({ wordTried: word_lowercase, result: guessResult });
        setWord(firstLetterUpper);
        setTriesHistory(tries);
      }
      else if ( mode == "1vs1" && player ) {
        guessWordMulti( word_lowercase, id, player.id, socket, 
          (response: Packet) => {
            let guessResult = response.data;
            if (isWordCorrect(guessResult)) {
              toast({
                title: "Vous avez trouvé le mot !",
            status: "success",
            duration: 1500,
            isClosable: true,
          });
          setHasWon(true);
        }
        setTryCount((v) => (v = v + 1));
        const tries = triesHistory.slice();
        tries.push({ wordTried: word_lowercase, result: guessResult });
        setWord(firstLetterUpper);
        setTriesHistory(tries);
      });
      }
    }
  };

  const inputArray = [];
  for (let i = 0; i < nbLife; i++) {
    let value = firstLetterUpper;
    let inputArrayField = [];

    if (i < triesHistory.length) {
      // Word history, not editable
      value = triesHistory[i].wordTried.toUpperCase();
      inputArrayField = getColorFromResult(triesHistory[i].result).map(
        (color, index) => (
          <PinInputField key={index} backgroundColor={color} color="white" />
        )
      );
    } else {
      for (let i = 0; i < length; i++) {
        inputArrayField.push(
          // Editable input
          <PinInputField
            onKeyDown={handleKeyPressed}
            key={i}
            backgroundColor="grey"
            color="white"
          />
        );
      }
    }

    inputArray.push(
      <HStack key={i}>
        <PinInput
          isDisabled={i != tryCount || hasWon || !isPlayer}
          onChange={handleWordChange}
          value={i != tryCount ? value : word}
          type="alphanumeric"
          placeholder="?"
          mask={!isPlayer}
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
        Tenter le mot !
      </Button>
    </Stack>
  );
};
