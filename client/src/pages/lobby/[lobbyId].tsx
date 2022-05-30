import { Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { usePlayer, useSocket } from "src/utils/hooks";
import { CreatePlayerModal } from "../../components/CreatePlayerModal";
import { InGameLobby } from "../../components/InGameLobby";
import { Layout } from "../../components/Layout";
import { PostGameLobby } from "../../components/PostGameLobby";
import { PreGameLobby } from "../../components/PreGameLobby";
import {
  addPreGameEvent,
  addSpecificLobbiesEvent,
  getSpecificLobby,
  removeSpecificLobbyEvent,
} from "../../utils/api";
import { Game1vs1, Lobby } from "../../utils/types";
import { getIdFromPage } from "../../utils/utils";

interface LobbyProps {}

const LobbyPage: React.FC<LobbyProps> = ({}) => {
  const socket = useSocket();
  const router = useRouter();
  const [player] = usePlayer();
  const { onClose } = useDisclosure();
  const toast = useToast();
  const [gameState, setGameState] = useState<Game1vs1 | null>(null);

  let lobbyId = getIdFromPage(router.query.lobbyId);
  const [lobby, setLobby] = useState<Lobby | null>(null);

  const leaveLobby = (lobbyId: string | null, playerId: string | undefined) => {
    if (lobbyId !== null && playerId !== undefined) {
      socket?.emit("leave_lobby", { roomId: lobbyId, playerId }, () => {});
    } else {
      console.log(
        "Couldn't leave lobby cause lobbyId or playerId null, lobbyId",
        lobbyId,
        "playerId",
        playerId
      );
    }
  };

  useEffect(() => {
    if (player && socket && lobbyId) {
      // Update event lobbies
      getSpecificLobby(lobbyId, setLobby, socket, toast, player);
      addSpecificLobbiesEvent(
        socket,
        lobbyId as string,
        setLobby,
        setGameState
      );
      addPreGameEvent(socket);
    }
    return () => {
      if (player && socket && lobbyId) {
        leaveLobby(lobbyId, player.id);
        removeSpecificLobbyEvent(socket);
      }
    };
  }, [socket, lobbyId, player]);

  if (!player) {
    return (
      <Layout>
        <CreatePlayerModal
          isOpen={!player}
          onClose={onClose}
          path={`/lobby/${lobbyId}`}
        />
      </Layout>
    );
  }

  if (lobby === null) {
    return <Layout>Lobby n'existe pas</Layout>;
  }

  let state = lobby?.state;

  if (state === "pre-game") {
    return (
      <Layout variant="grid">
        <PreGameLobby
          player={player}
          lobby={{
            id: "test",
            state: "pre-game",
            name: "Name",
            totalPlace: 2,
            playerList: [], // id: "joueur 1", name:"Joueur 1", lobbyId:"test", id: "joueur 2", name:"Joueur 2", lobbyId:"test"
            owner: "joueur 1",
            isPublic: true,
            mode: "1vs1",
            currentGameId: "0",
            lastGame: {
              gameMode: "1vs1",
              playerList: [
                { id: "joueur 1", name: "Joueur 1", lobbyId: "test" },
                { id: "joueur 2", name: "Joueur 2", lobbyId: "test" },
              ],
              winner: "Joueur 1",
              wordToGuess: "Coucou",
            },
          }}
        />
      </Layout>
    );
  } else if (state === "in-game" && gameState !== null && lobbyId !== null) {
    return (
      <Layout variant="grid">
        <InGameLobby
          lobbyId={lobbyId}
          GameMode={lobby.mode}
          player={player}
          gameState={gameState}
        />
      </Layout>
    );
  } else if (state === "finished") {
    return (
      <Layout>
        <PostGameLobby lobby={lobby} />
      </Layout>
    );
  } else {
    // Its supposed to have a state
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
};

export default LobbyPage;
