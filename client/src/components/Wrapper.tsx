import { Box } from "@chakra-ui/layout";
import React from "react";

export type WrapperVariant = "small" | "regular" | "large" | "full";

interface WrapperProps {
  variant?: WrapperVariant;
}

export const variantSize = (variant: WrapperVariant) => {
  let size = "800";
  if (variant === "large") {
    size = "1000";
  } else if (variant === "small") {
    size = "400";
  } else if (variant === "full") {
    size = "100%";
  }
  return size;
};

export const Wrapper: React.FC<WrapperProps> = ({
  variant = "regular",
  children,
}) => {
  return (
    <Box mt={8} w="100%" maxW={variantSize(variant)} mx="auto">
      {children}
    </Box>
  );
};
