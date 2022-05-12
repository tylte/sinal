import { Stack, Button, Text } from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";

interface GameModeMenuProps {}

export const GameModeMenu: React.FC<GameModeMenuProps> = ({}) => {
  const router = useRouter();

  return (
    <Stack spacing={4} direction="column" align="center">
      <Text fontWeight={"bold"} fontSize="2xl">
        selectionne un mode de jeu
      </Text>
      <Stack w={240} spacing={4}>
        <Button
          onClick={() => router.push("/solo")}
          colorScheme="teal"
          w="100%"
          variant={"outline"}
        >
          solo
        </Button>
        <Button
          onClick={() => router.push("/solo")}
          colorScheme="teal"
          w="100%"
          variant={"outline"}
        >
          creer un lobby
        </Button>
        <Button
          onClick={() => router.push("/lobby")}
          colorScheme="teal"
          w="100%"
          variant={"outline"}
        >
          aller aux lobbies
        </Button>
      </Stack>
    </Stack>
  );
};
