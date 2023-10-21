import { useColorMode, IconButton } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  console.log(`colorMode : ${colorMode}`);
  const isDark = colorMode === "dark";
  const preventFocus = (e: any) => {
    if (e.relatedTarget) {
      // Revert focus back to previous blurring element
      e.relatedTarget.focus();
    } else {
      // No previous focus target, blur instead
      e.currentTarget.blur();
    }
  };
  return (
    <IconButton
      onFocus={preventFocus}
      my={2}
      mr={4}
      icon={isDark ? <SunIcon /> : <MoonIcon />}
      aria-label="Toggle Theme"
      colorScheme="gray"
      onClick={toggleColorMode}
    />
  );
};
