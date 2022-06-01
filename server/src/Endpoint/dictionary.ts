import dict_full from "../../../server/data/dictionary_full.json";

const dicoSet: Set<string> = new Set(dict_full);

export function get_dictionary() {
  return dict_full;
}

export function dicoHasWord(word: string) {
  return dicoSet.has(word);
}
