import { LetterResult, LobbyState } from "./types";

export const isWordCorrect = (result: LetterResult[]): boolean => {
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
