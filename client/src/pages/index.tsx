// import { io } from "socket.io-client";

import { GameModeMenu } from "../components/GameModeMenu";
import { Layout } from "../components/Layout";

const Index = () => {
  //   const socket = io("ws://localhost:4000");
  //   socket.connect();
  //   socket.on("hello", (arg) => {
  //     console.log(arg); // world
  //   });
  return (
    <Layout>
      <GameModeMenu />
    </Layout>
  );
};

export default Index;
