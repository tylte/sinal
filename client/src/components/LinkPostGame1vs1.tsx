import { Button, Modal } from "@chakra-ui/react";
import React from "react";
import { Game1vs1 } from "../utils/types";

interface LinkAfterGame1vs1Props {
  game: Game1vs1;
  isWinner: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const copiePressePapier = (game: Game1vs1, isWinner: boolean) => {
  if (isWinner) {
    navigator.clipboard.writeText("bravo le veau");
  } else {
    navigator.clipboard.writeText("t'as perdu gros nul");
  }
};

export const LinkAfterGame1vs1: React.FC<LinkAfterGame1vs1Props> = ({
  game,
  isWinner,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Button onClick={() => copiePressePapier(game, isWinner)}>
        Partage !
      </Button>
    </Modal>
  );
};
