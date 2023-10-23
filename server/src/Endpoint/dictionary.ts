import dict_full_fr from "../../data/fr/dictionary_full.json";
import dict_full_en from "../../data/en/dictionary_full.json";

import dict_pick_fr from "../../data/fr/dictionary.json";
import dict_pick_en from "../../data/en/dictionary.json";

import {
  ServerDictionnary,
  LanguageType,
  ClientDictionnary,
} from "src/utils/type";
import { createHash } from "crypto";

const createDicoHash = (words: string[]) => {
  return createHash("sha256").update(JSON.stringify(words)).digest("hex");
};

const createDico = (
  dicos: ServerDictionnary[],
  tryableWords: string[],
  pickableWords: string[],
  language: LanguageType
) => {
  const dico: ServerDictionnary = {
    pickableWords: pickableWords,
    tryableWordsArray: tryableWords,
    tryableWords: new Set(tryableWords),
    hash: createDicoHash(tryableWords),
    language,
  };

  dicos.push(dico);

  return dico;
};

const dicos: ServerDictionnary[] = [];

export const dicoFr = createDico(dicos, dict_full_fr, dict_pick_fr, "french");
export const dicoEn = createDico(dicos, dict_full_en, dict_pick_en, "english");

export function getUnknownDictionaries(
  known_hashes: string[]
): ClientDictionnary[] {
  return dicos
    .filter((d) => !known_hashes.includes(d.hash))
    .map(({ tryableWordsArray: contentArray, hash, language }) => {
      let dico: ClientDictionnary = { content: contentArray, hash, language };
      return dico;
    });
}

export function dicoHasWord(word: string, language: LanguageType): boolean {
  if (language === "french") {
    return dicoFr.tryableWords.has(word);
  } else if (language === "english") {
    return dicoEn.tryableWords.has(word);
  } else {
    return false;
  }
}
