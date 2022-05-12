import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { useEffect, useState } from "react";
import axios from "axios";
import { DictionaryContext, SocketContext } from "../utils/context";
import { io, Socket } from "socket.io-client";
import { addCreateLobbyEvent, addJoinLobbyEvent } from "src/utils/api";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const [dictionary, setDictionnary] = useState<Set<string> | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

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
    addCreateLobbyEvent(socket, router);
    addJoinLobbyEvent(socket, router);
  }, []);
  return (
    <SocketContext.Provider value={socket}>
      <DictionaryContext.Provider
        value={dictionary !== null ? dictionary : new Set()}
      >
        <ChakraProvider resetCSS theme={theme}>
          <DarkModeSwitch />
          <Component {...pageProps} />
        </ChakraProvider>
      </DictionaryContext.Provider>
    </SocketContext.Provider>
  );
}

export default MyApp;
