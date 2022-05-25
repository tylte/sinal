import { Box, Grid, Text } from "@chakra-ui/layout";
import React from "react";
import { Chat } from "./Chat";

export type WrapperVariant = "small" | "regular" | "large" | "grid";

interface WrapperProps {
  variant?: WrapperVariant;
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
      <Box mt={8} w="100%" maxW={variantSize(variant)} mx="auto">
        {children}
      </Box>
    );
  }
};
