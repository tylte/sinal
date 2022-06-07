import { Button } from "@chakra-ui/react";
import React from "react";
import { LastGame, LetterResult } from "../utils/types";

interface LinkAfterGame1vs1Props {
  game: LastGame;
}

const copiePressePapier = (game: LastGame) => {
  let textToWrite = "SINAL 1vs1 victoire de " + game.winner.name + " !\n";
  textToWrite.concat(
    "Le mot à découvrir était : " + game.wordsToGuess[0] + "\n\n"
  );

  let historyP1 = game.triesHistory.get(game.playerList[0].id);
  textToWrite.concat(game.playerList[0].name + " : ");
  if (historyP1 !== undefined) {
    for (let j = 0; j < historyP1.length; j++) {
      for (let i = 0; i < game.wordsToGuess[0].length; i++) {
        if (historyP1[j].result[i] === LetterResult.RIGHT_POSITION)
          textToWrite.concat("🟩");
        else if (historyP1[j].result[i] === LetterResult.FOUND)
          textToWrite.concat("🟧");
        else textToWrite.concat("⬛");
      }
    }
    textToWrite.concat("\n");
  }

  textToWrite.concat("\nVS\n\n");

  let historyP2 = game.triesHistory.get(game.playerList[1].id);
  textToWrite.concat(game.playerList[1].name + " : ");
  if (historyP2 !== undefined) {
    for (let j = 0; j < historyP2.length; j++) {
      for (let i = 0; i < game.wordsToGuess[0].length; i++) {
        if (historyP2[j].result[i] === LetterResult.RIGHT_POSITION)
          textToWrite.concat("🟩");
        else if (historyP2[j].result[i] === LetterResult.FOUND)
          textToWrite.concat("🟧");
        else textToWrite.concat("⬛");
      }
    }
    textToWrite.concat("\n");
  }

  textToWrite.concat("\nhttps://sinal.ovoleur.dev/");

  navigator.clipboard.writeText(textToWrite);
};

export const LinkAfterGame1vs1: React.FC<LinkAfterGame1vs1Props> = ({
  game,
}) => {
  return <Button onClick={() => copiePressePapier(game)}>Partage !</Button>;
};
