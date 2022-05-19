import { Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { PlayerGridOld } from "../components/PlayerGridOld";
import { StartGameResponse } from "../utils/types";

interface SoloProps {}

const Solo: React.FC<SoloProps> = ({}) => {
  const [length, setLength] = useState<number | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [firstLetter, setFirstLetter] = useState<string | null>(null);
  const [nbLife, setNbLife] = useState<null | number>(null);

  useEffect(() => {
    axios
      .post<StartGameResponse>("http://localhost:4000/start_game", {
        mode: "solo",
      })
      .then(({ data: { first_letter, id, length, nb_life } }) => {
        setLength(length);
        setFirstLetter(first_letter);
        setId(id);
        setNbLife(nb_life);
      });
  }, []);

  return (
    <Layout>
      <Text mb={5} align="center" fontSize={"larger"}>
        Partie Solo
      </Text>
      {nbLife === null ||
      id === null ||
      length === null ||
      firstLetter === null ? (
        <></>
      ) : (
        <PlayerGridOld
          isPlayer={true}
          isSolo={true}
          id={id}
          firstLetter={firstLetter}
          length={length}
          nbLife={nbLife}
          player={undefined}
          lobbyId={null}
        />
      )}
      {/* <NewGameModal isOpen={gameStatus.isFinished && !gameStatus.isWon} status={"error"} onClose={newGameOnClose} title={"PERDU"}description={
        "Vous avez perdu votre partie voulez vous en refaire une ?"
      } />
      <NewGameModal isOpen={gameStatus.isFinished && gameStatus.isWon} status={"success"} onClose={onClose} title={"GAGNER"} description={
        "Vous avez gagné votre partie voulez vous en refaire une ?"
      } /> */}
    </Layout>
  );
};

export default Solo;
