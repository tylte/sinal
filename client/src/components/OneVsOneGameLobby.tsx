import { Box, Flex, Square, Text } from "@chakra-ui/react";
import React from "react";
import { Game1vs1, Player } from "../utils/types";

interface OneVsOneGameLobbyProps {
  player: Player;
  gameState: Game1vs1;
}

export const OneVsOneGameLobby: React.FC<OneVsOneGameLobbyProps> = ({
  player,
  gameState,
}) => {
  return (
    <Flex p={8}>
      <Box h="500px" w={"25%"} bg="green.400">
        <Flex alignItems="center" justifyContent={"center"} h="100%">
          <Box>
            <Text align={"center"}>Joueur 2</Text>
            <Square size="180" bg="gray"></Square>
          </Box>
        </Flex>
      </Box>
      <Box w={"50%"}>
        <Flex direction={"column"}>
          <Box h="300px" bg="red.400">
            <Flex alignItems="center" justifyContent={"center"} h="100%">
              <Box>
                <Text align={"center"}>Joueur 1</Text>
                <Square size="250" bg="gray"></Square>
              </Box>
            </Flex>
          </Box>
          <Box h="200" bg={"red.200"}>
            <Flex alignItems="center" justifyContent={"center"} h="100%">
              <Box h="150" w="75%" bg={"gray"}></Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box w={"25%"} bg="blue.400">
        <Text align={"center"}>Tchat</Text>
      </Box>
    </Flex>
  );
};
