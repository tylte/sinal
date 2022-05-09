import { Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { PlayerGrid } from "../components/PlayerGrid";
import { StartGameResponse } from "../types";

interface SoloProps {}

const Solo: React.FC<SoloProps> = ({}) => {
  const [length, setLength] = useState(8);
  const [id, setId] = useState("123");
  const [firstLetter, setFirstLetter] = useState("a");

  //   TODO: connect with server
  //   useEffect(() => {
  //     axios
  //       .post<StartGameResponse>("http://localhost:4000/start_game", {
  //         mode: "solo",
  //       })
  //       .then(({ data: { first_letter, id, length } }) => {
  //         setLength(length);
  //         setFirstLetter(first_letter);
  //         setId(id);
  //       });
  //   }, []);

  return (
    <Layout>
      <Text mb={5} align="center" fontSize={"larger"}>
        Partie Solo
      </Text>
      <PlayerGrid firstLetter={firstLetter} length={length} />
    </Layout>
  );
};

export default Solo;
