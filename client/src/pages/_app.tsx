import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import axios from "axios";
import { SinalContext } from "../utils/context";
import { io, Socket } from "socket.io-client";
import {
  addChatEvents,
  addSocketConnectionEvent,
  removeChatEvents,
} from "src/utils/api";
import {
  ChattingActions,
  Dictionnary,
  DictionnaryResponse,
  Player,
} from "../utils/types";
import { serverHttpUrl, serverWsUrl } from "../utils/const";

function MyApp({ Component, pageProps }: AppProps) {
  const [dictionaries, setDictionnaries] = useState<Dictionnary[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const [chattingActions, setChattingActions] = useState<ChattingActions>({
    isChatting: false,
    channels: [{ id: "PUBLIC_CHAT", name: "Publique", messageHistory: [] }],
  });

  useEffect(() => {
    axios
      .get<DictionnaryResponse[]>(`${serverHttpUrl}/dictionary`)
      .then(({ data }) => {
        const dictionaries: Dictionnary[] = [];
        data.forEach((dictionary) => {
          const words = new Set<string>();

          dictionary.content.forEach((word) => {
            words.add(word);
          });

          dictionaries.push({
            content: words,
            hash: dictionary.hash,
            language: dictionary.language,
          });
        });
        setDictionnaries(dictionaries);
      });
    let socket = io(serverWsUrl, {
      transports: ["websocket"],
    });
    setSocket(socket);
    addSocketConnectionEvent(socket, setIsConnected);
  }, []);

  useEffect(() => {
    if (socket) {
      addChatEvents(socket, setChattingActions);
    }

    return () => {
      if (socket) {
        removeChatEvents(socket);
      }
    };
  }, [socket]);

  return (
    <SinalContext.Provider
      value={{
        dictionaries,
        socket,
        playerActions: [player, setPlayer],
        isConnected,
        chattingActions: [chattingActions, setChattingActions],
      }}
    >
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SinalContext.Provider>
  );
}

export default MyApp;
