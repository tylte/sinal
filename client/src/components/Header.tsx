import { Flex, Link, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { usePlayer } from "../utils/hooks";
import { DarkModeSwitch } from "./DarkModeSwitch";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const [player] = usePlayer();

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
      {player && (
        <Text mr={4} textAlign={"center"}>
          {player.name}
        </Text>
      )}
      <DarkModeSwitch />
    </Flex>
  );
};
