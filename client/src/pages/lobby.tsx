import { SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../components/Layout";
import { LobbyProfile } from "../components/LobbyProfile";
import { Lobby } from "../utils/types";

interface PublicLobbyProps {}

const lobbies: Lobby[] = [
  {
    id: "1",
    state: "pre-game",
    name: "Lobby de bg",
    totalPlace: 2,
    currentPlace: 1,
    playerList: [{ id: "b", name: "bob" }],
    owner: "b",
    isPublic: true,
    mode: "1vs1",
  },
  {
    id: "2",
    state: "pre-game",
    name: "Lobby des mecs sombres",
    totalPlace: 2,
    currentPlace: 1,
    playerList: [{ id: "a", name: "tom" }],
    owner: "a",
    isPublic: true,
    mode: "1vs1",
  },
  {
    id: "3",
    state: "pre-game",
    name: "Lobby des mecs sombres",
    totalPlace: 2,
    currentPlace: 1,
    playerList: [{ id: "123", name: "carl" }],
    owner: "123",
    isPublic: true,
    mode: "1vs1",
  },
];

const PublicLobby: React.FC<PublicLobbyProps> = ({}) => {
  return (
    <Layout>
      <Text mb={5} align="center" fontSize={"larger"}>
        Partie Solo
      </Text>
      <SimpleGrid minChildWidth="120px" spacing="40px">
        {lobbies.map((lobby) => (
          <LobbyProfile lobby={lobby} />
        ))}
      </SimpleGrid>
    </Layout>
  );
};

export default PublicLobby;
