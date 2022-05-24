import { useDisclosure } from "@chakra-ui/react";
import React from "react";
import { Chat } from "../components/Chat";
import { CreatePlayerModal } from "../components/CreatePlayerModal";
import { Layout } from "../components/Layout";
import { usePlayer } from "../utils/hooks";

interface TestProps {}

const Test: React.FC<TestProps> = ({}) => {
  const [player] = usePlayer();

  const { onClose } = useDisclosure();

  if (!player) {
    return (
      <Layout>
        <CreatePlayerModal isOpen={!player} onClose={onClose} path={`/test`} />
      </Layout>
    );
  }
  return (
    <Layout>
      <Chat />
    </Layout>
  );
};

export default Test;
