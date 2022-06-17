import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Layout } from "../components/Layout";

interface RulesProps {}

const Rules: React.FC<RulesProps> = ({}) => {
  return (
    <Layout>
      <Box>
        <Accordion defaultIndex={0} w={"100%"}>
          <AccordionItem w={"100%"}>
            <AccordionButton>
              <Box textAlign={"center"} fontSize="2xl" fontWeight={"bold"}>
                Règles de bases
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text textAlign={"center"} mt={2} fontSize="l">
                Vous avez 6 essais pour deviner un mot de 7 ou 8 lettres. Vous
                ne pouvez proposer que des mots commençant par la lettre
                initiale et qui se trouve dans notre dictionnaire. A chaque fois
                que vous proposez une solution, on vous donne des indications
              </Text>
              <Stack textAlign={"center"} spacing={0} mt={3}>
                <Text>
                  Si la lettre est coloriée en vert, elle est à la bonne place.
                </Text>
                <Text>
                  Si la lettre est coloriée en orange, elle est présente dans le
                  mot mais pas à cette place.
                </Text>
                <Text>
                  Si la lettre est coloriée en noire, elle n'est pas présente
                  dans le mot.
                </Text>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box textAlign={"center"} fontSize="2xl" fontWeight={"bold"}>
                Règles du 1 vs 1
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              Le but est de trouver le mot avec le moins de coup possible. Les
              joueurs disposent de 10 minutes maximum pour le deviner (valeur
              modifiable). Si un joueur trouve le mot mais que son adversaire a
              la possibilité de le trouver en moins de coup, il a 60 secondes
              pour le trouver à son tour (valeur modifiable). Si les deux
              joueurs ont trouvés le mot avec le même nombre d'essais, c'est le
              plus rapide qui gagne. Si aucun des deux joueurs n'a trouvé le mot
              au bout de 6 essais, ou à l'issue des 10 minutes, il y a égalité.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box textAlign={"center"} fontSize="2xl" fontWeight={"bold"}>
                Règles du Battle Royale
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              Le but est de trouver le mot le plus rapidement. A chaque manche,
              un pourcentage minimal de joueur est éliminé (10% par défaut) et
              ce jusqu'à ce qu'il n'en reste qu'un. Il y a un temps maximal pour
              trouver le mot, et un temps maximal pour trouver le mot après le
              premier joueur.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Layout>
  );
};

export default Rules;
