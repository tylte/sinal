export const serverHttpUrl =
  process.env.SERVER_HTTP_URL || "http://localhost:4000/api";
export const serverWsUrl = process.env.SERVER_WS_URL || "ws://localhost:4000";

export const serverWsPath = process.env.SERVER_WS_PATH || "/api/socket.io";
export const maxPlayerBr = 50;
export const minPlayerBr = 2;

export const maxPlayer1vs1 = 2;
export const minPlayer1vs1 = 2;

export const defaultGlobalTimeBr = 180000;
export const defaultTimeAfterFirstGuessBr = 30000;
export const defaultEliminationRate = 10;

export const defaultGlobalTime1vs1 = 600000;
export const defaultTimeAfterFirstGuess1vs1 = 60000;
