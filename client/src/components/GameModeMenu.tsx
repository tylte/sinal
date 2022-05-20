import { Stack, Button, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import { CreatePlayerModal } from "./CreatePlayerModal";
import { usePlayer } from "../utils/hooks";

interface GameModeMenuProps {}

export const GameModeMenu: React.FC<GameModeMenuProps> = ({}) => {
  const router = useRouter();
  const [player] = usePlayer();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const joinMulti = () => {
    if (!player) {
      onOpen();
    } else {
      router.push("/lobby");
    }
  };

  return (
    <Stack spacing={4} direction="column" align="center">
      <Text fontWeight={"bold"} fontSize="2xl">
        Sélectionnez un mode de jeu :
      </Text>
      <Stack w={240} spacing={4}>
        <Button
          onClick={() => router.push("/solo")}
          colorScheme="teal"
          w="100%"
          variant={"outline"}
        >
          Solo
        </Button>
        <Button
          onClick={joinMulti}
          colorScheme="teal"
          w="100%"
          variant={"outline"}
        >
          Multijoueur
        </Button>
      </Stack>
      <CreatePlayerModal isOpen={isOpen} onClose={onClose} />
    </Stack>
  );
};
