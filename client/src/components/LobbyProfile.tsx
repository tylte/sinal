import {
  HStack,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { Lobby } from "../utils/types";
import NextLink from "next/link";
import { PlayerList } from "./PlayerList";
import { isLobbyJoinable } from "../utils/utils";

interface LobbyProfileProps {
  lobby: Lobby;
}

export const LobbyProfile: React.FC<LobbyProfileProps> = ({
  lobby: { name, id, mode, state, currentPlace, totalPlace, owner, playerList },
}) => {
  return (
    <Tooltip label={name}>
      <LinkBox borderWidth="1px" borderRadius="lg" p={2}>
        {isLobbyJoinable(currentPlace, totalPlace, state) && (
          <NextLink href={`/lobby/${id}`} passHref>
            <LinkOverlay></LinkOverlay>
          </NextLink>
        )}
        <Stack p={2}>
          <Text
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
          >
            {name}
          </Text>
          <HStack>
            <Text fontStyle={"italic"}>{mode}</Text>
            <Text fontStyle={"italic"}>
              {currentPlace}/{totalPlace} joueurs
            </Text>
            <Text fontStyle={"italic"}>{state}</Text>
          </HStack>
          <PlayerList owner={owner} players={playerList} />
        </Stack>
      </LinkBox>
    </Tooltip>
  );
};
