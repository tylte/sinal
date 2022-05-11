
export type Player = {
    id: string,
    name: string,
}
export type GameMode = "1vs1";
export type LobbyState = "in-game" | "pre-game" | "finished";

export class Lobby {
            constructor(id: string, state: LobbyState, name: string, totalPlace: number, owner:string, isPublic:boolean, mode:GameMode) {
                this.id = id;
                this.state = state;
                this.name = name;
                this.totalPlace = totalPlace;
                this.currentPlace = 1;
                this.playerList[0].id = id;
                this.playerList[0].name = owner;
                this.owner = owner;
                this.isPublic = isPublic;
                this.mode = mode;
            }
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

export let lobbyMap : Map<string,Lobby> = new Map();

export let playerMap :Map<string,Player> = new Map();