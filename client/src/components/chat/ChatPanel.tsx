import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Input,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";
import { useChattingActions, usePlayer, useSocket } from "../../utils/hooks";
import { ChatChannel } from "../../utils/types";

import { KeyboardEvent } from "react";
interface ChatPanelProps {
  channel: ChatChannel;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  channel: { messageHistory, id: channelId },
}) => {
  const { colorMode } = useColorMode();
  const [_, setChattingAction] = useChattingActions();
  const [player] = usePlayer();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [alert, setAlert] = useState({ enabled: false, message: "" });

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
          channelId,
        });
      } else {
        console.log("Le joueur n'est pas connecté");
      }
      setMessage("");
    }
  };

  return (
    <Flex
      direction={"column-reverse"}
      border={"1px"}
      h={"80vh"}
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
          borderColor={colorMode === "dark" ? "white" : "black"}
          onBlur={() =>
            setChattingAction &&
            setChattingAction((actions) => {
              return { ...actions, isChatting: false };
            })
          }
          onFocus={() =>
            setChattingAction &&
            setChattingAction((actions) => {
              return { ...actions, isChatting: true };
            })
          }
          w="100%"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleSendMessage}
        />
      </Box>
      <Flex direction={"column"}>
        {messageHistory.map((mess) => {
          if (!mess.isAnnoncement) {
            return (
              <Box overflowX={"hidden"} key={mess.id}>
                <Text fontWeight={"bold"}>{mess.author}:</Text>
                <Text ml={2} wordBreak={"break-word"}>
                  {mess.content}
                </Text>
              </Box>
            );
          } else {
            return (
              <Box overflowX={"hidden"} key={mess.id}>
                <Alert
                  status="info"
                  variant="subtle"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                >
                  <AlertDescription maxWidth="sm">
                    {mess.content}
                  </AlertDescription>
                </Alert>
              </Box>
            );
          }
        })}
      </Flex>
    </Flex>
  );
};
