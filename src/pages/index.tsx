import { Stack, Title } from "@mantine/core";
import { type NextPage } from "next";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout py="xl">
      <Stack>
        <Title>Home</Title>
      </Stack>
    </Layout>
  );
};

export default Home;
