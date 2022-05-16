import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Lobby } from "../utils/types";
import { isLobbyJoinable } from "../utils/utils";

interface PreGameLobbyProps {
  lobby: Lobby;
}

export const PreGameLobby: React.FC<PreGameLobbyProps> = ({
  lobby: { name, currentPlace, totalPlace, state, id },
}) => {
  const router = useRouter();

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
      <IconButton
        aria-label="quit lobby"
        icon={<ArrowBackIcon />}
        onClick={() => router.push("/lobby")}
      />
    </Flex>
  );
};
