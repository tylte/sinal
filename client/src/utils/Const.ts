export const serverHttpUrl =
  process.env.NEXT_PUBLIC_SERVER_HTTP_URL || "http://localhost:4000";
export const serverWsUrl =
  process.env.NEXT_PUBLIC_SERVER_WS_URL || "ws://localhost:4000";
export const maxPlayerBr = 50;
export const minPlayerBr = 2;

export const maxPlayer1vs1 = 2;
export const minPlayer1vs1 = 2;

export const defaultGlobalTime = 180000;
export const defaultTimeAfterFirstGuess = 30000;
export const defaultEliminationRate = 10;
