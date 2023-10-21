export interface StartGameResponse {
  length: number;
  firstLetter: string;
  id: string;
  nb_life: number;
}

export interface TriesHistory {
  wordTried: string;
  result: LetterResult[];
}

export enum LetterResult {
  RIGHT_POSITION,
  FOUND,
  NOT_FOUND,
}

export type Player = {
  id: string;
  name: string;
  lobbyId: string | null;
};

export type DictionnaryResponse = {
  content: string[];
  hash: string;
  language: Language;
};

export type Dictionnary = {
  content: Set<string>;
  hash: string;
  language: Language;
};

export type Language = "french" | "english";
export type GameMode = "1vs1" | "battle-royale";
export type LobbyState = "in-game" | "pre-game" | "finished";

export type Lobby = {
  id: string;
  state: LobbyState;
  name: string;
  totalPlace: number; // nombre de place que le lobby peut contenir en tt
  playerList: Player[];
  nbLifePerPlayer: number;
  nbRounds: number;
  globalTime: number;
  timeAfterFirstGuess: number;
  owner: string; // id du joueur owner
  isPublic: boolean;
  mode: GameMode;
  language: Language;
  currentGameId: string;
  lastGame: LastGame | null;
  eliminationRate: number;
};

export type Packet = {
  success: boolean;
  message: string;
  data: any;
};
export type UpdateLobbyJoinPayload = {
  lobby: Lobby;
};
export type UpdateLobbyLeavePayload = {
  lobbyId: string;
  lobby: Lobby | null;
};
export type Game1vs1 = {
  playerOne: Player1vs1;
  playerTwo: Player1vs1;
  id: string;
  length: number;
  firstLetter: string;
  endTime: number;
  globalTime: number;
  timeAfterFirstGuess: number;
  roundNumber: number;
  nbRoundsTotal: number;
};

export type SoloGameState = {
  wordLength: number;
  wordId: string;
  firstLetter: string;
  nbLife: number;
  triesHistory: TriesHistory[];
  isFinished: boolean;
  hasWon: boolean;
};

export type BrGameState = {
  playerId: string;
  playerName: string;
  wordLength: number;
  wordId: string;
  firstLetter: string;
  nbLife: number;
  triesHistory: TriesHistory[];
  isFinished: boolean;
  hasWon: boolean;
};
export type PlayerBr = {
  id: string;
  name: string;
  nbLife: number;
};

export type BrGameInfo = {
  endTime: number;
  playerList: PlayerBr[];
  playerFound: PlayerBr[];
  playersLastNextRound: number;
  id: string;
  length: number;
  firstLetter: string;
  eliminationRate: number;
  globalTime: number;
  timeAfterFirstGuess: number;
  nbLifePerPlayer: number;
};

export type KeyboardSettings = {
  onEnter: () => void;
  onKeydown: (letter: string) => void;
  onBackspace: () => void;
};

export type Player1vs1 = {
  id: string;
  name: string;
  nbLife: number;
  hasWon: boolean;
  nbWins: number;
};

export type ChatMessage = {
  isAnnoncement: boolean;
  channelId: string;
  content: string;
  author: string;
  id: string;
};

export type MyFocus = {
  index: number;
  isBorder: boolean;
  focusMode: FocusMode;
  firstLetterWritable: boolean;
};

export type LastGame = {
  gameMode: GameMode;
  playerList: Player[];
  winner: Player | null;
  wordsToGuess: string[];
  triesHistory: number[][][]; //player (same index than in playerList) - word tried - letter tried
};

export type FocusMode = "overwrite" | "insert";

export const twoDigits = (num: number) => String(num).padStart(2, "0");

export type ChatChannel = {
  id: string;
  name: string;
  messageHistory: ChatMessage[];
};

export type ChattingActions = {
  isChatting: boolean;
  channels: ChatChannel[];
};
