export type Player = {
  id: string;
  name: string;
};
export type GameMode = "1vs1";
export type LobbyState = "in-game" | "pre-game" | "finished";

export class Lobby {
  public id: string;
  public state: LobbyState;
  public name: string;
  public totalPlace: number; // nombre de place que le lobby peut contenir en tt
  public currentPlace: number; // nb de joueur dans le lobby actuellement
  public playerList: Player[];
  public owner: string; // id du joueur owner
  public isPublic: boolean;
  public mode: GameMode;
}

export let lobbyMap: Map<string, Lobby> = new Map();

export let playerMap: Map<string, Player> = new Map();
