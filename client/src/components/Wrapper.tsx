import { Box, Grid } from "@chakra-ui/layout";
import React from "react";
import { Chat } from "./chat/Chat";

export type WrapperVariant = "small" | "regular" | "large" | "grid";

interface WrapperProps {
  variant?: WrapperVariant;
  children?: React.ReactNode;
}

export const variantSize = (variant: WrapperVariant) => {
  let size = "800";
  if (variant === "large") {
    size = "1000";
  } else if (variant === "small") {
    size = "400";
  }
  return size;
};

// Will wrap the body of the page, will usually never be used directly
// But by using the layout.

// The layout allow you to have 3 component on the page
// 1 : 1/4 of the screen | 2 : 1/2 of the screen | 3: (chat) 1/4 of the screen
// The thrid one will be the chat
export const Wrapper: React.FC<WrapperProps> = ({
  variant = "regular",
  children,
}) => {
  if (variant === "grid") {
    return (
      <Grid w="100%" templateColumns="1fr 2fr 1fr">
        {children}
        <Box>
          <Chat />
        </Box>
      </Grid>
    );
  } else {
    return (
      <Box mt={8} w="fit-content" maxW={variantSize(variant)} mx="auto">
        {children}
      </Box>
    );
  }
};
