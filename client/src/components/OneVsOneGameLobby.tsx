import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { useClassicWordInput, useDictionary, useSocket } from "../utils/hooks";
import {
  Game1vs1,
  Player,
  TriesHistory,
  KeyboardSettings,
} from "../utils/types";
import { getClassicKeyboardSettings } from "../utils/utils";
import { PlayerGrid } from "./player-grid/PlayerGrid";

interface OneVsOneGameLobbyProps {
  player: Player;
  gameState: Game1vs1;
}

export const OneVsOneGameLobby: React.FC<OneVsOneGameLobbyProps> = ({
  player: { id: playerId, name, lobbyId },
  gameState: {
    playerOne,
    playerTwo,
    first_letter,
    id: gameId,
    length: game_length,
  },
}) => {
  const socket = useSocket();
  const dictionary = useDictionary();
  const toast = useToast();

  let tryHistory: TriesHistory[] = [];

  const onEnter = () => {
    if (word.length !== game_length) {
      !toast.isActive("NO LETTER") &&
        toast({
          id: "NO LETTER",
          title: "Pas assez de lettres !",
          status: "error",
          isClosable: true,
          duration: 2500,
        });
      return;
    }

    if (!dictionary.has(word.toLowerCase())) {
      !toast.isActive("NODICTIONARY") &&
        toast({
          id: "NODICTIONARY",
          title: "Le mot n'est pas dans le dictionnaire",
          status: "error",
          isClosable: true,
          duration: 2500,
        });
      return;
    }

    socket?.emit(
      "guess_word_1vs1",
      {
        word: word.toLowerCase(),
        gameId: gameId,
        playerId,
      },
      (res: any) => {
        console.log("TRY HISTORY BEF", tryHistory); //TO DELETE
        tryHistory = [...tryHistory, { result: res.data, wordTried: word }];
        console.log("TRY HISTORY AFT", tryHistory); //TO DELETE
      }
    );

    setWord(first_letter.toUpperCase());
  };

  const adversaire: { id: string; name: string; nb_life: number } =
    playerOne.id !== playerId ? playerOne : playerTwo;

  const [word, setWord] = useState(first_letter.toUpperCase());
  const [wordP2, setWordP2] = useState(first_letter.toUpperCase());
  useClassicWordInput(word, setWord, game_length, onEnter, false);

  const keyboardSettings: KeyboardSettings = getClassicKeyboardSettings(
    onEnter,
    setWord,
    game_length
  );

  return (
    <Flex p={8}>
      <Box>
        <Flex
          direction={"column"}
          alignItems="center"
          justifyContent={"center"}
        >
          <Text align={"center"}>{adversaire.name}</Text>
          <PlayerGrid
            isVisible={false}
            wordLength={game_length}
            nbLife={6}
            firstLetter={first_letter}
            word={wordP2}
            triesHistory={[]}
          ></PlayerGrid>
        </Flex>
      </Box>
      <Box w={"50%"}>
        <Flex>
          <Box h="400px">
            <Flex alignItems="center" justifyContent={"center"}>
              <Box>
                <Text align={"center"}>{name}</Text>
                <PlayerGrid
                  isVisible={true}
                  wordLength={game_length}
                  nbLife={6}
                  firstLetter={first_letter}
                  word={word}
                  triesHistory={[
                    { result: [0, 1, 1, 2, 1, 2, 2], wordTried: "OISEAUX" },
                  ]}
                  keyboardSetting={keyboardSettings}
                ></PlayerGrid>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box w={"25%"}>
        <Text align={"center"}>Tchat</Text>
      </Box>
    </Flex>
  );
};
