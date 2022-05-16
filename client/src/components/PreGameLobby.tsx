import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { usePlayer, useSocket } from "../utils/hooks";
import { Lobby } from "../utils/types";
import { isLobbyJoinable } from "../utils/utils";

interface PreGameLobbyProps {
  lobby: Lobby;
}

export const PreGameLobby: React.FC<PreGameLobbyProps> = ({
  lobby: { name, currentPlace, totalPlace, state, playerList, id },
}) => {
  const socket = useSocket();
  const router = useRouter();
  const [player] = usePlayer();

  useEffect(() => {
    return () => {
      leaveLobby();
    };
  }, []);

  function leaveLobby() {
    socket?.emit("leave_lobby", { roomId: id, id: player?.id });
    router.push("/lobby");
  }

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
        onClick={leaveLobby}
      />
    </Flex>
  );
};
