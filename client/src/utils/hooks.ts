import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { Socket } from "socket.io-client";
import { SinalContext } from "./context";
import { MyFocus, Player } from "./types";
import {
  classicWordDelete,
  classicWordWriting,
  decrementFocus,
  incrementFocus,
} from "./utils";

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

export const useIsChatting = (): boolean => {
  let {
    chattingActions: [isChatting],
  } = useContext(SinalContext);
  return isChatting;
};

export const useChattingActions = (): [
  isChatting: boolean,
  setIsChatting: Dispatch<SetStateAction<boolean>> | null
] => {
  let { chattingActions } = useContext(SinalContext);
  return chattingActions;
};

export const useConnected = (): boolean => {
  let { isConnected } = useContext(SinalContext);
  return isConnected;
};

const handleWordInput = (
  e: KeyboardEvent,
  setWord: Dispatch<SetStateAction<string>>,
  wordLength: number,
  onEnter: () => void,
  focus: MyFocus,
  setFocus: Dispatch<SetStateAction<MyFocus>>
) => {
  // Only one alphabetic caracter in the key
  const re = /^([a-zA-Z]{1})$/;
  // more detail on e.key https://www.toptal.com/developers/keycode/for/alt
  if (re.test(e.key)) {
    incrementFocus(setFocus, wordLength - 1);
    classicWordWriting(e.key, setWord, wordLength, focus);
  } else if (e.key === "Backspace") {
    // Remove last character of the word
    classicWordDelete(setWord, focus);
    decrementFocus(setFocus, 1);
  } else if (e.key === "Enter") {
    // Function coming from props to let upper components decide what to do
    onEnter();
  } else if (e.key === "ArrowRight") {
    incrementFocus(setFocus, wordLength - 1);
  } else if (e.key === "ArrowLeft") {
    decrementFocus(setFocus, 1);
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
  focus: MyFocus,
  setFocus: Dispatch<SetStateAction<MyFocus>>,
  stopListening?: boolean
) => {
  const handleInput = (e: KeyboardEvent) => {
    handleWordInput(e, setWord, wordLength, onEnter, focus, setFocus);
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
  }, [word, focus, stopListening]);
};
