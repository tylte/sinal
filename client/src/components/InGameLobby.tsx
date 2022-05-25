import React from "react";
import { BrGameInfo, Game1vs1, GameMode, Player } from "../utils/types";
import { InGameLobbyBr } from "./InGameLobbyBr";
import { OneVsOneGameLobby } from "./OneVsOneGameLobby";

interface InGameLobbyProps {
  player: Player;
  gameState: Game1vs1 | BrGameInfo;
  GameMode: GameMode;
}

export const InGameLobby: React.FC<InGameLobbyProps> = ({
  player,
  gameState,
  GameMode,
}) => {
  if ((GameMode === "1vs1")) {
    return <OneVsOneGameLobby player={player} gameState={gameState as Game1vs1} />;
  } else {
    return (
      <InGameLobbyBr
        player={player}
        gameInfo={gameState as BrGameInfo}
      />
    );
  }
};
