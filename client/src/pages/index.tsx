import { useSocket } from "src/utils/hooks";
import { GameModeMenu } from "../components/GameModeMenu";
import { Layout } from "../components/Layout";
// import { addCreateLobbyEvent } from "src/utils/api";

const Index = () => {
  const socket = useSocket();
  socket?.connect();
  let lobbyId = "test";
  socket?.emit('create_lobby', {mode: "1vs1",
    place: 2,
    isPublic: true,
    owner: {id:"test", name:"lol"},
    name:"test"
  });
  socket?.emit('join_lobby', {lobbyId: lobbyId,
    player : {id: "test2",
    name: "Coucou"}
  });
  socket?.emit("leave_lobby", {roomId: lobbyId, 
    id: "test2"})
  return (
    <Layout>
      <GameModeMenu />
    </Layout>
  );
};

export default Index;
