import { GameModeMenu } from "../components/GameModeMenu";
import { Layout } from "../components/Layout";
import { useSocket } from "../utils/hooks";

const Index = () => {
  // const socket = io("ws://localhost:4000");
  const socket = useSocket();
  socket?.connect();

  return (
    <Layout>
      <GameModeMenu />
    </Layout>
  );
};

export default Index;
