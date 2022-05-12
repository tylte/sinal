import React from "react";
import { Lobby } from "../utils/types";

interface LobbyProfileProps {
  lobby: Lobby;
}

export const LobbyProfile: React.FC<LobbyProfileProps> = ({ lobby: {} }) => {
  return <>Join me !</>;
};
