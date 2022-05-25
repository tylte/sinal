import { Alert, AlertIcon, Box, Flex, Input, Text } from "@chakra-ui/react";
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { addChatEvents, removeChatEvents } from "../utils/api";
import { useChattingActions, usePlayer, useSocket } from "../utils/hooks";
import { ChatMessage } from "../utils/types";

interface ChatProps {}

export const Chat: React.FC<ChatProps> = ({}) => {
  const socket = useSocket();
  const [player] = usePlayer();
  const [alert, setAlert] = useState({ enabled: false, message: "" });
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([]);
  const [_, setIsChatting] = useChattingActions();

  useEffect(() => {
    if (socket) {
      addChatEvents(socket, setMessageHistory);
    }

    return () => {
      if (socket) {
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
        if (!canSendMessage) {
          setAlert({ message: "Trop de spam", enabled: true });
          return;
        }
        if (message.length > 500) {
          setAlert({ ...alert, message: "Message trop long", enabled: true });
          return;
        }

        setCanSendMessage(false);
        setAlert({ message: "", enabled: false });

        setTimeout(() => {
          setCanSendMessage(true);
          setAlert({ message: "", enabled: false });
        }, 500);

        socket.emit("send_chat_message", {
          playerId: player.id,
          content: message,
        });
      } else {
        console.log("Le joueur n'est pas connecté");
      }
      setMessage("");
    }
  };

  return (
    <Flex
      // borderRadius={"md"}
      direction={"column-reverse"}
      border={"1px"}
      h={"100vh"}
      maxH={"85vh"}
      p={2}
      overflowY={"scroll"}
      css={{
        "&::-webkit-scrollbar": {
          width: "10px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#888",
        },

        "&::-webkit-scrollbar-thumb:hover": {
          background: "#555",
        },
      }}
    >
      <Box w="100%" mt={2}>
        {alert.enabled && (
          <Alert status="warning" variant="left-accent">
            <AlertIcon />
            {alert.message}
          </Alert>
        )}
        <Input
          onBlur={() => setIsChatting && setIsChatting(false)}
          onFocus={() => setIsChatting && setIsChatting(true)}
          w="100%"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleSendMessage}
        />
      </Box>
      <Flex direction={"column"}>
        {messageHistory.map((mess) => {
          return (
            <Box overflowX={"hidden"} key={mess.id}>
              <Text fontWeight={"bold"}>{mess.author}:</Text>
              <Text ml={2} wordBreak={"break-word"}>
                {mess.content}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </Flex>
  );
};
