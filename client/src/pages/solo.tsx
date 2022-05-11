import { Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { PlayerGrid } from "../components/PlayerGrid";
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
        <PlayerGrid
          id={id}
          firstLetter={firstLetter}
          length={length}
          nbLife={nbLife}
        />
      )}
    </Layout>
  );
};

export default Solo;
