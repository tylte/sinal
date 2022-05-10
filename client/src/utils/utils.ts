import { LetterResult } from "./types";

export const hasWon = (result: LetterResult[]): boolean => {
  for (let i = 0; i < result.length; i++) {
    const res = result[i];
    if (res !== LetterResult.RIGHT_POSITION) {
      return false;
    }
  }

  return true;
};

export const getColorFromResult = (result: LetterResult[]): string[] => {
  const ret = [];
  for (let i = 0; i < result.length; i++) {
    const res = result[i];
    if (res === LetterResult.RIGHT_POSITION) {
      ret.push("green.300");
    } else if (res === LetterResult.FOUND) {
      ret.push("orange.400");
    } else if (res === LetterResult.NOT_FOUND) {
      ret.push("blackAlpha.900");
    }
  }

  return ret;
};
