import { Dispatch, SetStateAction } from "react";
import {
  KeyboardSettings,
  LetterResult,
  LobbyState,
  MyFocus,
  TriesHistory,
} from "./types";

export const isWordCorrect = (result: LetterResult[]): boolean => {
  if (result.length === 0) {
    return false;
  }

  for (let i = 0; i < result.length; i++) {
    const res = result[i];
    if (res !== LetterResult.RIGHT_POSITION) {
      return false;
    }
  }

  return true;
};

export const getColorFromResults = (result: LetterResult[]): string[] => {
  const ret = [];
  for (let i = 0; i < result.length; i++) {
    const res = result[i];
    if (res === LetterResult.RIGHT_POSITION) {
      ret.push("green.300");
    } else if (res === LetterResult.FOUND) {
      ret.push("orange.100");
    } else if (res === LetterResult.NOT_FOUND) {
      ret.push("blackAlpha.300");
    }
  }

  return ret;
};

export const getColorFromResult = (result?: LetterResult): string => {
  if (result === LetterResult.RIGHT_POSITION) {
    return "green.300";
  } else if (result === LetterResult.FOUND) {
    return "orange.400";
  } else if (result === LetterResult.NOT_FOUND) {
    return "blackAlpha.900";
  }
  return "grey";
};

export const isLobbyJoinable = (
  currentPlace: number,
  totalPlace: number,
  gameState: LobbyState
): boolean => {
  if (currentPlace >= totalPlace) {
    return false;
  }
  if (gameState !== "pre-game") {
    return false;
  }

  return true;
};

export const getIdFromPage = (id: string | string[] | undefined) => {
  if (typeof id === "string") {
    return id;
  } else {
    return null;
  }
};

export const classicWordWriting = (
  letter: string,
  setWord: Dispatch<SetStateAction<string>>,
  wordLength: number,
  focus: MyFocus
) => {
  setWord((word) => {
    let newCharacter = letter.toUpperCase();
    if (focus.index < wordLength && !focus.isBorder) {
      return writeWordWithFocus(focus, word, newCharacter);
    }
    return word;
  });
};

export const classicWordDelete = (
  setWord: Dispatch<SetStateAction<string>>,
  { index, isBorder }: MyFocus
) => {
  setWord((word) => {
    if (index <= 1) {
      // Cannot remove first letter
      return word;
    }
    if (isBorder) {
      return word.slice(0, index);
    } else {
      return word.slice(0, index - 1) + word.slice(index);
    }
  });
};

export const getClassicKeyboardSettings = (
  onEnter: () => void,
  setWord: Dispatch<SetStateAction<string>>,
  focus: MyFocus,
  setFocus: Dispatch<SetStateAction<MyFocus>>,
  wordLength: number
): KeyboardSettings => {
  return {
    onBackspace: () => {
      decrementFocus(setFocus, 1);
      classicWordDelete(setWord, focus);
    },
    onEnter,
    onKeydown: (letter) => {
      incrementFocus(setFocus, wordLength - 1);
      classicWordWriting(letter, setWord, wordLength, focus);
    },
  };
};

export const getLetterToColorFromTriesHistory = (
  triesHistory: TriesHistory[]
): Map<string, string> => {
  const ret = new Map();

  triesHistory.forEach((oneTry) => {
    const { result, wordTried } = oneTry;

    for (let i = 0; i < result.length; i++) {
      const res = result[i];
      ret.set(wordTried[i], getColorFromResult(res));
    }
  });

  return ret;
};

export const incrementFocus = (
  setFocusIndex: Dispatch<SetStateAction<MyFocus>>,
  upperLimit: number
) => {
  setFocusIndex((focus) => {
    if (focus.index < upperLimit) {
      return {
        ...focus,
        index: focus.index + 1,
      };
    } else {
      return { ...focus, isBorder: focus.index === upperLimit };
    }
  });
};

export const decrementFocus = (
  setFocus: Dispatch<SetStateAction<MyFocus>>,
  lowerLimit: number
) => {
  setFocus((focus) => {
    if (focus.isBorder) {
      return { ...focus, isBorder: false };
    }

    if (focus.index > lowerLimit) {
      return { ...focus, index: focus.index - 1 };
    }

    return focus;
  });
};

export const writeWordWithFocus = (
  focus: MyFocus,
  word: string,
  newCharacter: string
): string => {
  if (focus.focusMode === "insert") {
    return (
      word.slice(0, focus.index) +
      newCharacter +
      word.slice(focus.index, word.length)
    );
  } else if (focus.focusMode === "overwrite") {
    let newWord = [...word];

    while (newWord.length < focus.index) {
      newWord.push(" ");
    }
    newWord[focus.index] = newCharacter;

    console.log(newWord);
    return newWord.join("");
  }

  return word;
};
