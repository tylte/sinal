import React from "react";
import { BrGameInfo, Game1vs1, GameMode, Lobby, Player } from "../utils/types";
import { InGameLobbyBr } from "./InGameLobbyBr";
import { OneVsOneGameLobby } from "./OneVsOneGameLobby";

interface InGameLobbyProps {
  player: Player;
  gameState: Game1vs1 | BrGameInfo;
  gameMode: GameMode;
  lobby: Lobby;
}

export const InGameLobby: React.FC<InGameLobbyProps> = ({
  player,
  gameState,
  gameMode,
  lobby,
}) => {
  if (gameMode === "1vs1") {
    return (
      <OneVsOneGameLobby
        lobby={lobby}
        player={player}
        gameState={gameState as Game1vs1}
      />
    );
  } else if (gameMode === "battle-royale") {
    return <InGameLobbyBr player={player} gameInfo={gameState as BrGameInfo} lobby={lobby} />;
  } else {
    return <h1>Le mode n'existe pas</h1>;
  }
};
