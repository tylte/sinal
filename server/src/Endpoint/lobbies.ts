import { lobbyMap, LobbyType } from "../utils/type";

export function get_lobbies() {
    let ret : LobbyType[] = new Array();
    lobbyMap.forEach((value : LobbyType) => {
        ret.push(value);
    });
    return ret;
}