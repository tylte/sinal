import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { PlayerGrid } from "../components/player-grid/PlayerGrid";
import { TriesHistory } from "../utils/types";

interface TestProps {}

const Test: React.FC<TestProps> = ({}) => {
  const [triesHistory, setTriesHistory] = useState<TriesHistory[]>([]);
  const [word, setWord] = useState<string>("");

  return (
    <Layout>
      <PlayerGrid
        firstLetter="W"
        isPlayer={true}
        length={8}
        nbLife={7}
        setTriesHistory={setTriesHistory}
        triesHistory={triesHistory}
        word={word}
        setWord={setWord}
      />
    </Layout>
  );
};

export default Test;
