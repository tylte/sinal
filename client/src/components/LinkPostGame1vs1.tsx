import { Button } from "@chakra-ui/react";
import React from "react";
import { LastGame, LetterResult } from "../utils/types";

interface LinkAfterGame1vs1Props {
  game: LastGame;
}

const copiePressePapier = (game: LastGame | undefined) => {
  if (game === undefined) return;

  let textToWrite = "SINAL 1vs1 victoire de " + game.winner?.name + " !\n";
  textToWrite += "Le mot à découvrir était : " + game.wordsToGuess[0] + "\n\n";

  let historyP1 = game.triesHistory[0];
  textToWrite += game.playerList[0].name + " : \n";
  if (historyP1.length === 0)
    for (let i = 0; i < game.wordsToGuess[0].length; i++) textToWrite += "⬛";
  else {
    for (let j = 0; j < historyP1.length; j++) {
      for (let i = 0; i < historyP1[j].length; i++) {
        if (historyP1[j][i] === LetterResult.RIGHT_POSITION)
          textToWrite += "🟩";
        else if (historyP1[j][i] === LetterResult.FOUND) textToWrite += "🟧";
        else textToWrite += "⬛";
      }
      textToWrite += "\n";
    }
  }

  textToWrite += "\nVS\n\n";

  let historyP2 = game.triesHistory[1];
  textToWrite += game.playerList[1].name + " : \n";
  if (historyP2.length === 0)
    for (let i = 0; i < game.wordsToGuess[0].length; i++) textToWrite += "⬛";
  else {
    for (let j = 0; j < historyP2.length; j++) {
      for (let i = 0; i < historyP2[j].length; i++) {
        if (historyP2[j][i] === LetterResult.RIGHT_POSITION)
          textToWrite += "🟩";
        else if (historyP2[j][i] === LetterResult.FOUND) textToWrite += "🟧";
        else textToWrite += "⬛";
      }
      textToWrite += "\n";
    }
  }

  textToWrite += "\nhttps://sinal.ovoleur.dev/";

  navigator.clipboard.writeText(textToWrite);
};

export const LinkAfterGame1vs1: React.FC<LinkAfterGame1vs1Props> = ({
  game,
}) => {
  return <Button onClick={() => copiePressePapier(game)}>Partage !</Button>;
};
