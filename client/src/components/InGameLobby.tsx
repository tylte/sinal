import React, { Dispatch, SetStateAction } from "react";
import { BrGameInfo, Game1vs1, GameMode, Lobby, Player } from "../utils/types";
import { InGameLobbyBr } from "./InGameLobbyBr";
import { OneVsOneGameLobby } from "./OneVsOneGameLobby";

interface InGameLobbyProps {
  player: Player;
  gameState: Game1vs1 | BrGameInfo;
  gameMode: GameMode;
  lobby: Lobby;
  setGameState: Dispatch<SetStateAction<Game1vs1 | BrGameInfo | null>>;
}

export const InGameLobby: React.FC<InGameLobbyProps> = ({
  player,
  gameState,
  gameMode,
  lobby,
  setGameState,
}) => {
  if (gameMode === "1vs1") {
    return (
      <OneVsOneGameLobby
        lobby={lobby}
        player={player}
        gameState={gameState as Game1vs1}
        setGameState={setGameState}
      />
    );
  } else if (gameMode === "battle-royale") {
    return <InGameLobbyBr player={player} gameInfo={gameState as BrGameInfo} />;
  } else {
    return <h1>Le mode n'existe pas</h1>;
  }
};
