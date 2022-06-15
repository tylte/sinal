import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useChattingActions } from "../../utils/hooks";
import { ChatPanel } from "./ChatPanel";

interface ChatProps {}

// chat component
export const Chat: React.FC<ChatProps> = ({}) => {
  // Message displayed while user can't send message
  const [chattingAction] = useChattingActions();

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
