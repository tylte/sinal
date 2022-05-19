import React, { useState } from "react";
import { PlayerGrid } from "../components/PlayerGrid";
import { TriesHistory } from "../utils/types";

interface TestProps {}

const Test: React.FC<TestProps> = ({}) => {
  const [triesHistory, setTriesHistory] = useState<TriesHistory[]>([]);

  return (
    <PlayerGrid
      firstLetter="W"
      isPlayer={true}
      length={8}
      nbLife={7}
      setTriesHistory={setTriesHistory}
      triesHistory={triesHistory}
    />
  );
};

export default Test;
