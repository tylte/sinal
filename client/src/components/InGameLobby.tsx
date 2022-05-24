import { Box, HStack } from "@chakra-ui/react";
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
  return (
    <Layout variant="grid">
      <OneVsOneGameLobby
        player={player}
        gameState={gameState}
      ></OneVsOneGameLobby>
    </Layout>
    // <Box>
    //   <HStack>
    //     <PlayerGrid
    //       isPlayer={true}
    //       isSolo={false}
    //       firstLetter={first_letter}
    //       length={game_length}
    //       nbLife={game_nb_life}
    //       id={game_id}
    //       player={player}
    //       lobbyId={lobbyId}
    //     ></PlayerGrid>
    //     <PlayerGrid
    //       isPlayer={false}
    //       isSolo={false}
    //       firstLetter={first_letter}
    //       length={game_length}
    //       nbLife={game_nb_life}
    //       id={game_id}
    //       player={player}
    //       lobbyId={lobbyId}
    //     ></PlayerGrid>
    //   </HStack>
    // </Box>
  );
};
