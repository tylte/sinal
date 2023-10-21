/**
 * http url of the server. default : http://localhost:4000
 */
export const serverHttpUrl =
  process.env.NEXT_PUBLIC_SERVER_HTTP_URL || "http://localhost:4000";

/**
 * websocket url of the server. defaut : ws://localhost:4000
 */
export const serverWsUrl =
  process.env.NEXT_PUBLIC_SERVER_WS_URL || "ws://localhost:4000";

/**
 * Number of life (default)
 */
export const defaultNbLife = 6;

/**
 * Number of rounds (default)
 */
export const defaultNbRounds = 1;

/**
 * Maximum of player possible on a battle royale game
 */
export const maxPlayerBr = 50;
/**
 * Min of player possible on a battle royale game
 */
export const minPlayerBr = 2;

/**
 * Maximum of player possible on a 1vs1 game
 */
export const maxPlayer1vs1 = 2;

/**
 * Minimum of player possible on a 1vs1 game
 */
export const minPlayer1vs1 = 2;

/**
 * Time in milliseconds to guess a word on a battle royale game
 */
export const defaultGlobalTimeBr = 180000;

/**
 * Time in milliseconds to guess a word on a battle royale game after someone found the word
 */
export const defaultTimeAfterFirstGuessBr = 30000;

/**
 * Rate in percentage of the player to be eliminated per battle royale round
 */
export const defaultEliminationRate = 10;

/**
 * Time in milliseconds to guess a word on a 1vs1 game
 */
export const defaultGlobalTime1vs1 = 600000;

/**
 * Time in milliseconds to guess a word on a 1vs1 game after opponent found the word
 */
export const defaultTimeAfterFirstGuess1vs1 = 60000;

/**
 * Local storage key to story dictionnaries
 */
export const dictHashStorageKey = "dicts";
