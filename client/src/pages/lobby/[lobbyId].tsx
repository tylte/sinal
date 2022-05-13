import { useRouter } from "next/router";
import React from "react";
import { useSocket } from "src/utils/hooks";
import { Layout } from "../../components/Layout";

interface LobbyProps {}

const Lobby: React.FC<LobbyProps> = ({}) => {
  const socket = useSocket();
  const router = useRouter();
  let lobbyId = router.query.lobbyId;
  if (lobbyId !== undefined) {
    socket?.emit("join_lobby", {
      lobbyId: lobbyId,
      player: {
        id: "test",
        name: "test",
      },
    });
  }
  return <Layout>Inside lobby</Layout>;
};

export default Lobby;
