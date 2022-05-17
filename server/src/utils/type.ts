import { number, z } from "zod";

export const Player = z.object({
  id: z.string(),
  name: z.string(),
  lobbyId: z.nullable(z.string()),
});

export type Player = z.infer<typeof Player>;

const GameModeEnum = {
  Mod1: "1vs1",
  Mod2: "battle-royale",
} as const;
export const GameMode = z.nativeEnum(GameModeEnum);
export type GameModeType = z.infer<typeof GameMode>;

const LobbyStateEnum = {
  Type1: "in-game",
  Type2: "pre-game",
  Type3: "finished",
} as const;
export const LobbyState = z.nativeEnum(LobbyStateEnum);
export type LobbyStateType = z.infer<typeof GameMode>;

export const Lobby = z.object({
  id: z.string(),
  state: LobbyState,
  name: z.string(),
  totalPlace: z.number(), // nombre de place que le lobby peut contenir en tt
  playerList: Player.array(),
  owner: z.string(), // id du joueur owner
  isPublic: z.boolean(),
  mode: GameMode,
});

export const Game1vs1 = z.object({
  id: z.string(),
});

export type Game1vs1 = z.infer<typeof Game1vs1>;

//use in create_lobby
export const ArgCreateLobby = z.object({
  mode: GameMode,
  place: z.number(),
  isPublic: z.boolean(),
  owner: Player,
  name: z.string(),
});

export const ArgJoinLobby = z.object({
  lobbyId: z.string(),
  playerId: z.string(),
});

export const ArgUpdateWord = z.object({
  word: z.string(),
  lobbyId: z.string(),
  playerId: z.string(),
});

export const ArgStartGame = z.object({
  lobbyId: z.string(),
  playerId: z.string(),
});

export type LobbyType = z.infer<typeof Lobby>;

export let lobbyMap: Map<string, LobbyType> = new Map();

export let playerMap: Map<string, Player> = new Map();

export let Game1vs1Map: Map<string, Game1vs1> = new Map();

export type JoinLobbyResponse = (payload: {
  success: boolean;
  message: string;
}) => void;

export const Packet = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any(),
});

export type PacketType = z.infer<typeof Packet>;
