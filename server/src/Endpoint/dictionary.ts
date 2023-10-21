import dict_full_fr from "../../data/fr/dictionary_full.json";
import dict_full_en from "../../data/en/dictionary_full.json";
import { Dictionnary, Language } from "src/utils/type";
import { createHash } from "crypto";

const createDicoHash = (words: string[]) => {
  return createHash("sha256").update(JSON.stringify(words)).digest("hex");
};

const createDico = (
  dicos: Dictionnary[],
  words: string[],
  language: Language
) => {
  const dico: Dictionnary = {
    content: new Set(words),
    hash: createDicoHash(words),
    language,
  };

  dicos.push(dico);

  return dico;
};

const dicos: Dictionnary[] = [];

const dicoFr = createDico(dicos, dict_full_fr, "french");
const dicoEn = createDico(dicos, dict_full_en, "english");

export function getUnknownDictionaries(known_hashes: string[]): Dictionnary[] {
  return dicos.filter((d) => known_hashes.includes(d.hash));
}

export function dicoHasWord(word: string, language: Language): boolean {
  if (language === "french") {
    return dicoFr.content.has(word);
  } else if (language === "english") {
    return dicoEn.content.has(word);
  } else {
    return false;
  }
}
