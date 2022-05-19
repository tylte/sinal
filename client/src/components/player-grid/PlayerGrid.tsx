import {
  Box,
  Button,
  HStack,
  PinInput,
  PinInputField,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { guessWord, guessWordMulti } from "../../utils/api";
import { useDictionary, useKeyDown, useSocket } from "../../utils/hooks";
import { Packet, Player, TriesHistory } from "../../utils/types";
import { getColorFromResult, isWordCorrect } from "../../utils/utils";
import { PlayerGridRow } from "./PlayerGridRow";

const toast_length_id = "toast_length";
const toast_not_dictionary_id = "toast_not_dictionary_id";

interface PlayerGridProps {
  isPlayer: boolean;
  firstLetter: string;
  length: number;
  nbLife: number;
  currentAttempt: number;
  triesHistory: TriesHistory[];
  setTriesHistory: Dispatch<SetStateAction<TriesHistory[]>>;
  word: string;
  setWord: Dispatch<SetStateAction<string>>;
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({
  isPlayer,
  firstLetter,
  length,
  nbLife,
  currentAttempt,
  setTriesHistory,
  triesHistory,
  word,
  setWord,
}) => {
  const firstLetterUpper = firstLetter.toUpperCase();
  // const [word, setWord] = useState(firstLetterUpper);
  const [tryCount, setTryCount] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const toast = useToast();
  console.log("word : ", word);
  useKeyDown((e: KeyboardEvent) => {
    // Only one alphabetic caracter in the key (more detail https://www.toptal.com/developers/keycode/for/alt)
    const re = /^([a-zA-Z]{1})$/;
    if (re.test(e.key)) {
      setWord((word) => {
        let newCharacter = e.key.toUpperCase();
        if (word.length < length) {
          return word + newCharacter;
        } else {
          // let newWord = word.slice(0, word.length - 1) + newCharacter;
          return word;
        }
      });
    } else if (e.key === "Backspace") {
      // Remove last character of the word
      setWord((word) => {
        if (word.length > 1) {
          return word.slice(0, word.length - 1);
        } else {
          return word;
        }
      });
    }
  });

  // const handleKeyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === "Enter") {
  //     handleTryWord();
  //   }
  // };

  const handleWordChange = (str: string) => {
    // Check that first letter doesn't change and word will not contain digits
    let str_upper = str.toUpperCase();
    const re = /\d+/g;
    if (str_upper.charAt(0) === firstLetterUpper && !re.test(str_upper)) {
      setWord(str_upper);
      // if (player !== undefined) {
      //   console.log(player);
      //   let { id } = player;
      //   socket?.emit("update_word", { word, playerId: id, lobbyId });
      // }
    }
  };

  // const handleTryWord = async () => {
  //   let word_lowercase = word.toLowerCase();
  //   if (!dictionary.has(word_lowercase) || word_lowercase.length !== length) {
  //     let text = "";
  //     let toast_id = "";
  //     if (word_lowercase.length !== length) {
  //       toast_id = toast_length_id;
  //       text = "Mot trop court";
  //     } else {
  //       toast_id = toast_not_dictionary_id;
  //       text = "Le mot n'est pas dans le dictionnaire";
  //     }
  //     if (!toast.isActive(toast_id)) {
  //       toast({
  //         title: text,
  //         id: toast_id,
  //         status: "error",
  //         duration: 1500,
  //         isClosable: true,
  //       });
  //     }
  //   } else {
  //     if (isSolo) {
  //       let guessResult = await guessWord(word_lowercase, id);
  //       if (isWordCorrect(guessResult)) {
  //         toast({
  //           title: "Vous avez trouvé le mot !",
  //           status: "success",
  //           duration: 1500,
  //           isClosable: true,
  //         });
  //         setHasWon(true);
  //       }
  //       setTryCount((v) => (v = v + 1));
  //       const tries = triesHistory.slice();
  //       tries.push({ wordTried: word_lowercase, result: guessResult });
  //       setWord(firstLetterUpper);
  //       setTriesHistory(tries);
  //     } else if (mode == "1vs1" && player) {
  //       guessWordMulti(
  //         word_lowercase,
  //         id,
  //         player.id,
  //         socket,
  //         (response: Packet) => {
  //           let guessResult = response.data;
  //           if (isWordCorrect(guessResult)) {
  //             toast({
  //               title: "Vous avez trouvé le mot !",
  //               status: "success",
  //               duration: 1500,
  //               isClosable: true,
  //             });
  //             setHasWon(true);
  //           }
  //           setTryCount((v) => (v = v + 1));
  //           const tries = triesHistory.slice();
  //           tries.push({ wordTried: word_lowercase, result: guessResult });
  //           setWord(firstLetterUpper);
  //           setTriesHistory(tries);
  //         }
  //       );
  //     }
  //   }
  // };

  // const inputArray = [];
  // for (let i = 0; i < nbLife; i++) {
  //   let value = firstLetterUpper;
  //   let inputArrayField = [];

  //   if (i < triesHistory.length) {
  //     // Word history, not editable
  //     value = triesHistory[i].wordTried.toUpperCase();
  //     inputArrayField = getColorFromResult(triesHistory[i].result).map(
  //       (color, index) => (
  //         <PinInputField key={index} backgroundColor={color} color="white" />
  //       )
  //     );
  //   } else {
  //     for (let i = 0; i < length; i++) {
  //       inputArrayField.push(
  //         // Editable input
  //         <PinInputField
  //           // onKeyDown={handleKeyPressed}
  //           key={i}
  //           backgroundColor="grey"
  //           color="white"
  //         />
  //       );
  //     }
  //   }

  //   inputArray.push(
  //     <HStack key={i}>
  //       <PinInput
  //         isDisabled={i != tryCount || hasWon || !isPlayer}
  //         onChange={handleWordChange}
  //         value={i != tryCount ? value : word}
  //         type="alphanumeric"
  //         placeholder="?"
  //         mask={!isPlayer}
  //       >
  //         {inputArrayField}
  //       </PinInput>
  //     </HStack>
  //   );
  // }

  const rowsArray = [];

  for (let i = 0; i < nbLife; i++) {
    rowsArray.push(
      <PlayerGridRow
        key={i}
        word={word}
        firstLetter={firstLetter}
        length={length}
        isCurrentAttempt={currentAttempt === i}
      />
    );
  }

  return (
    // <Stack spacing={5} align={"center"}>
    <Stack align={"center"} spacing={3}>
      {rowsArray}
    </Stack>
    // </Stack>
  );
};
