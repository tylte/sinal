import { io } from "socket.io-client";

const Index = () => {
  const socket = io("ws://localhost:4000");
  //   socket.connect();
  var arg = "hello";
  socket.on("word", (arg) => {
    console.log("enter"); // world
   
  });
  return <div>{ arg }</div>;
};

export default Index;
