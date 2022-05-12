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
    name: "Tom's Lobby",
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
  {
    id: "4",
    state: "in-game",
    name: "Lobby des mecs chiants avec un nom assez long parce qu'on aime casser les pieds aux devs",
    totalPlace: 2,
    currentPlace: 2,
    playerList: [
      { id: "123121231", name: "carl" },
      { id: "12312313", name: "carl" },
    ],
    owner: "123121231",
    isPublic: true,
    mode: "1vs1",
  },
  {
    id: "5",
    state: "pre-game",
    name: "Lobby des mecs cool",
    totalPlace: 2,
    currentPlace: 2,
    playerList: [
      { id: "11231", name: "bob" },
      { id: "123123111", name: "carl" },
    ],
    owner: "11231",
    isPublic: true,
    mode: "1vs1",
  },
  {
    id: "6",
    state: "pre-game",
    name: "Lobby des mecs cool",
    totalPlace: 2,
    currentPlace: 2,
    playerList: [
      { id: "11231", name: "bob" },
      { id: "123123111", name: "carl" },
    ],
    owner: "11231",
    isPublic: true,
    mode: "1vs1",
  },
  {
    id: "7",
    state: "pre-game",
    name: "Lobby des mecs cool",
    totalPlace: 2,
    currentPlace: 2,
    playerList: [
      { id: "11231", name: "bob" },
      { id: "123123111", name: "carl" },
    ],
    owner: "11231",
    isPublic: true,
    mode: "1vs1",
  },
  {
    id: "8",
    state: "pre-game",
    name: "Lobby des mecs cool",
    totalPlace: 2,
    currentPlace: 2,
    playerList: [
      { id: "11231", name: "bob" },
      { id: "123123111", name: "carl" },
    ],
    owner: "11231",
    isPublic: true,
    mode: "1vs1",
  },
  {
    id: "9",
    state: "pre-game",
    name: "Lobby des mecs cool",
    totalPlace: 2,
    currentPlace: 2,
    playerList: [
      { id: "11231", name: "bob" },
      { id: "123123111", name: "carl" },
    ],
    owner: "11231",
    isPublic: true,
    mode: "1vs1",
  },
  {
    id: "10",
    state: "pre-game",
    name: "Lobby des mecs cool",
    totalPlace: 2,
    currentPlace: 2,
    playerList: [
      { id: "11231", name: "bob" },
      { id: "123123111", name: "carl" },
    ],
    owner: "11231",
    isPublic: true,
    mode: "1vs1",
  },
  {
    id: "11",
    state: "pre-game",
    name: "Lobby des mecs cool",
    totalPlace: 2,
    currentPlace: 2,
    playerList: [
      { id: "11231", name: "bob" },
      { id: "123123111", name: "carl" },
    ],
    owner: "11231",
    isPublic: true,
    mode: "1vs1",
  },
];

const PublicLobby: React.FC<PublicLobbyProps> = ({}) => {
  return (
    <Layout variant="large">
      <Text mb={5} align="center" fontSize={"3xl"}>
        Liste des lobbys
      </Text>
      <SimpleGrid minChildWidth="250px" spacing="40px">
        {lobbies.map((lobby) => (
          <LobbyProfile key={lobby.id} lobby={lobby} />
        ))}
      </SimpleGrid>
    </Layout>
  );
};

export default PublicLobby;
