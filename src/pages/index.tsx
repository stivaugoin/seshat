import { Container, Header, Title } from "@mantine/core";
import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <Header height={60}>
      <Container sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Title size={24}>Seshat - My virtual bookshelf</Title>
      </Container>
    </Header>
  );
};

export default Home;
