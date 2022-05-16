import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { usePlayer, useSocket } from "../utils/hooks";
import { Lobby } from "../utils/types";
import { isLobbyJoinable } from "../utils/utils";

interface PreGameLobbyProps {
  lobby: Lobby;
}

export const PreGameLobby: React.FC<PreGameLobbyProps> = ({
  lobby: { name, currentPlace, totalPlace, state, id },
}) => {
  const socket = useSocket();
  const router = useRouter();
  const [player] = usePlayer();

  function leaveLobby() {
      socket?.emit('leave_lobby', {roomId: id, id: player?.id})
      router.push("/lobby")
  }

  const placeStatus = isLobbyJoinable(currentPlace, totalPlace, state)
    ? "Plein"
    : "En attente de joueur";

  return (
    <Flex direction={"column"} alignContent={"center"}>
      <Box mx="auto">
        <Text fontSize={"4xl"}>
          {name} - {placeStatus}
        </Text>
      </Box>
      <IconButton aria-label="quit lobby" icon={<ArrowBackIcon/>} onClick={leaveLobby}/>
    </Flex>
  );
};
