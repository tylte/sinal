import { Box } from "@chakra-ui/react";
import React from "react";
import { Lobby } from "../utils/types";

interface PostGameLobbyProps {
  lobby: Lobby;
}

export const PostGameLobby: React.FC<PostGameLobbyProps> = ({ lobby }) => {
  return <Box>Game finished - {lobby.name}</Box>;
};
