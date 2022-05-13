import { Flex, Link, Spacer, Tag, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useConnected, usePlayer } from "../utils/hooks";
import { DarkModeSwitch } from "./DarkModeSwitch";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const [player] = usePlayer();

  const connected = useConnected();

  return (
    <Flex alignItems={"center"}>
      <Text ml={5} fontSize="3xl" fontWeight="extrabold">
        <Link as={NextLink} href="/">
          Sinal
        </Link>
      </Text>
      <Text fontSize="xl" my={2} ml={35} fontWeight="extrabold">
        <Link as={NextLink} href="/about">
          About
        </Link>
      </Text>
      <Spacer />
      {connected ? (
        <Tag variant={"outline"} colorScheme={"green"} mr={4}>
          connected
        </Tag>
      ) : (
        <Tag variant={"outline"} colorScheme={"red"} mr={4}>
          {"disconnected >:("}
        </Tag>
      )}
      {player && (
        <Text mr={4} textAlign={"center"}>
          {player.name}
        </Text>
      )}
      <DarkModeSwitch />
    </Flex>
  );
};
