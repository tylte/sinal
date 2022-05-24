import React from "react";
import { Game1vs1, Player } from "../utils/types";
import { Layout } from "./Layout";
import { OneVsOneGameLobby } from "./OneVsOneGameLobby";

interface InGameLobbyProps {
  player: Player;
  gameState: Game1vs1;
  lobbyId: string | null;
}

export const InGameLobby: React.FC<InGameLobbyProps> = ({
  player,
  gameState,
  lobbyId,
}) => {
  return <OneVsOneGameLobby player={player} gameState={gameState} />;
};
