import { io } from "socket.io-client";

const Index = () => {
  const socket = io("ws://localhost:4000");
  //   socket.connect();
  socket.on("hello", (arg) => {
    console.log(arg); // world
  });
  return <div>Hello</div>;
};

export default Index;
