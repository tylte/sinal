import { Box, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { twoDigits } from "src/utils/types";

interface ChronoProps {
  endPoint: number;
  onTimeFinish: () => void;
}

export const Chrono: React.FC<ChronoProps> = ({ endPoint, onTimeFinish }) => {
  const [msRemaining, setMsRemaining] = useState(endPoint - Date.now());
  const secondsToDisplay = Math.trunc((msRemaining / 1000) % 60);
  const minutesRemaining = msRemaining / 1000 / 60;
  const minutesToDisplay = Math.trunc(minutesRemaining);

  //the interval of the chrono
  const countRef = useRef<NodeJS.Timeout>(
    setInterval(() => {
      setMsRemaining((timer) => timer - 0);
    }, 0)
  );

  if (msRemaining <= 0) {
    clearInterval(countRef.current);
    //set 1 ms to avoid re-entering the if
    setMsRemaining(1);
    onTimeFinish();
  }

  useEffect(() => {
    if (endPoint !== undefined) {
      clearInterval(countRef.current);
      countRef.current = setInterval(() => {
        setMsRemaining(endPoint - Date.now());
      }, 1000);
    }

    return () => {
      clearInterval(countRef.current);
    };
  }, [endPoint]);

  return (
    <Box>
      {/* the timer of the game */}
      <Text
        color={
          minutesToDisplay <= 0 && secondsToDisplay <= 30 ? "red" : "white"
        }
        align="center"
        fontSize="larger"
      >
        {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
      </Text>
    </Box>
  );
};
