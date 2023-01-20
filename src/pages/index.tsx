import { Divider, Loader, Stack, Title, UnstyledButton } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { AlertError } from "../components/AlertError";
import { BookView } from "../components/BookView";
import { Layout } from "../components/Layout";
import { api } from "../utils/api";

const BooksPage: NextPage = () => {
  const query = api.getBooks.useQuery();

  return (
    <Layout py="xl">
      <Stack spacing="xl">
        <Title>My books</Title>

        {query.isLoading && <Loader />}
        {query.error && <AlertError message={query.error.message} />}

        <Stack spacing="md">
          {query.data?.map((book, index) => (
            <Fragment key={book.id}>
              <UnstyledButton component={Link} href={`/${book.isbn}`} w="100%">
                <BookView book={book} />
              </UnstyledButton>

              {index < query.data.length - 1 && <Divider />}
            </Fragment>
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default BooksPage;
