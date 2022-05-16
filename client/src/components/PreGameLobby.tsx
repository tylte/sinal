import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Lobby } from "../utils/types";
import { isLobbyJoinable } from "../utils/utils";

interface PreGameLobbyProps {
  lobby: Lobby;
}

export const PreGameLobby: React.FC<PreGameLobbyProps> = ({
  lobby: { name, currentPlace, totalPlace, state, playerList },
}) => {
  const placeStatus = isLobbyJoinable(currentPlace, totalPlace, state)
    ? "En attente de joueur"
    : "Plein";

  return (
    <Flex direction={"column"} alignContent={"center"}>
      <Box mx="auto">
        <Text fontSize={"4xl"}>
          {name} - {placeStatus}
        </Text>
      </Box>
    </Flex>
  );
};
