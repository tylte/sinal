import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { Socket } from "socket.io-client";
import { SinalContext } from "./context";
import { Player } from "./types";

export const useDictionary = (): Set<string> => {
  let { dictionary } = useContext(SinalContext);
  return dictionary;
};

export const useSocket = (): Socket | null => {
  let { socket } = useContext(SinalContext);
  return socket;
};

export const usePlayer = (): [
  player: Player | null,
  setPlayer: Dispatch<SetStateAction<Player | null>> | null
] => {
  let { playerActions } = useContext(SinalContext);
  return playerActions;
};

export const useConnected = (): boolean => {
  let { isConnected } = useContext(SinalContext);
  return isConnected;
};

const handleWordInput = (
  e: KeyboardEvent,
  word: string,
  setWord: Dispatch<SetStateAction<string>>,
  wordLength: number,
  onEnter: () => void
) => {
  console.log("word : ", word);
  // Only one alphabetic caracter in the key
  const re = /^([a-zA-Z]{1})$/;
  // more detail on e.key https://www.toptal.com/developers/keycode/for/alt
  if (re.test(e.key)) {
    setWord((word) => {
      let newCharacter = e.key.toUpperCase();
      if (word.length < wordLength) {
        return word + newCharacter;
      } else {
        return word;
      }
    });
  } else if (e.key === "Backspace") {
    // Remove last character of the word
    setWord((word) => {
      if (word.length > 1) {
        return word.slice(0, word.length - 1);
      } else {
        // Cannot remove first letter
        return word;
      }
    });
  } else if (e.key === "Enter") {
    // Function coming from props to let upper components decide what to do
    onEnter();
  }
};

/**
 *  Allow the listening of what the player is typing
 *  The word will be of max length wordLength.
 *
 *  The player will be able to type lower case or upper case and the output
 *  will be all upper case and he's able to use backspace to delete characters.
 *
 *  In classic word input, the user cannot delete the first letter
 */
export const useClassicWordInput = (
  word: string,
  setWord: Dispatch<SetStateAction<string>>,
  wordLength: number,
  onEnter: () => void,
  stopListening: boolean
) => {
  const handleInput = (e: KeyboardEvent) => {
    handleWordInput(e, word, setWord, wordLength, onEnter);
  };
  useEffect(() => {
    if (!stopListening) {
      document.addEventListener("keydown", handleInput);
    }

    return () => {
      if (!stopListening) {
        document.removeEventListener("keydown", handleInput);
      }
    };
  }, [word, stopListening]);
};
