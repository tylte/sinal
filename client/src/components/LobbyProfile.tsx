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
import { isLobbyJoinable } from "../utils/utils";

interface LobbyProfileProps {
  lobby: Lobby;
}

export const LobbyProfile: React.FC<LobbyProfileProps> = ({
  lobby: {
    name,
    id,
    mode,
    state,
    totalPlace,
    owner,
    playerList,
    nbLifePerPlayer,
    nbRounds,
    language,
  },
}) => {
  const currentPlace = playerList.length;
  let playerOwner = playerList.find(({ id }) => owner === id);
  let isJoinable = isLobbyJoinable(currentPlace, totalPlace, state);
  return (
    <Tooltip label={name}>
      <LinkBox borderWidth="1px" borderRadius="lg" p={2}>
        {isJoinable && (
          <NextLink href={`/lobby/${id}`} passHref>
            <LinkOverlay></LinkOverlay>
          </NextLink>
        )}
        <Stack p={2}>
          <Text
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            color={
              isJoinable
                ? "green.300"
                : state === "in-game"
                ? "orange.300"
                : "red.300"
            }
          >
            {name}
          </Text>
          <HStack>
            <Text fontStyle={"italic"}>
              {mode[0].toUpperCase() + mode.slice(1)}
            </Text>
            <Text fontStyle={"italic"}>
              {currentPlace}/{totalPlace} joueurs
            </Text>
            <Text fontStyle={"italic"}>{state}</Text>
            <Text fontStyle={"italic"}>{nbLifePerPlayer} Vies</Text>
            {mode === "1vs1" && (
              <Text fontStyle={"italic"}>{nbRounds} Round(s)</Text>
            )}
          </HStack>
          {playerOwner !== undefined && (
            <Text>Propriétaire : {playerOwner.name}</Text>
          )}
        </Stack>
      </LinkBox>
    </Tooltip>
  );
};
