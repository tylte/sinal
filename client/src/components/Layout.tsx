import React from "react";
import { Header } from "./Header";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariant;
}

// This is the highest level component for the application GUI
// You can control wrapper variant through the layout variant
// You should almost always use Layout instead of Wrapper for pages
export const Layout: React.FC<LayoutProps> = ({ variant, children }) => {
  return (
    <>
      <Header />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
