import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { useEffect, useState } from "react";
import axios from "axios";
import { DictionaryContext } from "../utils/dico";

function MyApp({ Component, pageProps }: AppProps) {
  const [dictionary, setDictionnary] = useState<Set<string> | null>(null);

  useEffect(() => {
    axios.get<string[]>("http://localhost:4000/dictionary").then(({ data }) => {
      const set: Set<string> = new Set();
      data.forEach((word) => {
        set.add(word);
      });
      setDictionnary(set);
    });
  }, []);
  return (
    <DictionaryContext.Provider
      value={dictionary !== null ? dictionary : new Set()}
    >
      <ChakraProvider resetCSS theme={theme}>
        <DarkModeSwitch />
        <Component {...pageProps} />
      </ChakraProvider>
    </DictionaryContext.Provider>
  );
}

export default MyApp;
