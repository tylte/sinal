import { Box } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../components/Layout";

interface TestProps {}

const Test: React.FC<TestProps> = ({}) => {
  return (
    <Layout variant="grid">
      <Box>Yep</Box>
      <Box>Yep</Box>
    </Layout>
  );
};

export default Test;
