export type Player = {
  id: string;
  name: string;
};
export type GameMode = "1vs1";
export type LobbyState = "in-game" | "pre-game" | "finished";

export type Lobby = {
  id: string;
  state: LobbyState;
  name: string;
  totalPlace: number; // nombre de place que le lobby peut contenir en tt
  currentPlace: number; // nb de joueur dans le lobby actuellement
  playerList: Player[];
  owner: string; // id du joueur owner
  isPublic: boolean;
  mode: GameMode;
};

export let lobbyMap: Map<string, Lobby> = new Map();

export let playerMap: Map<string, Player> = new Map();
