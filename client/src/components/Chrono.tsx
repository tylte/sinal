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
  const countRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    countRef.current = setInterval(() => {
      let currentMsRemaining = endPoint - Date.now();
      if (currentMsRemaining <= 0) {
        onTimeFinish();
      }
      setMsRemaining(currentMsRemaining);
    }, 1000);

    return () => {
      countRef.current && clearInterval(countRef.current);
    };
  }, [endPoint]);

  return (
    <Box>
      {/* the timer of the game */}
      <Text
        color={
          minutesToDisplay <= 0 && secondsToDisplay <= 30 ? "red" : ""
        }
        align="center"
        fontSize="larger"
      >
        {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
      </Text>
    </Box>
  );
};
