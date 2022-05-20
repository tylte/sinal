import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import { Game1vs1, Player } from "../utils/types";

interface InGameLobbyProps {
  player: Player;
  gameState: Game1vs1;
  lobbyId: string | null;
}

export const InGameLobby: React.FC<InGameLobbyProps> = ({
  player,
  gameState: {
    first_letter,
    id: game_id,
    length: game_length,
    nb_life: game_nb_life,
  },
  lobbyId,
}) => {
  return (
    <Box>
      <HStack></HStack>
    </Box>
  );
};
