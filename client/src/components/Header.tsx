import { Flex, Link, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <Flex>
      <Text ml={5} fontSize="3xl" fontWeight="extrabold">
        <Link as={NextLink} href="/">
          Sinal
        </Link>
      </Text>
      <Text fontSize="xl" my="auto" ml={35} fontWeight="extrabold">
        <Link as={NextLink} href="/about">
          About
        </Link>
      </Text>
    </Flex>
  );
};
