import { Text } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../components/Layout";

interface AboutProps {}

const About: React.FC<AboutProps> = ({}) => {
  return (
    <Layout>
      <Text textAlign={"center"} fontSize="3xl" fontWeight={"bold"}>
        Project Sinal
      </Text>
      <Text textAlign={"center"} mt={4} fontSize="l">
        Nous sommes Baptiste Meauzé, Benjamin Viaud, Jean-Baptiste Bougaud et
        Tanguy Lambert, des étudiants de Licence 3 en Informatique à l'ISTIC de
        Rennes.
      </Text>
      <Text textAlign={"center"} mt={4} fontSize="l">
        Ce projet consiste à faire un jeu de motus en application web. En
        particulier la possibilité de jouer en multijoueur à plusieurs mode de
        jeu de type 1vs1 ou Battle Royale !
      </Text>
    </Layout>
  );
};

export default About;
