import { GameModeMenu } from "../components/GameModeMenu";
import { Layout } from "../components/Layout";
import { useSocket } from "../utils/hooks";
import { addSocketEvents } from "src/utils/api";

const Index = () => {
  // const socket = io("ws://localhost:4000");
  const socket = useSocket();
  socket?.connect();
  let room = "room1";
  socket?.emit("create", room);
  let lobbyId = "test";
  let playerName = "test";
  socket?.emit('join_lobby', {lobbyId: lobbyId,
    playerId: "test",
    playerName: playerName
  });

  addSocketEvents(socket);
  
  return (
    <Layout>
      <GameModeMenu />
    </Layout>
  );
};

export default Index;
