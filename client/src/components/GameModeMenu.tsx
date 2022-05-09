import { Stack, Button, Text } from "@chakra-ui/react";
import React from "react";

interface GameModeMenuProps {}

export const GameModeMenu: React.FC<GameModeMenuProps> = ({}) => {
  return (
    <Stack spacing={4} direction="column" align="center">
      <Text fontWeight={"bold"} fontSize="2xl">
        Selectionne un mode de jeu
      </Text>
      <Stack w={240}>
        <Button colorScheme="teal" w="100%" variant={"outline"}>
          Solo
        </Button>
      </Stack>
    </Stack>
  );
};
