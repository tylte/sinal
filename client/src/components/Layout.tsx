import Head from "next/head";
import React from "react";
import { Header } from "./Header";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariant;
  children?: React.ReactNode;
}

// This is the highest level component for the application GUI
// You can control wrapper variant through the layout variant
// You should almost always use Layout instead of Wrapper for pages
export const Layout: React.FC<LayoutProps> = ({ variant, children }) => {
  return (
    <>
      <Head>
        <title>Sutom is not about luck</title>
        <meta property="og:title" content="SINAL - Sutom is not about luck" />
        <meta
          property="og:description"
          content="Affrontez vos amis au Sutom"
          key="description"
        />
      </Head>
      <Header />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
