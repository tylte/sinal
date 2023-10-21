import { Dispatch, SetStateAction } from "react";
import {
  FocusMode,
  KeyboardSettings,
  Language,
  LastGame,
  LetterResult,
  LobbyState,
  MyFocus,
  TriesHistory,
} from "./types";

/**
 * From letter result, tells if the player has the correct word or no
 */
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

/**
 * From a letter result, get the color to display
 */
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

/**
 * Tells if a lobby is joinable
 */
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

/**
 * Append the letter to the word depending to the focus
 * @param letter the letter typed
 * @param setWord set word hook
 * @param wordLength the lenght of the word to be guessed
 * @param focus the state of the current focus
 */
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

/**
 * Remove a letter from the word depending on the focus
 * @param setWord
 * @param focus
 */
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

/**
 * Get the classic keyboard settings
 * @param onEnter What happens when the user click the enter key
 * @param setWord set word hook
 * @param focus the focus state
 * @param setFocus set focus hook
 * @param wordLength the length of the word to be guessed
 * @returns
 */
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

/**
 * Tells if firstRes is a better result than second res
 *
 * Example :
 *    firstRes: NOT_FOUND,
 *    secondRes: FOUND
 *    Will return false
 *
 *
 *    firstRes: FOUND,
 *    secondRes: FOUND
 *    Will return false
 *
 *
 *    firstRes: FOUND,
 *    secondRes: NOT_FOUND
 *    Will return true
 *
 * @param firstRes
 * @param secondRes
 */
export const isLetterResultBetter = (
  firstRes: LetterResult,
  secondRes: LetterResult
): boolean => {
  if (firstRes === LetterResult.NOT_FOUND) {
    return false;
  } else if (
    firstRes === LetterResult.FOUND &&
    (secondRes === LetterResult.FOUND ||
      secondRes === LetterResult.RIGHT_POSITION)
  ) {
    return false;
  } else if (
    firstRes === LetterResult.RIGHT_POSITION &&
    secondRes === LetterResult.RIGHT_POSITION
  ) {
    return false;
  }

  return true;
};

/**
 * Get the letter to color hashmap for the tries history in order to display the color on the keyboard
 */
export const getLetterToColorFromTriesHistory = (
  triesHistory: TriesHistory[]
): Map<string, string> => {
  const ret: Map<string, string> = new Map();
  const cache: Map<string, LetterResult> = new Map();

  triesHistory.forEach((oneTry) => {
    const { result, wordTried } = oneTry;

    for (let i = 0; i < result.length; i++) {
      const res = result[i];

      const cacheContent = cache.get(wordTried[i]);

      if (
        cacheContent === undefined ||
        isLetterResultBetter(res, cacheContent)
      ) {
        cache.set(wordTried[i], res);
        ret.set(wordTried[i], getColorFromResult(res));
      }
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

    if (focus.firstLetterWritable) {
      return { ...focus, firstLetterWritable: false };
    }

    return focus;
  });
};

/**
 * Return the new word with the letter at the right place depending on the focus
 */
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

/**
 * Change focus mode
 */
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

/**
 * Get focus mode dispay
 */
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

export const getStringFromHistory = (
  history: number[][],
  game: LastGame,
  indexOfPlayer: number,
  indexOfWord: number
): string => {
  let ret = game.playerList[indexOfPlayer].name + " : \n";
  if (history.length === 0)
    for (let i = 0; i < game.wordsToGuess[indexOfWord].length; i++) ret += "⬛";
  else {
    for (let j = 0; j < history.length; j++) {
      for (let i = 0; i < history[j].length; i++) {
        if (history[j][i] === LetterResult.RIGHT_POSITION) ret += "🟩";
        else if (history[j][i] === LetterResult.FOUND) ret += "🟧";
        else ret += "⬛";
      }
      ret += "\n";
    }
  }
  return ret;
};

export const languageToCountryCode = (language: Language) => {
  if (language === "english") {
    return "US";
  } else if (language === "french") {
    return "FR";
  } else {
    // By default fr ig
    return "FR";
  }
};
