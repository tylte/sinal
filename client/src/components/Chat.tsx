import { Box, Input, Text } from "@chakra-ui/react";
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { addChatEvents, removeChatEvents } from "../utils/api";
import { usePlayer, useSocket } from "../utils/hooks";
import { ChatMessage } from "../utils/types";

interface ChatProps {}

export const Chat: React.FC<ChatProps> = ({}) => {
  const socket = useSocket();
  const [player] = usePlayer();
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (socket) {
      console.log("Add events");
      addChatEvents(socket, setMessageHistory);
    }

    return () => {
      if (socket) {
        console.log("remove events");
        removeChatEvents(socket);
      }
    };
  }, [socket]);

  const [message, setMessage] = useState("");

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.length > 0) {
      if (player && socket) {
        socket.emit("send_chat_message", {
          playerId: player.id,
          content: message,
        });
      } else {
        console.log("Le joueur n'est pas connecté");
      }
      setMessage("");
      // setMessageHistory([
      //   ...messageHistory,
      //   { content: message, author: "qwe", id: Math.random().toString() },
      // ]);
    }
  };

  return (
    <Box border={"1px"} h={"100vh"} maxH={"100vh"}>
      {messageHistory.map((mess) => {
        return (
          <Text key={mess.id}>
            {mess.author} : {mess.content}
          </Text>
        );
      })}
      <Input
        value={message}
        onChange={handleMessageChange}
        onKeyDown={handleSendMessage}
      />
    </Box>
  );
};
