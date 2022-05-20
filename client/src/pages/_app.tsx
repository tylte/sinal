import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import axios from "axios";
import { SinalContext } from "../utils/context";
import { io, Socket } from "socket.io-client";
import { addSocketConnectionEvent } from "src/utils/api";
import { Player } from "../utils/types";

function MyApp({ Component, pageProps }: AppProps) {
  const [dictionary, setDictionnary] = useState<Set<string>>(new Set());
  const [socket, setSocket] = useState<Socket | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    axios.get<string[]>("http://localhost:4000/dictionary").then(({ data }) => {
      const set: Set<string> = new Set();
      data.forEach((word) => {
        set.add(word);
      });
      setDictionnary(set);
    });
    let socket = io("ws://localhost:4000");
    setSocket(socket);
    addSocketConnectionEvent(socket, setIsConnected);
  }, []);

  return (
    <SinalContext.Provider
      value={{
        dictionary,
        socket,
        playerActions: [player, setPlayer],
        isConnected,
      }}
    >
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SinalContext.Provider>
  );
}

export default MyApp;
