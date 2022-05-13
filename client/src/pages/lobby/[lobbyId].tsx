import { useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { usePlayer, useSocket } from "src/utils/hooks";
import { CreatePlayerModal } from "../../components/CreatePlayerModal";
import { Layout } from "../../components/Layout";
import { PreGameLobby } from "../../components/PreGameLobby";
import { Lobby } from "../../utils/types";

interface LobbyProps {}

const lobby: Lobby = {
  id: "1",
  state: "pre-game",
  name: "Lobby de bg",
  totalPlace: 2,
  currentPlace: 1,
  playerList: [{ id: "b", name: "bob" }],
  owner: "b",
  isPublic: true,
  mode: "1vs1",
};

const LobbyPage: React.FC<LobbyProps> = ({}) => {
  const { state } = lobby;
  const socket = useSocket();
  const router = useRouter();
  const [player] = usePlayer();
  const { onClose } = useDisclosure();

  let lobbyId = router.query.lobbyId;
  if (lobbyId !== undefined) {
    socket?.emit("join_lobby", {
      lobbyId: lobbyId,
      playerId: "test",
      playerName: "test",
    });
  }

  if (!player) {
    return (
      <Layout>
        {!player && <CreatePlayerModal isOpen={true} onClose={onClose} />}
      </Layout>
    );
  }

  if (state === "pre-game") {
    return (
      <Layout>
        <PreGameLobby lobby={lobby} />
      </Layout>
    );
  } else if (state === "in-game") {
    return <Layout variant="large"></Layout>;
  } else if (state === "finished") {
    return <Layout></Layout>;
  } else {
    // Its supposed to have a state
    return <Layout>?!</Layout>;
  }
};

export default LobbyPage;
