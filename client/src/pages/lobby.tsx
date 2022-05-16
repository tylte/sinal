import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { addLobbiesEvent, removeLobbiesEvent } from "src/utils/api";
import { CreateLobbyModal } from "../components/CreateLobbyModal";
import { CreatePlayerModal } from "../components/CreatePlayerModal";
import { Layout } from "../components/Layout";
import { LobbyProfile } from "../components/LobbyProfile";
import { usePlayer, useSocket } from "../utils/hooks";
import { Lobby } from "../utils/types";

interface PublicLobbyProps {}

const PublicLobby: React.FC<PublicLobbyProps> = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [player] = usePlayer();
  const socket = useSocket();
  useEffect(() => { 
    addLobbiesEvent(socket)
    return() => {
      removeLobbiesEvent(socket);
    }
  }, []);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);

  useEffect(() => {
    axios
      .get<Lobby[]>("http://localhost:4000/list_lobbies")
      .then(({ data }) => {
        setLobbies(data);
      });
  }, []);

  return (
    <Layout variant="large">
      <Flex direction={"column"}>
        <Text mb={5} align="center" fontSize={"3xl"}>
          Liste des lobbys
        </Text>
        <Box mx="auto" my="4">
          <Button onClick={onOpen}>Créer un lobby</Button>
        </Box>
        <SimpleGrid minChildWidth="250px" spacing="40px">
          {lobbies.map((lobby) => (
            <LobbyProfile key={lobby.id} lobby={lobby} />
          ))}
        </SimpleGrid>
      </Flex>
      {!player && <CreatePlayerModal isOpen={true} onClose={onClose} />}
      <CreateLobbyModal isOpen={isOpen} onClose={onClose} />
    </Layout>
  );
};

export default PublicLobby;
