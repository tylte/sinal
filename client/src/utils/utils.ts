import { Dispatch, SetStateAction } from "react";
import {
  FocusMode,
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
      return writeWordWithFocus(focus, word, newCharacter, wordLength);
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
      // Remove last element
      return word.slice(0, index);
    } else {
      let newWord = [...word];
      newWord[index - 1] = " ";
      return newWord.join("");
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
  { focusMode, index }: MyFocus,
  word: string,
  newCharacter: string,
  wordLength: number
): string => {
  let newWord = [...word];
  if (focusMode === "insert") {
    while (newWord.length < index) {
      newWord.push(" ");
    }
    newWord.splice(index, 0, newCharacter);

    // newWord[index] = newCharacter;

    return newWord.slice(0, wordLength).join("");
  } else if (focusMode === "overwrite") {
    while (newWord.length < index) {
      newWord.push(" ");
    }
    newWord[index] = newCharacter;

    return newWord.join("");
  }

  return word;
};

export const nextFocusMode = (focusMode: FocusMode): FocusMode => {
  if (focusMode === "insert") {
    return "overwrite";
  } else if (focusMode === "overwrite") {
    return "insert";
  } else {
    // Should not happen
    return "overwrite";
  }
};

export const getGradientFromFocus = (
  focus: MyFocus | undefined,
  color: string
): string | undefined => {
  if (focus?.isBorder) {
    return `linear(to-r, ${color} 0%, ${color} 80%, red)`;
  }
  if (focus?.focusMode === "insert") {
    return `linear(to-l, ${color} 0%, ${color} 80%, red)`;
  }

  return undefined;
};
