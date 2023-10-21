import { Language, LanguageType } from "src/utils/type";
import { nanoid } from "nanoid";
import { dicoEn, dicoFr } from "./dictionary";

export function getId() {
  return nanoid();
}

export function getWord(language: LanguageType): string {
  let content = null;
  if (language === "french") {
    content = dicoFr.contentArray;
  } else if (language === "english") {
    content = dicoEn.contentArray;
  }
  if (!content) {
    throw "No content found";
  } else {
    return content[Math.floor(Math.random() * content.length)];
  }
}
