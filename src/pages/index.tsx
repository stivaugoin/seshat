import { Divider, Loader, Stack, Title, UnstyledButton } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { AlertError } from "../components/AlertError";
import { BookView } from "../components/BookView";
import { Layout } from "../components/Layout";
import { trpc } from "../utils/trpc";

const BooksPage: NextPage = () => {
  const query = trpc.getBooks.useQuery();

  return (
    <Layout py="xl">
      <Stack>
        <Title mb="xl">My books</Title>

        {query.isLoading && <Loader />}
        {query.error && <AlertError message={query.error.message} />}

        {query.data?.map((book, index) => (
          <Fragment key={book.id}>
            <UnstyledButton component={Link} href={`/${book.isbn}`} w="100%">
              <BookView book={book} />
            </UnstyledButton>

            {index < query.data.length - 1 && <Divider />}
          </Fragment>
        ))}
      </Stack>
    </Layout>
  );
};

export default BooksPage;
