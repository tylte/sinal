import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import { Game1vs1, Player } from "../utils/types";
import { PlayerGridOld } from "./PlayerGridOld";

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
      <HStack>
        <PlayerGridOld
          isPlayer={true}
          isSolo={false}
          mode={"1vs1"}
          firstLetter={first_letter}
          length={game_length}
          nbLife={game_nb_life}
          id={game_id}
          player={player}
          lobbyId={lobbyId}
        ></PlayerGridOld>
        <PlayerGridOld
          isPlayer={false}
          isSolo={false}
          mode={"1vs1"}
          firstLetter={first_letter}
          length={game_length}
          nbLife={game_nb_life}
          id={game_id}
          player={player}
          lobbyId={lobbyId}
        ></PlayerGridOld>
      </HStack>
    </Box>
  );
};
