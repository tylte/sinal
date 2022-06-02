import React from "react";
import { BrGameInfo, Game1vs1, GameMode, Player } from "../utils/types";
import { InGameLobbyBr } from "./InGameLobbyBr";
import { OneVsOneGameLobby } from "./OneVsOneGameLobby";

interface InGameLobbyProps {
  player: Player;
  gameState: Game1vs1 | BrGameInfo;
  gameMode: GameMode;
}

export const InGameLobby: React.FC<InGameLobbyProps> = ({
  player,
  gameState,
  gameMode,
}) => {
  if (gameMode === "1vs1") {
    return (
      <OneVsOneGameLobby player={player} gameState={gameState as Game1vs1} />
    );
  } else if (gameMode === "battle-royale") {
    return <InGameLobbyBr player={player} gameInfo={gameState as BrGameInfo} />;
  } else {
    return <h1>Le mode n'existe pas</h1>;
  }
};
