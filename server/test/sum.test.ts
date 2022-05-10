import { get_guess, RIGHT_POSITION, FOUND, NOT_FOUND } from "../src/Endpoint/guess";

let idToWord : Map<string, string> = new Map();
idToWord.set("a", "abcd");
idToWord.set("b", "abca");
idToWord.set("c", "abad");

describe("testing get_guess", () => {
  test("tout bon", () => {
    expect(get_guess("a", "abcd", idToWord)).toStrictEqual([RIGHT_POSITION, RIGHT_POSITION, RIGHT_POSITION, RIGHT_POSITION]);
  });
  test("rien bon", () => {
    expect(get_guess("a", "zzzz", idToWord)).toStrictEqual([NOT_FOUND, NOT_FOUND, NOT_FOUND, NOT_FOUND]);
  });
  test("mauvais ordre", () => {
    expect(get_guess("a", "dcba", idToWord)).toStrictEqual([FOUND, FOUND, FOUND, FOUND]);
  });
  test("bien placée puis même lettre", () => {
    expect(get_guess("a", "aazz", idToWord)).toStrictEqual([RIGHT_POSITION, NOT_FOUND, NOT_FOUND, NOT_FOUND]);
  });
  test("2 lettres mal placées", () => {
    expect(get_guess("b", "zaaz", idToWord)).toStrictEqual([NOT_FOUND, FOUND, FOUND, NOT_FOUND]);
  });
  test("bien placée puis mal placée", () => {
    expect(get_guess("c", "aazz", idToWord)).toStrictEqual([RIGHT_POSITION, FOUND, NOT_FOUND, NOT_FOUND]);
  });
});
