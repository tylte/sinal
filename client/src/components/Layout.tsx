import React from "react";
import { Header } from "./Header";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ variant, children }) => {
  return (
    <>
      <Header />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
