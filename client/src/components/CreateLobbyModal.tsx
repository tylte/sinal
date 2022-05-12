import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

interface CreateLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateLobbyModal: React.FC<CreateLobbyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [gameMode, setGameMode] = React.useState("1vs1");
  const [isPublic, setIsPublic] = React.useState("false");

  const createLobby = () => {
    // ICI LES EVENTS DE CREATION DE LOBBY

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Création de lobby</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* GAME MODE */}
          <Text my={2}>Mode de jeu</Text>
          <RadioGroup onChange={setGameMode} value={gameMode}>
            <Stack direction="row">
              <Radio value="1vs1">1 vs 1</Radio>
              <Radio isDisabled={true} value="2">
                Battle Royale
              </Radio>
              <Radio isDisabled={true} value="3">
                2 vs 2
              </Radio>
            </Stack>
          </RadioGroup>
          {/* PLACE */}
          <Text my={2}>Place</Text>
          <NumberInput defaultValue={2} min={2} max={2}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          {/* PUBLIC/PRIVE */}
          <Text my={2}>Visibilité</Text>
          <RadioGroup onChange={setIsPublic} value={isPublic}>
            <Stack direction="row">
              <Radio value="true">Public</Radio>
              <Radio value="false">Privée</Radio>
            </Stack>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={createLobby}>
            Créer lobby
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
