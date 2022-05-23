import { Box, Button, Flex, HStack, Spacer, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti/dist/types/Confetti";
import {
  Game1vs1,
  Player,
  BrGameState,
  StartGameResponse,
} from "../utils/types";
import { Layout } from "./Layout";
import { PlayerGrid } from "./player-grid/PlayerGrid";
import { SmallPlayerGrid } from "./player-grid/SmallPlayerGrid";

interface InGameLobbyBrProps {
  player: Player;
  gameState: Game1vs1;
  lobbyId: string | null;
  numberPlayer: number;
}

export const InGameLobbyBr: React.FC<InGameLobbyBrProps> = ({
  player,
  gameState: {
    first_letter,
    id: game_id,
    length: game_length,
    nb_life: game_nb_life,
  },
  lobbyId,
  numberPlayer,
}) => {
  // const [word, setWord] = useState("LATTITUDE");
  // const startGame = () => {
  //     axios
  //       .post<StartGameResponse>("http://localhost:4000/start_game", {
  //         mode: "solo",
  //       })
  //       .then(({ data: { first_letter, id, length, nb_life } }) => {
  //         setGameState({
  //           firstLetter: first_letter.toUpperCase(),
  //           isFinished: false,
  //           nbLife: nb_life,
  //           triesHistory: [],
  //           wordLength: length,
  //           hasWon: false,
  //           wordId: id,
  //         });
  //         setWord(first_letter.toUpperCase());
  //       });
  //   };
  //   useEffect(() => {
  //     // Request the word when mounted
  //     startGame();
  //   }, []);
  // const [gameState, setGameState] = useState<BrGameState>({wordId:"1", hasWon:false, triesHistory:[], firstLetter:"L", nbLife:6, wordLength:8, isFinished:false});
  // const { hasWon, triesHistory, firstLetter, nbLife, wordLength, isFinished } =
  // gameState;
  const nbPlayer = 50;
  const grid = [];
  // save the grid of player
  const items = [];
  let j = 0;
  for (let i = 0; i < nbPlayer; ) {
    for (j = 0; j < 6 && i < nbPlayer; j++) {
      items.push(
        <SmallPlayerGrid
          isVisible={true}
          firstLetter={"L"}
          wordLength={9}
          nbLife={6}
          word={"LATTITUDE"}
          triesHistory={[]}
          nbPlayer={nbPlayer}
        />
      );
      i++;
    }
    grid.push(
      <Flex direction={"column"} alignContent={"center"}>
        {items.slice(i - j, i)}
      </Flex>
    );
  }
  return (
    <Flex direction={"column"} align={"left"}>
      <Text mb={5} align="center" fontSize={"larger"}>
        Partie Battle Royale
      </Text>
      <Flex direction={"row"} alignContent={"center"}>
        {grid}

        <PlayerGrid
          isVisible={true}
          firstLetter={"L"}
          wordLength={9}
          nbLife={6}
          word={"LATTITUDE"}
          triesHistory={[]}
        />
      </Flex>
    </Flex>
  );
};
