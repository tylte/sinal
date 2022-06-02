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
  totalPlace: z.number(),
  playerList: Player.array(),
  nbLifePerPlayer: z.number(),
  owner: z.string(), // id du joueur owner
  isPublic: z.boolean(),
  mode: GameMode,
  currentGameId: z.nullable(z.string()),
});

export const Game1vs1 = z.object({
  playerOne: z.object({
    id: z.string(),
    name: z.string(),
    nb_life: z.number(),
  }),
  playerTwo: z.object({
    id: z.string(),
    name: z.string(),
    nb_life: z.number(),
  }),
  id: z.string(),
  length: z.number(),
  first_letter: z.string(),
});

export type Game1vs1 = z.infer<typeof Game1vs1>;

//use in create_lobby
export const ArgCreateLobby = z.object({
  mode: GameMode,
  place: z.number(),
  isPublic: z.boolean(),
  owner: Player,
  name: z.string(),
  nbRounds: z.number(),
  nbLife: z.number(),
});

export const ArgUpdateLobby = z.object({
  lobbyId: z.string(),
  mode: GameMode,
  place: z.number(),
  isPublic: z.boolean(),
  name: z.string(),
  nbRounds: z.number(),
  nbLife: z.number(),
});

export const ArgJoinLobby = z.object({
  lobbyId: z.string(),
  playerId: z.string(),
});

export const ArgLeaveLobby = z.object({
  lobbyId: z.string(),
  playerId: z.string(),
});

export const ArgUpdateWord = z.object({
  word: z.string(),
  gameId: z.string(),
  playerId: z.string(),
});

export const ArgStartGame = z.object({
  lobbyId: z.string(),
  playerId: z.string(),
});
export const ReceivedChatMessage = z.object({
  content: z.string(),
  playerId: z.string(),
});

export type LobbyType = z.infer<typeof Lobby>;
export type ArgCreateLobbyType = z.infer<typeof ArgCreateLobby>;
export type ArgJoinLobbyType = z.infer<typeof ArgJoinLobby>;
export type ArgLeaveLobbyType = z.infer<typeof ArgLeaveLobby>;
export type ArgStartGameType = z.infer<typeof ArgStartGame>;
export type ArgUpdateWord = z.infer<typeof ArgUpdateWord>;
export type ReceivedChatMessageType = z.infer<typeof ReceivedChatMessage>;

export let lobbyMap: Map<string, LobbyType> = new Map();

export let playerMap: Map<string, Player> = new Map();

export let game1vs1Map: Map<string, Game1vs1> = new Map();

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

export type EventResponseFn = (payload: PacketType) => void;

export type ChatMessageToSend = {
  content: string;
  author: string;
  id: string;
};
