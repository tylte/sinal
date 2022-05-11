import { io } from "socket.io-client";

import { GameModeMenu } from "../components/GameModeMenu";
import { Layout } from "../components/Layout";
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
   const socket = io("ws://localhost:4000");
   socket.connect();
   let room = 'room1';
   socket.emit('create', room);
   let lobbyId = uuidv4();
   let playerName = "test";
   socket.emit('join_lobby', {lobbyId: lobbyId,
    playerId: uuidv4(),
    playerName: playerName,
    isPublic: false
  });

  return (
    <Layout>
      <GameModeMenu />
    </Layout>
  );
};

export default Index;
