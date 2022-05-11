import { GameModeMenu } from "../components/GameModeMenu";
import { Layout } from "../components/Layout";
import { useSocket } from "../utils/hooks";

const Index = () => {
  // const socket = io("ws://localhost:4000");
  const socket = useSocket();
  socket?.connect();
  let room = "room1";
  socket?.emit("create", room);
  let result = [1, 1, 1];
  socket?.emit("result", { room: room, result: result });
  socket?.on("roomResult", (arg) => {
    console.log(arg); // world
  });

  return (
    <Layout>
      <GameModeMenu />
    </Layout>
  );
};

export default Index;
