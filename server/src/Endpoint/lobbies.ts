import { lobbyMap, LobbyType } from "../utils/type";

export function get_lobbies() {
    let ret : LobbyType[] = new Array();
    lobbyMap.forEach((value : LobbyType) => {
        if ( value.isPublic ) 
            ret.push(value);
    });
    return ret;
}

export function get_lobby_id(id: string) {
    if (lobbyMap.get(id) !== undefined) {
        return lobbyMap.get(id)
    } else {
        return null
    }
}