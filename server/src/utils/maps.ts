import { ChatMessageToSend, Game1vs1, GameBr, LobbyType, Player } from "./type";

export const lobbyMap: Map<string, LobbyType> = new Map();
export const playerMap: Map<string, Player> = new Map();
export const game1vs1Map: Map<string, Game1vs1> = new Map();
export const gameBrMap: Map<string, GameBr> = new Map();
export const timeoutMap: Map<string, NodeJS.Timeout> = new Map();
export const disconnectMap: Map<string, any> = new Map();
export const channelIdToHistory: Map<string, ChatMessageToSend[]> = new Map();

export const idToWord: Map<string, string> = new Map();
