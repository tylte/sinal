import { Flex, Text } from "@chakra-ui/react";
import { Layout } from "src/components/Layout";
import { PlayerGrid } from "src/components/player-grid/PlayerGrid";

const FourNotFourPage = () => {
  return (
    <Layout variant="large">
      <Flex direction={"column"}>
        <Text mb={5} align="center" fontSize={"6xl"}>
          Erreur 404
        </Text>
        <Text mb={5} align="center" fontSize={"3xl"}>
          La page demandé n'a pas été trouvé !
        </Text>
        <PlayerGrid
          isVisible={true}
          firstLetter={"U"}
          wordLength={12}
          nbLife={1}
          word={"URL INCONNUE"}
          triesHistory={[
            {
              wordTried: "URL INCONNUE",
              result: [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1],
            },
          ]}
          isFinished={false}
        ></PlayerGrid>
      </Flex>
    </Layout>
  );
};
export default FourNotFourPage;
