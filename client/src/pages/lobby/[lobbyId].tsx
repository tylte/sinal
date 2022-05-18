import { Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { usePlayer, useSocket } from "src/utils/hooks";
import { CreatePlayerModal } from "../../components/CreatePlayerModal";
import { InGameLobby } from "../../components/InGameLobby";
import { Layout } from "../../components/Layout";
import { PreGameLobby } from "../../components/PreGameLobby";
import {
  addPreGameEvent,
  addSpecificLobbiesEvent,
  getSpecificLobby,
  removeSpecificLobbyEvent,
} from "../../utils/api";
import { Lobby } from "../../utils/types";
import { getIdFromPage } from "../../utils/utils";

interface LobbyProps {}

// const lobby: Lobby = {
//   id: "1",
//   state: "pre-game",
//   name: "Lobby de bg",
//   totalPlace: 2,
//   currentPlace: 1,
//   playerList: [{ id: "b", name: "bob", lobbyId:"1"}],
//   owner: "b",
//   isPublic: true,
//   mode: "1vs1",
// };

const LobbyPage: React.FC<LobbyProps> = ({}) => {
  // const { state } = lobby;
  const socket = useSocket();
  const router = useRouter();
  const [player] = usePlayer();
  const { onClose } = useDisclosure();
  const toast = useToast();

  let lobbyId = getIdFromPage(router.query.lobbyId);
  const [lobby, setLobby] = useState<Lobby | null>(null);

  const leaveLobby = (lobbyId: string | null, playerId: string | undefined) => {
    if (lobbyId !== null && playerId !== undefined) {
      socket?.emit("leave_lobby", { roomId: lobbyId, playerId }, () => {});
    } else {
      console.log(
        "Couldn't leave lobby cause lobbyId or playerId null, lobbyId",
        lobbyId,
        "playerId",
        playerId
      );
    }
  };

  useEffect(() => {
    if (player && socket && lobbyId) {
      // Update event lobbies
      getSpecificLobby(lobbyId, setLobby, socket, toast, player);
      addSpecificLobbiesEvent(socket, lobbyId as string, setLobby);
      addPreGameEvent(socket);
    }
    return () => {
      if (player && socket && lobbyId) {
        leaveLobby(lobbyId, player.id);
        removeSpecificLobbyEvent(socket);
      }
    };
  }, [socket, lobbyId, player]);

  if (!player) {
    return (
      <Layout>
        <CreatePlayerModal
          isOpen={!player}
          onClose={onClose}
          path={`/lobby/${lobbyId}`}
        />
      </Layout>
    );
  }

  if (lobby === null) {
    return <Layout>Lobby n'existe pas</Layout>;
  }

  let state = lobby?.state;

  if (state === "pre-game") {
    return (
      <Layout>
        <PreGameLobby player={player} lobby={lobby} />
      </Layout>
    );
  } else if (state === "in-game") {
    return (
      <Layout variant="large">
        <InGameLobby player={player} />
      </Layout>
    );
  } else if (state === "finished") {
    return <Layout></Layout>;
  } else {
    // Its supposed to have a state
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
};

export default LobbyPage;
