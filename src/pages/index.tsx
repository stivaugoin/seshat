import {
  Badge,
  Divider,
  Group,
  Loader,
  Rating,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import { AlertError } from "../components/AlertError";
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
            <>
              <Link href={`/${book.isbn}`} key={book.isbn} passHref>
                <UnstyledButton>
                  <Stack spacing="sm">
                    <Text weight="bold">{book.title}</Text>

                    <Group>
                      {book.authors.map((author) => (
                        <Badge color="yellow" key={author} size="sm">
                          {author}
                        </Badge>
                      ))}
                    </Group>

                    {book.rating ? (
                      <Rating readOnly value={book.rating} size="sm" />
                    ) : (
                      <Text color="dimmed" italic size="sm">
                        No rating
                      </Text>
                    )}
                  </Stack>
                </UnstyledButton>
              </Link>

              {index < query.data.length - 1 && <Divider />}
            </>
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default BooksPage;
