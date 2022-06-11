import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { addChatEvents, removeChatEvents } from "../utils/api";
import { useChattingActions, useSocket } from "../utils/hooks";
import { ChatPanel } from "./chat/ChatPanel";

interface ChatProps {}

// chat component
export const Chat: React.FC<ChatProps> = ({}) => {
  const socket = useSocket();
  // Message displayed while user can't send message
  const [chattingAction, setChattingAction] = useChattingActions();

  useEffect(() => {
    if (socket && setChattingAction) {
      addChatEvents(socket, setChattingAction);
    }

    return () => {
      if (socket && setChattingAction) {
        removeChatEvents(socket);
      }
    };
  }, [socket]);

  return (
    <Tabs>
      <TabList mx={"auto"} maxW={"80%"}>
        {chattingAction.channels.map((chan) => {
          return (
            <Tab key={chan.id}>
              <Text>{chan.name}</Text>
            </Tab>
          );
        })}
      </TabList>
      <TabPanels>
        {chattingAction.channels.map((chan) => {
          return (
            <TabPanel key={chan.id} h="100">
              <ChatPanel channel={chan} />
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};
