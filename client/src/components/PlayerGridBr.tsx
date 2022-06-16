import { Box, Flex, Text } from "@chakra-ui/react";
import { useClassicWordInput } from "src/utils/hooks";
import { BrGameState, KeyboardSettings, MyFocus } from "src/utils/types";
import { PlayerGrid } from "./player-grid/PlayerGrid";

interface PlayerGridBrProps {
  gameState: BrGameState;
  spectate: boolean;
  isChatting:boolean;
  keyboardSettings:KeyboardSettings;
  word:string;
  setWord:React.Dispatch<React.SetStateAction<string>>;
  focus:MyFocus;
  setFocus:React.Dispatch<React.SetStateAction<MyFocus>>
  onEnter:Promise<void>  ;
}

export const PlayerGridBr: React.FC<PlayerGridBrProps> = ({
  gameState,
  spectate,
  isChatting,
  keyboardSettings,
  word,
  setWord,
  focus,
  setFocus,
  onEnter,
}) => {
  const {
    hasWon,
    triesHistory,
    firstLetter,
    nbLife,
    wordLength,
    isFinished,
    playerName,
  } = gameState;
  useClassicWordInput(
    word,
    setWord,
    gameState.wordLength ?? 0,
    () => onEnter,
    focus,
    setFocus,
    word.charAt(0).toUpperCase(),
    gameState.isFinished || isChatting || spectate
  );
  return (
    <PlayerGrid
      focus={focus}
      isVisible={true}
      firstLetter={firstLetter}
      wordLength={wordLength}
      nbLife={nbLife}
      word={word}
      triesHistory={triesHistory}
      isFinished={isFinished || isChatting}
      keyboardSetting={spectate ? undefined : keyboardSettings}
    />
  );
};
