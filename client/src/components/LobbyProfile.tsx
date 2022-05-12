import { LinkBox, LinkOverlay, Stack, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { Lobby } from "../utils/types";
import NextLink from "next/link";

interface LobbyProfileProps {
  lobby: Lobby;
}

export const LobbyProfile: React.FC<LobbyProfileProps> = ({
  lobby: { name, id, mode },
}) => {
  return (
    <Tooltip label={name}>
      <LinkBox borderWidth="1px" borderRadius="lg" p={2}>
        <NextLink href={`/lobby/${id}`} passHref>
          <LinkOverlay></LinkOverlay>
        </NextLink>
        <Stack>
          <Text
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
          >
            {name}
          </Text>
          <Text fontStyle={"italic"}>{mode}</Text>
          <Text fontStyle={"italic"}>{mode}</Text>
        </Stack>
      </LinkBox>
    </Tooltip>
  );
};
