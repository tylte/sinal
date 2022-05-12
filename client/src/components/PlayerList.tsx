import { Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Player } from "../utils/types";

interface PlayerListProps {
  owner: string;
  players: Player[];
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, owner }) => {
  return (
    <Stack>
      {players.map(({ id, name }) => (
        <Text key={id}>
          {name}
          {id === owner && " (owner)"}
        </Text>
      ))}
    </Stack>
  );
};
