import React from "react";
import { Game1vs1, GameMode, Player } from "../utils/types";
import { Layout } from "./Layout";
import { OneVsOneGameLobby } from "./OneVsOneGameLobby";

interface InGameLobbyProps {
  player: Player;
  gameState: Game1vs1;
  GameMode: GameMode;
  lobbyId: string;
}

export const InGameLobby: React.FC<InGameLobbyProps> = ({
  player,
  gameState,
  GameMode,
  lobbyId,
}) => {
  if (GameMode === "1vs1") {
    return (
      <OneVsOneGameLobby
        lobbyId={lobbyId}
        player={player}
        gameState={gameState}
      />
    );
  } else {
    return <Layout>Le mode de jeu n'existe pas</Layout>;
  }
};
