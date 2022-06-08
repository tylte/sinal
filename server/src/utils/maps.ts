import { Game1vs1, GameBr, LobbyType, Player } from "./type";

export let lobbyMap: Map<string, LobbyType> = new Map();
export let playerMap: Map<string, Player> = new Map();
export let game1vs1Map: Map<string, Game1vs1> = new Map();
export let gameBrMap: Map<string, GameBr> = new Map();
export let timeoutMap: Map<string, NodeJS.Timeout> = new Map();
