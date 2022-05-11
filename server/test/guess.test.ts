import { get_guess, LetterResult } from "../src/Endpoint/guess";

let idToWord : Map<string, string> = new Map();
idToWord.set("a", "abcd");
idToWord.set("b", "abca");
idToWord.set("c", "abad");
idToWord.set("d", "trottez");

describe("testing get_guess", () => {
  test("tout bon", () => {
    expect(get_guess("a", "abcd", idToWord)).toStrictEqual([LetterResult.RIGHT_POSITION, LetterResult.RIGHT_POSITION, LetterResult.RIGHT_POSITION, LetterResult.RIGHT_POSITION]);
  });
  test("rien bon", () => {
    expect(get_guess("a", "zzzz", idToWord)).toStrictEqual([LetterResult.NOT_FOUND, LetterResult.NOT_FOUND, LetterResult.NOT_FOUND, LetterResult.NOT_FOUND]);
  });
  test("mauvais ordre", () => {
    expect(get_guess("a", "dcba", idToWord)).toStrictEqual([LetterResult.FOUND, LetterResult.FOUND, LetterResult.FOUND, LetterResult.FOUND]);
  });
  test("bien placée puis même lettre", () => {
    expect(get_guess("a", "aazz", idToWord)).toStrictEqual([LetterResult.RIGHT_POSITION, LetterResult.NOT_FOUND, LetterResult.NOT_FOUND, LetterResult.NOT_FOUND]);
  });
  test("2 lettres mal placées", () => {
    expect(get_guess("b", "zaaz", idToWord)).toStrictEqual([LetterResult.NOT_FOUND, LetterResult.FOUND, LetterResult.FOUND, LetterResult.NOT_FOUND]);
  });
  test("bien placée puis mal placée", () => {
    expect(get_guess("c", "aazz", idToWord)).toStrictEqual([LetterResult.RIGHT_POSITION, LetterResult.FOUND, LetterResult.NOT_FOUND, LetterResult.NOT_FOUND]);
  });
  test("2 lettres", () => {
    expect(get_guess("d", "trottez", idToWord)).toStrictEqual([LetterResult.RIGHT_POSITION, LetterResult.RIGHT_POSITION, LetterResult.RIGHT_POSITION, LetterResult.RIGHT_POSITION, LetterResult.RIGHT_POSITION, LetterResult.RIGHT_POSITION, LetterResult.RIGHT_POSITION]);
  });
});
