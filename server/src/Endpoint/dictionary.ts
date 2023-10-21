import dict_full_fr from "../../data/fr/dictionary_full.json";
import dict_full_en from "../../data/en/dictionary_full.json";
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
  words: string[],
  language: LanguageType
) => {
  const dico: ServerDictionnary = {
    contentArray: words,
    content: new Set(words),
    hash: createDicoHash(words),
    language,
  };

  dicos.push(dico);

  return dico;
};

const dicos: ServerDictionnary[] = [];

export const dicoFr = createDico(dicos, dict_full_fr, "french");
export const dicoEn = createDico(dicos, dict_full_en, "english");

export function getUnknownDictionaries(
  known_hashes: string[]
): ClientDictionnary[] {
  return dicos
    .filter((d) => !known_hashes.includes(d.hash))
    .map(({ contentArray, hash, language }) => {
      let dico: ClientDictionnary = { content: contentArray, hash, language };
      return dico;
    });
}

export function dicoHasWord(word: string, language: LanguageType): boolean {
  if (language === "french") {
    return dicoFr.content.has(word);
  } else if (language === "english") {
    return dicoEn.content.has(word);
  } else {
    return false;
  }
}
