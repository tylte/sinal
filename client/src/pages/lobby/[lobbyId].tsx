import { useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { usePlayer, useSocket } from "src/utils/hooks";
import { CreatePlayerModal } from "../../components/CreatePlayerModal";
import { Layout } from "../../components/Layout";
import { PreGameLobby } from "../../components/PreGameLobby";
import { addPreGameEvent } from "../../utils/api";
import { Lobby, Packet } from "../../utils/types";

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

  let lobbyId = router.query.lobbyId;
  const [lobby, setLobby] = useState<Lobby | null>(null);

  useEffect(() => {
    axios
      .get<Lobby>(`http://localhost:4000/list_lobbies/${lobbyId}`)
      .then(({ data }) => {
        if (data !== null) {
          setLobby(data);

          if (player?.id !== data.owner) {
            socket?.emit(
              "join_lobby",
              {
                lobbyId: lobbyId,
                playerId: player?.id,
              },
              (response: Packet) => {
                toast({
                  description: response.message,
                  status: response.success ? "success" : "error",
                  duration: 3000,
                  isClosable: true,
                });
              }
            );
          }
        }
      });

    return () => {
      console.log("Leave lobby");
      leaveLobby(socket);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      addPreGameEvent(socket);
    }
  }, [socket]);

  const leaveLobby = (socket: Socket | null) => {
    socket?.emit("leave_lobby", { roomId: lobbyId, playerId: player?.id });
  };

  if (!player) {
    return (
      <Layout>
        {!player && <CreatePlayerModal isOpen={true} onClose={onClose} />}
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
