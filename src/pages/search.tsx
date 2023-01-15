import { Button, Code, Loader, Stack, TextInput } from "@mantine/core";
import type { inferRouterOutputs } from "@trpc/server";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import type { FormEvent } from "react";
import { AlertError } from "../components/AlertError";
import { Layout } from "../components/Layout";
import type { AppRouter } from "../server/api/router";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const search = api.search.useMutation();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = e.currentTarget.search.value as string;

    await search.mutateAsync(
      isIsbn(value) ? { isbn: value } : { query: value }
    );
  };

  return (
    <Layout py="xl">
      <Stack spacing="xl">
        <form method="post" onSubmit={handleSearch}>
          <TextInput
            name="search"
            placeholder="Search book by ISBN"
            size="lg"
            type="search"
          />
        </form>

        {search.isLoading && <Loader />}
        {search.error && <AlertError message={search.error.message} />}
        {search.data?.length === 0 && <AlertError message="No results" />}
        {search.data?.length && <Result data={search.data} />}
      </Stack>
    </Layout>
  );
};

export default Home;

function Result({ data }: { data: inferRouterOutputs<AppRouter>["search"] }) {
  const router = useRouter();
  const addBook = api.create.useMutation();

  const handleClickAdd = async ({ isbn }: { isbn: string }) => {
    if (!data || data.length === 0) return;
    const book = data.find(({ book }) => book.isbn === isbn)?.book;
    if (!book) return;

    const newBook = await addBook.mutateAsync({
      authors: book.authors,
      description: book.description,
      isbn: book.isbn,
      pages: book.pages,
      publishedYear: book.publishedYear,
      title: book.title,
    });

    router.push(`/${newBook.isbn}`);
  };

  return (
    <>
      {addBook.error && <AlertError message={addBook.error.message} />}

      {data.map(({ book, source }) => (
        <Stack key={book.isbn}>
          <Code block>{JSON.stringify(book, null, 4)}</Code>

          {source === "database" && (
            <Button onClick={() => router.push(`/${book?.isbn}`)}>
              View in bookshelf
            </Button>
          )}

          {source === "googleApi" && (
            <Button
              loading={addBook.isLoading}
              onClick={() => handleClickAdd({ isbn: book.isbn })}
            >
              Add to bookshelf
            </Button>
          )}
        </Stack>
      ))}
    </>
  );
}

function isIsbn(value: string) {
  return value.length === 13 && !isNaN(Number(value));
}
