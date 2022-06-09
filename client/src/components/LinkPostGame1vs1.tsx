import { Button } from "@chakra-ui/react";
import React from "react";
import { LastGame } from "../utils/types";
import { getStringFromHistory } from "../utils/utils";

interface LinkAfterGame1vs1Props {
  game: LastGame;
}

const pasteInClipboard = (game: LastGame | undefined) => {
  if (game === undefined) return;

  let textToWrite = "SINAL 1vs1 victoire de " + game.winner?.name + " !\n";
  textToWrite += "Le mot à découvrir était : " + game.wordsToGuess[0] + "\n\n";

  let historyP1 = game.triesHistory[0];
  textToWrite += getStringFromHistory(historyP1, game);

  textToWrite += "\nVS\n\n";

  let historyP2 = game.triesHistory[1];
  textToWrite += getStringFromHistory(historyP2, game);

  textToWrite += "\nhttps://sinal.ovoleur.dev/";

  navigator.clipboard.writeText(textToWrite);
};

export const LinkAfterGame1vs1: React.FC<LinkAfterGame1vs1Props> = ({
  game,
}) => {
  return <Button onClick={() => pasteInClipboard(game)}>Partage !</Button>;
};
