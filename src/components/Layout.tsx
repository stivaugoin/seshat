import { Container, Header, Title } from "@mantine/core";
import { type ComponentProps } from "react";

interface Props extends ComponentProps<typeof Container> {
  children: React.ReactNode;
}

export function Layout({ children, ...containerProps }: Props) {
  return (
    <>
      <Header height={60} pos="sticky" zIndex={900}>
        <Container
          sx={{ display: "flex", alignItems: "center", height: "100%" }}
        >
          <Title size={24}>Seshat - My virtual bookshelf</Title>
        </Container>
      </Header>

      <Container {...containerProps}>{children}</Container>
    </>
  );
}
